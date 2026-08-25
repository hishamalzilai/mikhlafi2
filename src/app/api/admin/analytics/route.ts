import { NextResponse } from 'next/server';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  getCairoDate,
  isViewContentType,
  VIEW_TYPE_CONFIG,
} from '@/lib/page-views';

export const dynamic = 'force-dynamic';

type AnalyticsRow = {
  title: string;
  path: string;
  contentType: string;
  views: number;
};

type AnalyticsResult = {
  todayViews?: unknown;
  totalViews?: unknown;
  topPages?: unknown;
};

function asSafeCount(value: unknown) {
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count : 0;
}

async function loadAnalyticsFromTables() {
  const [totalsResult, dailyResult] = await Promise.all([
    supabaseAdmin
      .from('page_view_totals')
      .select('title, path, content_type, views')
      .order('views', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('page_view_daily')
      .select('views')
      .eq('view_date', getCairoDate()),
  ]);

  if (totalsResult.error) throw totalsResult.error;
  if (dailyResult.error) throw dailyResult.error;

  const topPages = (totalsResult.data ?? []).flatMap((row) => {
    if (!isViewContentType(row.content_type)) return [];
    return [{
      title: row.title,
      path: row.path,
      contentType: VIEW_TYPE_CONFIG[row.content_type].label,
      views: asSafeCount(row.views),
    }];
  });

  return {
    todayViews: (dailyResult.data ?? []).reduce((sum, row) => sum + asSafeCount(row.views), 0),
    totalViews: (totalsResult.data ?? []).reduce((sum, row) => sum + asSafeCount(row.views), 0),
    topPages,
  };
}

export async function GET() {
  if (!(await checkAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح لك.' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('get_page_view_analytics', {
      p_local_date: getCairoDate(),
      p_limit: 10,
    });

    if (error) {
      console.warn('[admin analytics] RPC unavailable; using table fallback:', error.message);
      return NextResponse.json(await loadAnalyticsFromTables(), {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const result = (data && typeof data === 'object' ? data : {}) as AnalyticsResult;
    const rawTopPages = Array.isArray(result.topPages) ? result.topPages : [];
    const topPages: AnalyticsRow[] = rawTopPages.flatMap((value) => {
      if (!value || typeof value !== 'object') return [];
      const row = value as Record<string, unknown>;
      const contentType = row.contentType;
      if (
        typeof row.title !== 'string' ||
        typeof row.path !== 'string' ||
        !isViewContentType(contentType)
      ) return [];

      return [{
        title: row.title,
        path: row.path,
        contentType: VIEW_TYPE_CONFIG[contentType].label,
        views: asSafeCount(row.views),
      }];
    });

    return NextResponse.json(
      {
        todayViews: asSafeCount(result.todayViews),
        totalViews: asSafeCount(result.totalViews),
        topPages,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('[admin analytics]', error);
    return NextResponse.json({ error: 'تعذر تحميل إحصاءات الزيارات.' }, { status: 500 });
  }
}
