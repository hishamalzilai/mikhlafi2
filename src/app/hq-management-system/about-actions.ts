"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { checkAdminSession } from './auth-actions';
import { aboutSchema } from '@/lib/schemas';

export type AboutContent = {
  text: string;
};

export async function getAboutContentAction(): Promise<AboutContent | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('content')
    .eq('id', 'about_us')
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error("[getAboutContentAction] error:", error);
    }
    return null;
  }

  return data.content as AboutContent;
}

export async function saveAboutContentAction(content: AboutContent) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بإجراء هذا التعديل.' };
  }

  try {
    const validatedContent = aboutSchema.parse(content);
    
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ 
        id: 'about_us', 
        content: validatedContent, 
        updated_at: new Date().toISOString() 
      });

    if (error) {
      console.error("[saveAboutContentAction] error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath('/about');
    revalidatePath('/hq-management-system/about');
    
    return { success: true };
  } catch (err: any) {
    console.error("[saveAboutContentAction] validation/save error:", err);
    return { success: false, error: err.issues?.[0]?.message || err.message || "حدث خطأ غير متوقع" };
  }
}
