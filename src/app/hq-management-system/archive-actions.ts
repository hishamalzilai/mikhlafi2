"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { archiveSchema } from '@/lib/schemas';
import { isValidImageUrl, isValidGeneralUrl } from '@/lib/validate-url';
import { revalidatePath } from 'next/cache';
import { parseNumericId } from '@/lib/validate-id';

export async function getArchiveItemsAction() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('archive')
      .select('*')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveArchiveItemAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const publishedDate = formData.get('published_date') as string;
    const fileUrl = formData.get('file_url') as string;
    const coverUrl = formData.get('cover_url') as string;

    if (fileUrl && !isValidGeneralUrl(fileUrl)) {
      return { success: false, error: 'رابط الملف غير آمن أو غير مسموح به' };
    }
    if (coverUrl && !isValidImageUrl(coverUrl)) {
      return { success: false, error: 'رابط صورة الغلاف غير آمن أو غير مسموح به' };
    }

    const archiveData = {
      title,
      description,
      type,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
      file_url: fileUrl || null,
      cover_url: coverUrl || null,
    };

    archiveSchema.parse(archiveData);

    const numericId = parseNumericId(id);
    if (numericId) {
      const { error } = await supabaseAdmin.from('archive').update(archiveData).eq('id', numericId);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from('archive').insert([archiveData]);
      if (error) throw error;
    }

    revalidatePath('/archive');
    revalidatePath('/hq-management-system/archive');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteArchiveItemAction(id: number | string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const numericId = parseNumericId(id);
  if (!numericId) {
    return { success: false, error: 'Invalid ID' };
  }

  try {
    const { error } = await supabaseAdmin.from('archive').delete().eq('id', numericId);
    if (error) throw error;
    revalidatePath('/archive');
    revalidatePath('/hq-management-system/archive');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
