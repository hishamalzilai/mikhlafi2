import React from 'react';
import { FileText, ChevronLeft, Quote, UserRound } from 'lucide-react';
import cvData from '@/data/cv.json';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata(
  'السيرة الذاتية',
  'السيرة الذاتية والمسيرة السياسية والدبلوماسية لعبدالملك المخلافي.',
  '/bio',
);

export const dynamic = 'force-static';

export default function BioPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-[60vh] pb-24 bg-slate-50/30">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-16 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-pattern opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/logo-last.png" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-5 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner">
               مسيرة حياة
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight">
               السيرة الذاتية المفصلة
            </h1>

         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16">
            {/* Sidebar Info (Timeline & Portrait) */}
            <div className="lg:col-span-4 relative flex flex-col gap-10">
               {/* Official Portrait Card */}
               <div className="bg-slate-900 border-b-[12px] border-[#b18c39] shadow-2xl overflow-hidden group">
                  <div className="aspect-[4/5] relative">
                     <img 
                        src="/0393d5d1-14d1-49e5-88c5-9353b92dd677.jpeg" 
                        alt="عبد الملك المخلافي" 
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xl sticky top-32 overflow-hidden">
                 {/* Top Decor */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-900 via-[#b18c39] to-slate-900"></div>
                 
                 <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-6 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                     <UserRound className="text-[#b18c39] w-5 h-5" /> 
                   </div>
                   البطاقة التعريفية
                 </h4>
                 
                 <div className="relative pl-2 pr-4">
                    {/* Timeline Line */}
                    <div className="absolute right-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-[#b18c39]/50 via-slate-200 to-transparent"></div>
                    
                    <ul className="space-y-8">
                       {cvData.positions.map((pos, i) => (
                          <li key={i} className="relative group">
                            {/* Timeline Dot */}
                            <div className="absolute -right-[24px] top-1.5 w-3 h-3 rounded-full border-2 border-[#b18c39] bg-white group-hover:bg-[#b18c39] group-hover:scale-125 transition-all duration-300"></div>
                            
                            <div className="flex flex-col gap-1.5 pt-0.5">
                              <span className="text-xs md:text-sm font-black text-[#b18c39] uppercase tracking-wider flex items-center gap-2">
                                <ChevronLeft className="w-3 h-3" />
                                {pos.role}
                              </span>
                              <span className="text-base md:text-lg font-bold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors">
                                {pos.detail}
                              </span>
                            </div>
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>

           {/* Main Content */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              {cvData.biography.map((p, i) => (
                <div 
                  key={i} 
                  className={`relative p-8 md:p-12 bg-white rounded-xl shadow-sm border border-slate-100/60 overflow-hidden group transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                    i === 0 
                    ? 'border-r-4 border-r-[#b18c39] bg-gradient-to-l from-[#b18c39]/5 to-white' 
                    : ''
                  }`}
                  style={{ animationFillMode: 'both', animationDelay: `${i * 150}ms` }}
                >
                   {/* Decorative Icon */}
                   {i === 0 ? (
                     <Quote className="absolute top-6 right-6 w-16 h-16 text-[#b18c39] opacity-10 rotate-180 pointer-events-none" />
                   ) : (
                     <FileText className="absolute -left-6 -top-6 w-32 h-32 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
                   )}
                   
                   <p className={`relative z-10 text-justify ${
                     i === 0 
                     ? 'text-xl md:text-2xl font-black leading-loose text-slate-900' 
                     : 'text-lg md:text-xl font-bold leading-loose text-slate-700'
                   }`}>
                     {p.replace(/\[\d+\]/g, '')}
                   </p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
