import { getCachedMedia } from '@/lib/lists-cache';
import LibraryListClient from './LibraryListClient';
import { Film } from 'lucide-react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata(
  'المكتبة المرئية',
  'المكتبة المرئية والصوتية لعبدالملك المخلافي.',
  '/library',
);

export const revalidate = 3600;

async function getMedia() {
  return getCachedMedia();
}

export default async function LibraryPage() {
  const mediaList = await getMedia();

  return (
    <div className="min-h-screen bg-slate-900 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-slate-100">
      {/* Ultra Cinematic Header */}
      <div className="bg-slate-950 border-b-[6px] border-[#b18c39] p-10 md:p-24 relative overflow-hidden mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <div className="absolute inset-0 bg-pattern opacity-[0.03] mix-blend-screen pointer-events-none"></div>
         <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#b18c39] rounded-full blur-[150px] opacity-[0.12] mix-blend-screen pointer-events-none"></div>
         <img src="/logo-last.png" alt="" className="absolute -left-20 -bottom-32 w-[60rem] h-auto object-contain grayscale invert mix-blend-screen opacity-[0.05] pointer-events-none drop-shadow-2xl" />
         
         <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-5xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-6 py-2.5 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(177,140,57,0.1)] flex items-center gap-2">
               <Film className="w-4 h-4" />
               استوديوهات العرض الرقمي
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-tight leading-tight">
               المكتبة المرئية
            </h1>

         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <LibraryListClient mediaList={mediaList} />
      </div>
    </div>
  );
}
