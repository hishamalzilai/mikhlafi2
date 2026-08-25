'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Eye, Loader2, TrendingUp } from 'lucide-react';

type AnalyticsData = {
  todayViews: number;
  totalViews: number;
  topPages: Array<{
    title: string;
    path: string;
    contentType: string;
    views: number;
  }>;
};

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/admin/analytics', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as
          | AnalyticsData
          | { error?: string }
          | null;

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('انتهت جلسة الإدارة. أعد تسجيل الدخول ثم حاول مرة أخرى.');
          }
          throw new Error(
            payload && 'error' in payload && payload.error
              ? payload.error
              : `تعذر تحميل الإحصاءات (${response.status})`,
          );
        }

        return payload as AnalyticsData;
      })
      .then(setData)
      .catch((caught: unknown) => {
        if (caught instanceof Error && caught.name !== 'AbortError') setError(caught.message);
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return <div className="mb-10 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">{error}</div>;
  }

  if (!data) {
    return (
      <div className="mb-10 flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
        <Loader2 className="ml-3 h-6 w-6 animate-spin text-[#b18c39]" />
        جاري تحميل إحصاءات الزيارات...
      </div>
    );
  }

  return (
    <section className="mb-10" aria-labelledby="analytics-heading">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b18c39]/10 text-[#b18c39]">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h2 id="analytics-heading" className="text-xl font-black text-slate-900">إحصاءات الزيارات</h2>
          <p className="text-sm font-medium text-slate-500">كل فتح لصفحة منشور يُحتسب كمشاهدة مستقلة</p>
        </div>
      </div>

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-bold text-slate-500">زيارات اليوم</span>
            <Eye className="h-6 w-6 text-[#b18c39]" />
          </div>
          <strong className="text-4xl font-black text-slate-900">{data.todayViews.toLocaleString('ar-EG')}</strong>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-bold text-slate-500">إجمالي المشاهدات</span>
            <TrendingUp className="h-6 w-6 text-[#b18c39]" />
          </div>
          <strong className="text-4xl font-black text-slate-900">{data.totalViews.toLocaleString('ar-EG')}</strong>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-lg font-black text-slate-900">أكثر الصفحات زيارة</h3>
        </div>
        {data.topPages.length === 0 ? (
          <p className="p-8 text-center font-medium text-slate-500">لا توجد مشاهدات مسجلة حتى الآن.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center gap-4 p-4 md:p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-black text-slate-600">
                  {(index + 1).toLocaleString('ar-EG')}
                </span>
                <div className="min-w-0 flex-1">
                  <a href={page.path} target="_blank" rel="noopener noreferrer" className="block truncate font-bold text-slate-800 hover:text-[#b18c39]">
                    {page.title}
                  </a>
                  <span className="text-xs font-medium text-slate-400">{page.contentType}</span>
                </div>
                <span className="shrink-0 rounded-full bg-[#b18c39]/10 px-3 py-1.5 text-sm font-black text-[#8b6b25]">
                  {page.views.toLocaleString('ar-EG')} مشاهدة
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
