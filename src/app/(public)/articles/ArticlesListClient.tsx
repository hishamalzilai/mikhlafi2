"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { PenTool, Calendar, ChevronLeft, UserRound } from 'lucide-react';

interface ArticlesListClientProps {
  articlesList: any[];
}

export default function ArticlesListClient({ articlesList }: ArticlesListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const totalPages = Math.max(1, Math.ceil(articlesList.length / ITEMS_PER_PAGE));
  const paginatedArticles = articlesList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
       <div className="grid md:grid-cols-2 gap-10">
          {paginatedArticles.map((article, index) => (
            <div 
              key={`${currentPage}-${article.id}`} 
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col animate-in fade-in slide-in-from-bottom-8"
              style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
            >
               <PenTool className="absolute -right-8 -bottom-8 w-40 h-40 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none" />
               
               <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                         <UserRound className="w-5 h-5 text-slate-500" />
                       </div>
                       <div>
                         <div className="text-sm md:text-base font-black text-slate-800">{article.author}</div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-1">
                           <Calendar className="w-3.5 h-3.5" />
                           {article.published_date || article.date}
                         </div>
                       </div>
                     </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-4 group-hover:text-[#b18c39] transition-colors">
                     {article.title}
                  </h3>
                  
                  <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8 line-clamp-3 text-justify flex-1">
                     {article.excerpt}
                  </p>
                  
                  <Link href={`/articles/${article.id}`} prefetch={false} className="self-end flex items-center gap-2 text-[#b18c39] font-black text-sm group/btn hover:text-slate-900 transition-colors bg-[#b18c39]/5 hover:bg-[#b18c39]/10 px-5 py-2.5 rounded-full mt-auto">
                      قراءة المقال كاملًا
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                  </Link>
               </div>
            </div>
          ))}
       </div>

       {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
             <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm">
               <ChevronLeft className="w-5 h-5 rotate-180" />
             </button>
             <span className="text-slate-500 font-bold text-lg">صفحة {currentPage} من {totalPages}</span>
             <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm">
               <ChevronLeft className="w-5 h-5" />
             </button>
          </div>
       )}
    </>
  );
}
