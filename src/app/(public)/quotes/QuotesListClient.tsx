"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft, MessageSquareQuote, UserRound } from 'lucide-react';

type QuoteItem = {
  id: number;
  title: string;
  content: string;
  excerpt?: string | null;
  author: string;
  content_type: 'قول' | 'تغريدة';
  published_date?: string | null;
};

export default function QuotesListClient({ items }: { items: QuoteItem[] }) {
  const [filter, setFilter] = useState<'الكل' | 'قول' | 'تغريدة'>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = useMemo(() => filter === 'الكل' ? items : items.filter(item => item.content_type === filter), [filter, items]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 9));
  const paginated = filtered.slice((currentPage - 1) * 9, currentPage * 9);
  const chooseFilter = (value: typeof filter) => { setFilter(value); setCurrentPage(1); };

  return (
    <>
      <div className="mb-12 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm md:rounded-full">
        {(['الكل', 'قول', 'تغريدة'] as const).map(value => <button key={value} onClick={() => chooseFilter(value)} className={`rounded-full px-7 py-3 text-sm font-black transition-all ${filter === value ? 'bg-[#b18c39] text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{value}</button>)}
      </div>

      {paginated.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 py-24 text-center font-bold text-slate-500">لا توجد أقوال أو تغريدات حاليًا.</div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2">
          {paginated.map((item, index) => (
            <div key={`${filter}-${currentPage}-${item.id}`} className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
              <MessageSquareQuote className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-slate-50 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110" />
              <div className="relative z-10 flex flex-1 flex-col">
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100"><UserRound className="h-5 w-5 text-slate-500" /></div><div><div className="font-black text-slate-800">{item.author}</div><div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500"><Calendar className="h-3.5 w-3.5" />{item.published_date}</div></div></div>
                  <span className="rounded-full border border-[#b18c39]/20 bg-[#b18c39]/5 px-4 py-1.5 text-xs font-black text-[#9a7930]">{item.content_type}</span>
                </div>
                <h2 className="mb-4 text-2xl font-black leading-snug text-slate-900 transition-colors group-hover:text-[#b18c39] md:text-3xl">{item.title}</h2>
                <p className="mb-8 line-clamp-3 flex-1 text-justify text-lg font-medium leading-relaxed text-slate-600">{item.excerpt || item.content}</p>
                <Link href={`/quotes/${item.id}`} prefetch={false} className="mt-auto flex self-end items-center gap-2 rounded-full bg-[#b18c39]/5 px-5 py-2.5 text-sm font-black text-[#b18c39] transition-colors hover:bg-[#b18c39]/10 hover:text-slate-900">عرض المحتوى <ChevronLeft className="h-4 w-4" /></Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && <div className="mt-16 flex items-center justify-center gap-4"><button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))} disabled={currentPage === 1} className="flex h-12 w-12 items-center justify-center rounded-full border bg-white disabled:opacity-50"><ChevronLeft className="h-5 w-5 rotate-180" /></button><span className="text-lg font-bold text-slate-500">صفحة {currentPage} من {totalPages}</span><button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} className="flex h-12 w-12 items-center justify-center rounded-full border bg-white disabled:opacity-50"><ChevronLeft className="h-5 w-5" /></button></div>}
    </>
  );
}
