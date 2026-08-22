"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { mediaLibrarySchema } from '@/lib/schemas';
import { isValidMediaUrl, isValidImageUrl } from '@/lib/validate-url';
import { revalidatePath } from 'next/cache';

export async function getLibraryAction() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveLibraryItemAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const duration = formData.get('duration') as string;

    if (thumbnail_url && !isValidMediaUrl(thumbnail_url) && !isValidImageUrl(thumbnail_url)) {
      return { success: false, error: 'رابط الصورة المصغرة غير آمن أو غير مسموح به' };
    }

    const mediaData = {
      title,
      description,
      type,
      thumbnail_url,
      duration: type === 'video' ? duration : null,
    };

    mediaLibrarySchema.parse(mediaData);

    if (id && id !== "null" && id !== "undefined") {
      const { error } = await supabaseAdmin.from('media_library').update(mediaData).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from('media_library').insert([mediaData]);
      if (error) throw error;
    }

    revalidatePath('/library');
    revalidatePath('/hq-management-system/library');
    return { success: true };
  } catch (err: any) {
    console.error("[LibraryAction] save error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteLibraryItemAction(id: number) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabaseAdmin.from('media_library').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/library');
    revalidatePath('/hq-management-system/library');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function bulkSaveLibraryItemsAction(items: any[]) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const validatedItems = items.map((item, idx) => {
      try {
        return mediaLibrarySchema.parse(item);
      } catch (err: any) {
        throw new Error(`Validation failed for item ${idx + 1}: ${err.issues?.[0]?.message || err.message}`);
      }
    });

    const { data, error } = await supabaseAdmin
      .from('media_library')
      .insert(validatedItems);

    if (error) throw error;

    revalidatePath('/library');
    revalidatePath('/hq-management-system/library');
    return { success: true, count: validatedItems.length };
  } catch (err: any) {
    console.error("[LibraryAction] bulk save error:", err);
    return { success: false, error: err.message };
  }
}
