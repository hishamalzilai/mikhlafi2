"use server";

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from './auth-actions';
import { testimonialSchema } from '@/lib/schemas';

export async function getTestimonialsAction() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, title, author_name, author_title, content, author_image, order_index, published_date, created_at')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createTestimonial(formData: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized');

  try {
    const validatedData = testimonialSchema.parse(formData);
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([validatedData]);

    if (error) throw new Error(error.message);
    revalidatePath('/testimonials');
    revalidatePath('/hq-management-system/testimonials');
    return data;
  } catch (err: any) {
     throw new Error(err.issues?.[0]?.message || err.message);
  }
}

export async function updateTestimonial(id: string, formData: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized');

  try {
    const validatedData = testimonialSchema.parse(formData);
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/testimonials');
    revalidatePath('/hq-management-system/testimonials');
    return data;
  } catch (err: any) {
    throw new Error(err.issues?.[0]?.message || err.message);
  }
}

export async function deleteTestimonial(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/testimonials');
  revalidatePath('/hq-management-system/testimonials');
  return { success: true };
}
