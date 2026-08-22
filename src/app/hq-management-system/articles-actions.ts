"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { articleSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { parseNumericId } from '@/lib/validate-id';

export async function getArticlesAction() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("[ArticlesAction] fetch error:", err);
    return { success: false, error: err.message };
  }
}

export async function saveArticleAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const publishedDate = formData.get('published_date') as string;

    const articleData = {
      title,
      excerpt,
      content,
      author,
      published_date: publishedDate || new Date().toISOString().split('T')[0],
    };

    // Validate with Zod
    articleSchema.parse(articleData);

    const numericId = parseNumericId(id);
    if (numericId) {
      const { error } = await supabaseAdmin
        .from('articles')
        .update(articleData)
        .eq('id', numericId);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from('articles')
        .insert([articleData]);
      if (error) throw error;
    }

    revalidatePath('/articles');
    revalidatePath('/hq-management-system/articles');
    
    return { success: true };
  } catch (err: any) {
    console.error("[ArticlesAction] save error:", err);
    return { success: false, error: err.message || "حدث خطأ غير متوقع" };
  }
}

export async function deleteArticleAction(id: number | string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const numericId = parseNumericId(id);
  if (!numericId) {
    return { success: false, error: 'Invalid ID' };
  }

  try {
    const { error } = await supabaseAdmin.from('articles').delete().eq('id', numericId);
    if (error) throw error;
    
    revalidatePath('/articles');
    revalidatePath('/hq-management-system/articles');
    return { success: true };
  } catch (err: any) {
    console.error("[ArticlesAction] delete error:", err);
    return { success: false, error: err.message };
  }
}
