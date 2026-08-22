import { getCachedVision } from '@/lib/lists-cache';
import VisionListClient from './VisionListClient';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata(
  'دراسات وأبحاث',
  'دراسات وأبحاث في الفكر السياسي والشأن اليمني لعبدالملك المخلافي.',
  '/vision',
);

export const revalidate = 300;

async function getStudies() {
  return getCachedVision();
}

export default async function VisionPage() {
  const studiesList = await getStudies();

  return (
    <div className="min-h-screen bg-slate-50/30 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-12 shadow-2xl">
         <div className="absolute inset-0 bg-pattern opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/logo-last.png" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4">
               الفكر والرؤية
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               دراسات وأبحاث
            </h1>

         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <VisionListClient studiesList={studiesList} />
      </div>
    </div>
  );
}
