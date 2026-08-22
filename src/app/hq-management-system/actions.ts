"use server";

import fs from 'fs';
import path from 'path';
import { cvSchema } from '@/lib/schemas';
import { checkAdminSession } from './auth-actions';

export async function getCvData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cv.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function saveCvData(data: unknown) {
  // Security Check: Verify admin session
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بحفظ التغييرات.' };
  }

  try {
    const validatedData = cvSchema.parse(data);
    const filePath = path.join(process.cwd(), 'src', 'data', 'cv.json');
    fs.writeFileSync(filePath, JSON.stringify(validatedData, null, 2), 'utf8');
    return { success: true };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'issues' in e) {
      const zodErr = e as { issues?: { message: string }[] };
      return { success: false, error: zodErr.issues?.[0]?.message || 'بيانات السيرة الذاتية غير صالحة' };
    }
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function findDuplicatesAction(section: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك.' };
  }

  const validSections = ['articles', 'news', 'archive', 'testimonials'];
  if (!validSections.includes(section)) {
    return { success: false, error: 'قسم غير صالح.' };
  }

  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    // Fetch relevant fields to identify duplicates
    let items: any[] = [];
    
    if (section === 'testimonials') {
      const { data, error } = await supabaseAdmin
        .from('testimonials')
        .select('id, title, author_name, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      items = data || [];
    } else {
      const { data, error } = await supabaseAdmin
        .from(section)
        .select('id, title, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      items = data || [];
    }

    // Grouping logic (strong algorithm to find exact or near duplicates by title/name)
    const grouped = new Map<string, any[]>();
    for (const item of items) {
      let identifierKey = (item.title || item.author_name || 'بدون عنوان').trim();
      // Normalize spaces and lowercase for strict duplicate matching
      identifierKey = identifierKey.replace(/\s+/g, ' ').toLowerCase();
      
      if (!grouped.has(identifierKey)) {
        grouped.set(identifierKey, []);
      }
      grouped.get(identifierKey)!.push(item);
    }

    // Filter to only groups that have more than 1 item
    const duplicates = Array.from(grouped.entries())
      .filter(([_, items]) => items.length > 1)
      .map(([_, items]) => ({
        displayTitle: items[0].title || items[0].author_name || 'بدون عنوان',
        count: items.length,
        items
      }));

    return { success: true, duplicates };
  } catch (err: any) {
    console.error(`[findDuplicatesAction] error finding duplicates in ${section}:`, err);
    return { success: false, error: err.message || 'حدث خطأ أثناء البحث عن التكرارات' };
  }
}

export async function deleteSpecificItemsAction(section: string, ids: number[]) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بحذف البيانات.' };
  }

  const validSections = ['articles', 'news', 'archive', 'testimonials'];
  if (!validSections.includes(section)) {
    return { success: false, error: 'قسم غير صالح للحذف.' };
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return { success: false, error: 'لم يتم تحديد أي عناصر للحذف.' };
  }

  // Validate all IDs are finite positive integers and cap at 100
  const sanitizedIds = ids
    .filter((id): id is number => typeof id === 'number' && Number.isFinite(id) && Number.isInteger(id) && id > 0)
    .slice(0, 100);

  if (sanitizedIds.length === 0) {
    return { success: false, error: 'جميع المعرفات المحددة غير صالحة.' };
  }

  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    
    const { error } = await supabaseAdmin.from(section).delete().in('id', sanitizedIds);
    if (error) throw error;

    // Revalidate the affected paths
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/${section}`);
    revalidatePath(`/hq-management-system/${section}`);

    return { success: true };
  } catch (err: any) {
    console.error(`[deleteSpecificItemsAction] error deleting from ${section}:`, err);
    return { success: false, error: err.message || 'حدث خطأ أثناء الحذف' };
  }
}
