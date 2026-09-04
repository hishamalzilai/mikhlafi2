"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { DEFAULT_NAV_ORDER, MASTER_NAVIGATION } from '@/lib/nav-config';
import { navigationOrderSchema } from '@/lib/schemas';
import { checkAdminSession } from './auth-actions';

function addMissingNavigationItems(order: string[]) {
  const validIds = MASTER_NAVIGATION.map(item => item.id);
  const normalized = order.filter((id, index) => validIds.includes(id) && order.indexOf(id) === index);

  for (const item of MASTER_NAVIGATION) {
    if (normalized.includes(item.id)) continue;
    const masterIndex = validIds.indexOf(item.id);
    const previousId = [...validIds.slice(0, masterIndex)].reverse().find(id => normalized.includes(id));
    const insertionIndex = previousId ? normalized.indexOf(previousId) + 1 : 0;
    normalized.splice(insertionIndex, 0, item.id);
  }

  return normalized;
}

export async function getNavOrder() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('id', 'navigation')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return DEFAULT_NAV_ORDER;
      }
      console.error("Error fetching nav order:", error);
      return DEFAULT_NAV_ORDER;
    }

    return addMissingNavigationItems((data.content as string[]) || DEFAULT_NAV_ORDER);
  } catch (err) {
    console.error("Nav fetch catch:", err);
    return DEFAULT_NAV_ORDER;
  }
}

export async function updateNavOrder(order: string[]) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح لك بإجراء هذا التعديل.' };
  }

  try {
    // Validate input shape
    navigationOrderSchema.parse(order);

    // Basic validation: ensure all IDs are valid
    const validIds = MASTER_NAVIGATION.map(n => n.id);
    const sanitizedOrder = order.filter(id => validIds.includes(id));
    
    // Add missing IDs at the end if any
    const missingIds = validIds.filter(id => !sanitizedOrder.includes(id));
    const finalOrder = [...sanitizedOrder, ...missingIds];

    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ 
        id: 'navigation', 
        content: finalOrder, 
        updated_at: new Date().toISOString() 
      });

    if (error) {
      throw error;
    }

    revalidatePath('/');
    revalidatePath('/hq-management-system/navigation');
    return { success: true };
  } catch (err: unknown) {
    console.error("Error updating nav order:", err);
    const issue = err && typeof err === 'object' && 'issues' in err
      ? (err as { issues?: Array<{ message?: string }> }).issues?.[0]?.message
      : undefined;
    return { success: false, error: issue || (err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الترتيب') };
  }
}
