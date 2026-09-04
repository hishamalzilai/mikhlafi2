"use server";

import { revalidatePath, revalidateTag } from 'next/cache';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { quoteTweetSchema } from '@/lib/schemas';
import { parseNumericId } from '@/lib/validate-id';
import { CACHE_TAGS } from '@/lib/cache';

export async function getQuotesAction() {
  if (!(await checkAdminSession())) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('quotes_tweets')
      .select('*')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'تعذر تحميل البيانات' };
  }
}

export async function saveQuoteAction(formData: FormData) {
  if (!(await checkAdminSession())) return { success: false, error: 'Unauthorized' };

  try {
    const id = parseNumericId(formData.get('id') as string | null);
    const record = quoteTweetSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt') || '',
      author: formData.get('author'),
      content_type: formData.get('content_type'),
      source_url: formData.get('source_url') || '',
      published_date: formData.get('published_date') || new Date().toISOString().split('T')[0],
    });

    const query = id
      ? supabaseAdmin.from('quotes_tweets').update(record).eq('id', id)
      : supabaseAdmin.from('quotes_tweets').insert([record]);
    const { error } = await query;
    if (error) throw error;

    revalidatePath('/quotes');
    revalidatePath('/hq-management-system/quotes');
    revalidateTag(CACHE_TAGS.quotes, 'default');
    return { success: true };
  } catch (error: unknown) {
    const issue = error && typeof error === 'object' && 'issues' in error
      ? (error as { issues?: Array<{ message?: string }> }).issues?.[0]?.message
      : undefined;
    return { success: false, error: issue || (error instanceof Error ? error.message : 'حدث خطأ غير متوقع') };
  }
}

export async function deleteQuoteAction(id: number | string) {
  if (!(await checkAdminSession())) return { success: false, error: 'Unauthorized' };
  const numericId = parseNumericId(id);
  if (!numericId) return { success: false, error: 'معرّف غير صالح' };

  try {
    const { error } = await supabaseAdmin.from('quotes_tweets').delete().eq('id', numericId);
    if (error) throw error;
    revalidatePath('/quotes');
    revalidatePath('/hq-management-system/quotes');
    revalidateTag(CACHE_TAGS.quotes, 'default');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'تعذر حذف المحتوى' };
  }
}
