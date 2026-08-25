"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, ChevronLeft } from 'lucide-react';

interface NewsListClientProps {
  newsList: any[];
}

export default function NewsListClient({ newsList }: NewsListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const totalPages = Math.max(1, Math.ceil(newsList.length / ITEMS_PER_PAGE));
  const paginatedNews = newsList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
       <div className="grid md:grid-cols-2 gap-10">
          {paginatedNews.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500 font-bold border-2 border-dashed border-slate-200 rounded-3xl">لا توجد أخبار حالياً</div>
          ) : paginatedNews.map((news, index) => (
            <div 
              key={`${currentPage}-${news.id}`} 
              className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col gap-6 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 overflow-hidden relative"
              style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
            >
               <Newspaper className="absolute -left-10 -top-10 w-48 h-48 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
               
               <div className="relative z-10 flex flex-col h-full">
                  {news.image_url && (
                      <div className="w-full relative h-48 sm:h-56 mb-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                         <Image 
                           src={news.image_url} 
                           alt={news.title} 
                           fill
                           sizes="(max-width: 768px) 100vw, 50vw"
                           priority={index < 2}
                           className="object-cover group-hover:scale-105 transition-transform duration-700" 
                         />
                      </div>
                  )}
                  <span className="self-start text-[10px] md:text-xs font-black text-[#b18c39] px-4 py-1.5 bg-[#b18c39]/5 rounded-full uppercase tracking-widest border border-[#b18c39]/10 mb-6">
                     {news.date || news.published_date}
                  </span>
                  <h4 className="font-black text-2xl md:text-3xl mb-4 leading-snug group-hover:text-[#b18c39] transition-colors">
                     {news.title}
                  </h4>
                  <p className="text-base md:text-lg text-slate-600 line-clamp-3 font-medium leading-relaxed flex-1 text-justify mb-8">
                     {news.excerpt}
                  </p>
                  
                  <Link href={`/news/${news.id}`} prefetch={false} className="flex items-center gap-2 text-[#b18c39] font-black text-sm group/btn hover:text-slate-900 transition-colors bg-[#b18c39]/5 hover:bg-[#b18c39]/10 px-5 py-2.5 rounded-full self-start">
                      التفاصيل
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                  </Link>
               </div>
            </div>
          ))}
       </div>

       {/* Pagination UI */}
       {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
             <button 
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
               disabled={currentPage === 1}
               className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
             >
               <ChevronLeft className="w-5 h-5 rotate-180" />
             </button>
             
             <span className="text-slate-500 font-bold text-lg">
                صفحة {currentPage} من {totalPages}
             </span>

             <button 
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
               disabled={currentPage === totalPages}
               className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
          </div>
       )}
    </>
  );
}
