"use server";

import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function verifyAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || normalizedEmail.length > 254 || !password || password.length > 1024) {
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    }

    if (data.user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut({ scope: 'local' });
      return { success: false, error: 'هذا الحساب غير مخول بالدخول إلى لوحة الإدارة.' };
    }

    return { success: true };
  } catch (error) {
    console.error('[verifyAdmin] Supabase Auth error:', error);
    return { success: false, error: 'تعذر الاتصال بخدمة تسجيل الدخول.' };
  }
}

export async function logoutAdmin() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut({ scope: 'local' });
  } catch (error) {
    console.error('[logoutAdmin] Supabase Auth error:', error);
  }
}

export async function checkAdminSession() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    return !error && data.user?.app_metadata?.role === 'admin';
  } catch (error) {
    console.error('[checkAdminSession] Supabase Auth error:', error);
    return false;
  }
}
