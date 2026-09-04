"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Check, ExternalLink, Link2, MessageCircle, MessageSquareQuote, Printer, Send, Share2, UserRound } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';

type QuoteItem = {
  id: number;
  title: string;
  content: string;
  author: string;
  content_type: 'قول' | 'تغريدة';
  published_date?: string | null;
  source_url?: string | null;
};

export default function QuoteContent({ item, initialViews, shareUrl }: { item: QuoteItem; initialViews: number; shareUrl: string }) {
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 font-serif sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-center justify-between gap-4 print:hidden">
        <Link href="/quotes" className="flex items-center gap-2 font-sans font-bold text-slate-500 transition-colors hover:text-slate-900"><ArrowRight className="h-5 w-5" /> العودة للأقوال والتغريدات</Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-sans font-bold text-slate-600 shadow-sm hover:bg-slate-50"><Printer className="h-5 w-5" /> طباعة</button>
      </div>

      <div className="mx-auto flex min-h-[297mm] w-full max-w-7xl flex-col border border-slate-200 bg-white shadow-xl shadow-slate-300 print:max-w-full print:border-none print:shadow-none">
        <div className="flex flex-1 flex-col p-8 md:p-16 lg:p-24">
          <header className="relative mb-12 border-b-2 border-slate-900 pb-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b18c39]/30 bg-[#b18c39]/5 px-5 py-2 font-sans text-lg font-black text-[#9a7930]"><MessageSquareQuote className="h-5 w-5" />{item.content_type}</span>
            <h1 className="mb-6 max-w-4xl font-sans text-4xl font-black leading-snug text-slate-900 md:text-5xl lg:text-6xl">{item.title}</h1>
            <div className="mb-8 flex flex-wrap items-center gap-6 font-sans text-lg font-bold text-slate-600">
              <span className="flex items-center gap-2"><UserRound className="h-5 w-5" />{item.author}</span>
              {item.published_date && <span className="flex items-center gap-2"><Calendar className="h-5 w-5" />{item.published_date}</span>}
              <ViewCounter views={initialViews} className="text-lg text-slate-600" />
            </div>
            <div className="flex flex-wrap items-center gap-3 font-sans print:hidden">
              <span className="ml-2 flex items-center gap-2 font-bold text-slate-500"><Share2 className="h-5 w-5 text-[#b18c39]" />مشاركة:</span>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-sm font-black text-slate-500 hover:bg-black hover:text-white">X</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`${item.title}\n${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#25D366] hover:text-white"><MessageCircle className="h-4 w-4" /></a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#0088cc] hover:text-white"><Send className="h-4 w-4" /></a>
              <button onClick={copyLink} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-white">{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />}</button>
              {copied && <span className="text-xs font-bold text-emerald-600">تم النسخ!</span>}
            </div>
          </header>

          <article className="prose prose-lg max-w-none flex-1 whitespace-pre-wrap text-slate-800 md:prose-xl lg:prose-xl prose-p:text-justify prose-p:text-[20px] prose-p:font-bold prose-p:leading-[2.2]">
            {item.content.split(/\n+/).map((paragraph, index) => <p key={index} className="mb-8">{paragraph}</p>)}
          </article>

          {item.source_url && <div className="mt-16 border-t border-slate-100 pt-8 font-sans print:hidden"><a href={item.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-black text-white hover:bg-[#b18c39]"><ExternalLink className="h-5 w-5" />عرض المصدر الأصلي</a></div>}
          <div className="mt-16 text-center font-sans font-black tracking-widest text-slate-500">*** انتهى المحتوى ***</div>
        </div>
      </div>
    </div>
  );
}
