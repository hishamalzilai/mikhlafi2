"use client";

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { FileText, Image as ImageIcon, Video, Calendar, ArrowRight, Download, Eye } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';

interface ArchiveDetailClientProps {
  item: any;
  initialViews: number;
}

export default function ArchiveDetailClient({ item, initialViews }: ArchiveDetailClientProps) {
  return (
    <div className="min-h-screen bg-slate-900 font-sans animate-in fade-in duration-1000">
       
       <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-[#b18c39]/30 to-transparent blur-3xl"></div>
       </div>

       {/* Top Navigation */}
       <div className="relative z-20 w-full px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link 
             href="/archive" 
             className="flex items-center gap-2 text-slate-300 hover:text-white font-bold transition-colors bg-slate-800/50 px-5 py-2.5 rounded-full backdrop-blur-md border border-slate-700/50"
          >
             <ArrowRight className="w-5 h-5" />
             العودة للأرشيف
          </Link>
          
          <div className="flex gap-2">
             <span className="bg-[#b18c39] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                {item.type === 'photo' && <ImageIcon className="w-4 h-4" />}
                {item.type === 'video' && <Video className="w-4 h-4" />}
                {item.type === 'document' && <FileText className="w-4 h-4" />}
                {item.type === 'photo' ? 'صورة تاريخية' : item.type === 'video' ? 'تسجيل مرئي' : 'وثيقة رسمية'}
             </span>
          </div>
       </div>

       {/* Photo Type */}
       {item.type === 'photo' && (
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center min-h-[80vh]">
             <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8 pb-10">
                 <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800 p-2">
                    <SafeImage src={item.file_url || item.cover_url} alt={item.title} className="w-full h-auto max-h-[70vh] object-contain rounded-xl" />
                 </div>
                 <div className="max-w-3xl text-center">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-md leading-tight">{item.title}</h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-serif text-justify md:text-center px-4">{item.description}</p>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-slate-400 font-bold border-t border-slate-800 pt-6">
                       <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#b18c39]" />{item.published_date}</div>
                       <ViewCounter views={initialViews} className="text-slate-400" />
                    </div>
                 </div>
             </div>
          </div>
       )}

       {/* Video Type */}
       {item.type === 'video' && (
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-start pt-10 min-h-[80vh] pb-10">
             <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
                 <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 relative bg-black flex items-center justify-center">
                    <video controls src={item.file_url} className="w-full h-full object-cover" poster={item.cover_url || "/pattern.png"}></video>
                 </div>
                 <div className="flex flex-col md:flex-row gap-8 justify-between items-start bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-normal">{item.title}</h1>
                        <p className="text-lg text-slate-300 leading-relaxed font-serif">{item.description}</p>
                    </div>
                    <div className="flex-shrink-0 bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-700 w-full md:w-auto">
                       <div className="text-sm text-slate-500 mb-1">تاريخ النشر</div>
                       <div className="flex flex-wrap items-center gap-5 text-white font-bold text-lg">
                          <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#b18c39]" />{item.published_date}</div>
                          <ViewCounter views={initialViews} className="text-base text-slate-300" />
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       )}

       {/* Document Type */}
       {item.type === 'document' && (
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center min-h-[80vh] pt-12 pb-24">
             <div className="w-full max-w-4xl mx-auto">
                 <div className="bg-white rounded-t-xl rounded-b-sm shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden relative">
                    <div className="h-4 w-full bg-[#b18c39]"></div>
                    <div className="p-10 md:p-16 lg:p-24 flex flex-col min-h-[600px]">
                       <div className="text-center mb-16">
                          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 outline outline-4 outline-slate-50">
                             <FileText className="w-10 h-10 text-slate-500" />
                          </div>
                          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-snug">{item.title}</h1>
                          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 font-bold text-lg">
                             <div className="flex items-center gap-2"><Calendar className="w-5 h-5" />{item.published_date}</div>
                             <ViewCounter views={initialViews} className="text-slate-500" />
                          </div>
                       </div>
                       <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl font-serif text-xl border-dashed leading-relaxed text-slate-800">{item.description}</div>
                       <div className="mt-auto pt-16 flex flex-col sm:flex-row justify-center gap-4">
                          {item.file_url && (
                            <a href={`/api/archive/${item.id}/download?action=view`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-black transition-colors text-lg shadow-lg w-full sm:w-auto">
                               <Eye className="w-5 h-5" /> تصفح الوثيقة الكاملة
                            </a>
                          )}
                          {item.file_url && (
                            <a href={`/api/archive/${item.id}/download?action=download`} download className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-full font-black transition-colors text-lg shadow-sm w-full sm:w-auto">
                               <Download className="w-5 h-5" /> تحميل الأصل (PDF)
                            </a>
                          )}
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       )}

    </div>
  );
}
