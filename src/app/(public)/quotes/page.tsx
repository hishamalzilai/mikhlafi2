import { getCachedQuotes } from '@/lib/lists-cache';
import { createPageMetadata } from '@/lib/seo';
import Image from 'next/image';
import QuotesListClient from './QuotesListClient';

export const metadata = createPageMetadata(
  'أقوال وتغريدات',
  'مختارات موثقة من أقوال وتغريدات عبدالملك المخلافي في الشأن الوطني والسياسي.',
  '/quotes',
);

export const revalidate = 300;

export default async function QuotesPage() {
  const items = await getCachedQuotes();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="relative mb-12 overflow-hidden border-t-[6px] border-[#b18c39] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl md:p-20">
        <div className="bg-pattern pointer-events-none absolute inset-0 opacity-5 mix-blend-overlay" />
        <Image src="/logo-last.png" alt="" width={721} height={301} className="pointer-events-none absolute -bottom-32 -left-20 h-auto w-[50rem] object-contain opacity-10 grayscale invert mix-blend-screen" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-4">
          <span className="mt-4 border border-[#b18c39]/20 bg-[#b18c39]/10 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#b18c39] shadow-inner backdrop-blur-sm md:text-sm">من الذاكرة والمواقف</span>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-white drop-shadow-xl md:text-6xl">أقوال وتغريدات</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <QuotesListClient items={items} />
      </div>
    </div>
  );
}
