"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Quote, User, Calendar, ChevronLeft } from 'lucide-react';

interface TestimonialsListClientProps {
  testimonials: any[];
}

export default function TestimonialsListClient({ testimonials }: TestimonialsListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.max(1, Math.ceil(testimonials.length / ITEMS_PER_PAGE));
  const paginatedItems = testimonials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'تاريخ غير متوفر';
    return new Date(dateStr).toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-10">
        {paginatedItems.map((item, index) => (
          <div 
            key={item.id} 
            className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col animate-in fade-in slide-in-from-bottom-8"
            style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
          >
             <Quote className="absolute -right-8 -top-8 w-48 h-48 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none opacity-50" />
             
             <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                   <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 overflow-hidden shadow-inner group-hover:border-[#b18c39]/30 transition-all">
                       {item.author_image ? (
                         <img src={item.author_image} alt={item.author_name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <User size={28} />
                         </div>
                       )}
                     </div>
                     <div>
                       <div className="text-lg md:text-xl font-black text-slate-900 group-hover:text-[#b18c39] transition-colors">{item.author_name}</div>
                       <div className="flex items-center gap-2 text-xs text-[#b18c39] font-black uppercase tracking-widest mt-1">
                         {item.author_title || 'شهادة موثقة'}
                       </div>
                     </div>
                   </div>
                   <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.published_date || item.created_at)}
                   </div>
                </div>
                
                <div className="space-y-6 flex-1">
                   <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                      {item.title || 'شهادة في الموقف والمسيرة الوطنية'}
                   </h3>
                   
                   <div className="text-slate-600 font-medium leading-[1.8] text-lg text-justify border-r-4 border-slate-100 pr-6">
                      <p className="line-clamp-4 group-hover:text-slate-900 transition-colors">
                        {item.content}
                      </p>
                   </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center">
                   <Link href={`/testimonials/${item.id}`} prefetch={false} className="inline-flex items-center gap-2 text-[#b18c39] font-black text-sm hover:text-slate-900 transition-all group/btn">
                      قراءة المحتوى كاملاً
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                   </Link>
                   <div className="w-8 h-8 rounded-full bg-[#b18c39]/10 flex items-center justify-center text-[#b18c39] group-hover:bg-[#b18c39] group-hover:text-white transition-all">
                      <Quote size={14} />
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-20 flex items-center justify-center gap-4">
           <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-14 h-14 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xl">
             <ChevronLeft className="w-6 h-6 rotate-180" />
           </button>
           <span className="text-slate-500 font-black text-lg bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">صفحة {currentPage} من {totalPages}</span>
           <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-14 h-14 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xl">
             <ChevronLeft className="w-6 h-6" />
           </button>
        </div>
      )}
    </>
  );
}
