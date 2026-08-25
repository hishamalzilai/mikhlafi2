import 'server-only';

import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  getCairoDate,
  type ViewContentType,
  VIEW_TYPE_CONFIG,
} from '@/lib/page-views';

export async function getPageViewCount(type: ViewContentType, contentId: string) {
  const { data, error } = await supabaseAdmin
    .from('page_view_totals')
    .select('views')
    .eq('content_type', type)
    .eq('content_id', contentId)
    .maybeSingle();

  if (error) {
    console.error('[page views] Failed to load count. Apply the Supabase analytics migration:', error);
    return 0;
  }

  return typeof data?.views === 'number' ? data.views : Number(data?.views ?? 0);
}

export async function recordPageView(
  type: ViewContentType,
  contentId: string,
  title: string,
) {
  const config = VIEW_TYPE_CONFIG[type];
  const { data, error } = await supabaseAdmin.rpc('increment_page_view', {
    p_content_type: type,
    p_content_id: contentId,
    p_title: title.trim() || config.label,
    p_path: `/${config.path}/${contentId}`,
    p_local_date: getCairoDate(),
  });

  if (error) {
    console.error('[page views] Atomic increment failed. Apply the Supabase analytics migration:', error);
    return getPageViewCount(type, contentId);
  }

  const views = typeof data === 'number' ? data : Number(data);
  return Number.isFinite(views) && views >= 0 ? views : getPageViewCount(type, contentId);
}
