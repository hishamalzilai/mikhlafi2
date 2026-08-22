"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { newsSchema } from '@/lib/schemas';
import { isValidImageUrl } from '@/lib/validate-url';
import { IMAGE_MIME_TYPES, validateFileMagicBytes } from '@/lib/file-validation';
import { revalidatePath } from 'next/cache';
import { parseNumericId } from '@/lib/validate-id';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAGIC_BYTES_SAMPLE_SIZE = 12;

export async function getNewsAction() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("[NewsAction] fetch error");
    return { success: false, error: err.message };
  }
}

export async function saveNewsAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const publishedDate = formData.get('published_date') as string;
    const imageFile = formData.get('image') as File | null;

    let image_url = formData.get('existing_image_url') as string || '';

    // Reject unsafe image URLs supplied by the client
    if (image_url && !isValidImageUrl(image_url)) {
      return { success: false, error: 'رابط الصورة غير آمن أو غير مسموح به' };
    }

    // Handle image upload
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      const fileExt = (imageFile.name.split('.').pop() || '').toLowerCase();

      if (!ALLOWED_IMAGE_EXTENSIONS.includes(fileExt)) {
        return { success: false, error: `امتداد الصورة غير مسموح: .${fileExt}` };
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return { success: false, error: `حجم الصورة يتجاوز الحد الأقصى (5MB)` };
      }

      if (!IMAGE_MIME_TYPES.includes(imageFile.type as any)) {
        return { success: false, error: `نوع MIME غير مسموح: ${imageFile.type}` };
      }

      const fileHead = await imageFile.slice(0, MAGIC_BYTES_SAMPLE_SIZE).arrayBuffer();
      if (!validateFileMagicBytes(fileHead, IMAGE_MIME_TYPES as unknown as string[])) {
        return { success: false, error: 'محتوى الصورة لا يطابق النوع المعلن. رفع مرفوض.' };
      }

      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `news/${fileName}`;
      
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        const { error: uploadError } = await supabaseAdmin.storage
          .from('media')
          .upload(filePath, buffer, { 
            contentType: imageFile.type,
            upsert: false 
          });
          
        if (uploadError) {
          throw new Error("فشل رفع الصورة: " + uploadError.message);
        }
        
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('media')
          .getPublicUrl(filePath);
          
        image_url = publicUrlData.publicUrl;

        if (!isValidImageUrl(image_url)) {
          return { success: false, error: 'رابط الصورة المرفوعة غير صالح' };
        }
      } catch (uploadErr: any) {
        console.error("[NewsAction] upload error");
        throw uploadErr;
      }
    }

    const newsData = {
      title,
      excerpt,
      content,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
      image_url
    };

    // Validate with Zod
    newsSchema.parse(newsData);

    const numericId = parseNumericId(id);
    if (numericId) {
      const { error } = await supabaseAdmin
        .from('news')
        .update(newsData)
        .eq('id', numericId);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('news')
        .insert([newsData]);
      if (error) throw error;
    }

    revalidatePath('/news');
    revalidatePath('/hq-management-system/news');
    
    return { success: true };
  } catch (err: any) {
    console.error("[NewsAction] save error");
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

export async function deleteNewsAction(id: number | string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const numericId = parseNumericId(id);
  if (!numericId) {
    return { success: false, error: 'Invalid ID' };
  }

  try {
    const { error } = await supabaseAdmin.from('news').delete().eq('id', numericId);
    if (error) throw error;
    
    revalidatePath('/news');
    revalidatePath('/hq-management-system/news');
    return { success: true };
  } catch (err: any) {
    console.error("[NewsAction] delete error");
    return { success: false, error: err.message };
  }
}
