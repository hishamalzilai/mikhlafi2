"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { studySchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { parseNumericId } from '@/lib/validate-id';

export async function getStudiesAction() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('studies')
      .select('*')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveStudyAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const publishedDate = formData.get('published_date') as string;

    const studyData = {
      title,
      excerpt,
      content,
      author,
      category,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
    };

    // Validate with Zod
    studySchema.parse(studyData);

    const numericId = parseNumericId(id);
    if (numericId) {
      // Update
      const { error } = await supabaseAdmin
        .from('studies')
        .update(studyData)
        .eq('id', numericId);
      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabaseAdmin
        .from('studies')
        .insert([studyData]);
      if (error) throw error;
    }

    revalidatePath('/vision');
    revalidatePath('/hq-management-system/vision');
    
    return { success: true };
  } catch (err: any) {
    console.error("Save Study Error:", err);
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

export async function deleteStudyAction(id: number | string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const numericId = parseNumericId(id);
  if (!numericId) {
    return { success: false, error: 'Invalid ID' };
  }

  try {
    const { error } = await supabaseAdmin.from('studies').delete().eq('id', numericId);
    if (error) throw error;
    
    revalidatePath('/vision');
    revalidatePath('/hq-management-system/vision');
    return { success: true };
  } catch (err: any) {
    console.error("Delete Study Error:", err);
    return { success: false, error: err.message };
  }
}
