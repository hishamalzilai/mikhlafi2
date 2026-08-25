"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ChevronLeft } from 'lucide-react';

interface VisionListClientProps {
  studiesList: any[];
}

export default function VisionListClient({ studiesList }: VisionListClientProps) {
  const [searchYear, setSearchYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const handleSearchChange = (val: string) => { setSearchYear(val); setCurrentPage(1); };

  const sortedStudies = [...studiesList].sort((a, b) => {
    const aYear = a.year || (a.published_date ? new Date(a.published_date).getFullYear().toString() : '0');
    const bYear = b.year || (b.published_date ? new Date(b.published_date).getFullYear().toString() : '0');
    return Number(bYear) - Number(aYear);
  });

  const filteredStudies = searchYear.trim() === '' 
    ? sortedStudies 
    : sortedStudies.filter(s => {
        const y = s.year || (s.published_date ? new Date(s.published_date).getFullYear().toString() : '');
        return y.includes(searchYear.trim());
    });

  const totalPages = Math.ceil(filteredStudies.length / ITEMS_PER_PAGE);
  const paginatedStudies = filteredStudies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
       {/* Date Filter */}
       <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 md:p-4 md:px-8 rounded-2xl md:rounded-full shadow-sm border border-slate-200/60 sticky top-28 z-20">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
               <Calendar className="w-5 h-5 text-slate-700" />
             </div>
             <h3 className="text-lg font-black text-slate-900">البحث برقم السنة:</h3>
          </div>
          
          <div className="flex-1 w-full md:w-auto md:max-w-md relative">
             <input 
               type="text" 
               placeholder="أدخل السنة (مثال: 2024)" 
               value={searchYear}
               onChange={(e) => handleSearchChange(e.target.value)}
               className="w-full px-6 py-3 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#b18c39] focus:ring-2 focus:ring-[#b18c39]/20 transition-all text-slate-700 font-bold"
             />
             {searchYear && (
               <button 
                 onClick={() => handleSearchChange('')}
                 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 font-bold text-sm"
               >
                 مسح
               </button>
             )}
          </div>
       </div>

       {/* Studies Grid */}
       <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
          {paginatedStudies.length === 0 && searchYear.trim() === '' ? (
            <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500 font-bold border-2 border-dashed border-slate-200 rounded-3xl">لا توجد دراسات حالياً</div>
          ) : paginatedStudies.map((study, index) => (
            <div 
              key={`${searchYear}-${currentPage}-${study.id}`} 
              className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 flex flex-col h-full"
              style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
            >
               <BookOpen className="absolute -left-8 -top-8 w-40 h-40 text-slate-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
               
               <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <span className="text-xs font-black text-[#b18c39] px-4 py-1.5 bg-[#b18c39]/5 border border-[#b18c39]/20 rounded-full">
                       {study.category}
                     </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-4 group-hover:text-[#b18c39] transition-colors line-clamp-2">
                     {study.title}
                  </h3>
                  
                  <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8 line-clamp-3 text-justify flex-1">
                     {study.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <Calendar className="w-4 h-4" />
                        {study.date}
                     </div>
                     
                     <Link href={`/vision/${study.id}`} prefetch={false} className="flex items-center gap-2 text-[#b18c39] font-black text-sm group/btn hover:text-slate-900 transition-colors">
                        اقرأ الدراسة
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                     </Link>
                  </div>
               </div>
            </div>
          ))}
       </div>

       {/* Pagination UI */}
       {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
             <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all">
               <ChevronLeft className="w-5 h-5 rotate-180" />
             </button>
             <span className="text-slate-500 font-bold text-lg">صفحة {currentPage} من {totalPages}</span>
             <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all">
               <ChevronLeft className="w-5 h-5" />
             </button>
          </div>
       )}

       {filteredStudies.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
             <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-700 mb-2">لا توجد دراسات</h3>
             <p className="text-lg text-slate-500">جاري إضافة المزيد من الدراسات والأبحاث لهذه السنة.</p>
          </div>
       )}
    </>
  );
}
