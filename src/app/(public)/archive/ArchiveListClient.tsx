"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { Image as ImageIcon, FileText, Video, Calendar, ArrowUpRight, Search, ChevronLeft } from 'lucide-react';

interface ArchiveListClientProps {
  archiveList: any[];
}

export default function ArchiveListClient({ archiveList }: ArchiveListClientProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'document' | 'letter' | 'video'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const filteredItems = activeFilter === 'all' 
    ? archiveList 
    : archiveList.filter(item => item.type === activeFilter);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getIcon = (type: string) => {
    switch(type) {
      case 'photo': return <ImageIcon className="w-8 h-8 text-[#b18c39]" />;
      case 'document': return <FileText className="w-8 h-8 text-[#b18c39]" />;
      case 'video': return <Video className="w-8 h-8 text-[#b18c39]" />;
      default: return <FileText className="w-8 h-8 text-[#b18c39]" />;
    }
  };

  const getBadgeTxt = (type: string) => {
    switch(type) {
      case 'photo': return "صورة تاريخية";
      case 'document': return "وثيقة رسمية";
      case 'video': return "تسجيل مرئي";
      default: return "";
    }
  };

  return (
    <>
       {/* Filter Navigation */}
       <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-16">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'photo', label: 'صور تاريخية' },
            { id: 'document', label: 'وثائق' },
            { id: 'letter', label: 'رسائل' },
            { id: 'video', label: 'مرئيات ومقابلات' },
          ].map(filter => (
             <button
               key={filter.id}
               onClick={() => { setActiveFilter(filter.id as any); setCurrentPage(1); }}
               className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-black transition-all duration-300 border shadow-sm ${
                 activeFilter === filter.id 
                 ? 'bg-[#b18c39] text-white border-[#b18c39] shadow-lg shadow-[#b18c39]/30 scale-105' 
                 : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
               }`}
             >
               {filter.label}
             </button>
          ))}
       </div>

       {/* Archive Grid */}
       <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {paginatedItems.map((item, index) => (
            <Link 
              href={`/archive/${item.id}`}
              prefetch={false}
              key={`${activeFilter}-${item.id}`} 
              className="bg-white rounded-3xl border border-slate-200 p-8 relative overflow-hidden group hover:shadow-2xl hover:border-[#b18c39]/40 transition-all duration-500 break-inside-avoid animate-in fade-in slide-in-from-bottom-8 cursor-pointer block"
              style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
            >
                {/* Image Thumbnail */}
                {item.file_url && item.type === 'photo' && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-slate-100 bg-slate-50">
                    <SafeImage src={item.file_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                {item.cover_url && item.type === 'video' && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-slate-100 bg-slate-50 relative">
                    <SafeImage src={item.cover_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Video className="w-6 h-6 text-[#b18c39] ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Icon only if no image */}
                {!item.file_url && !item.cover_url && (
                  <div className="mb-8 w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#b18c39]/5 transition-transform duration-500">
                    {getIcon(item.type)}
                  </div>
                )}
               
               <span className="text-xs font-black text-[#b18c39] px-3 py-1.5 bg-[#b18c39]/10 rounded-full mb-4 inline-block tracking-wide">
                  {getBadgeTxt(item.type)}
               </span>
               
               <h3 className="text-2xl font-black text-slate-900 leading-snug mb-4 pr-3 border-r-4 border-transparent group-hover:border-[#b18c39] transition-all">
                  {item.title}
               </h3>
               
               <p className="text-slate-500 font-medium leading-relaxed text-base mb-8 text-justify">
                  {item.description}
               </p>
               
               <div className="flex justify-between items-center pt-5 border-t border-slate-100 text-sm font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-slate-300" />
                     {item.published_date}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#b18c39] transition-colors">
                     <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
               </div>
            </Link>
          ))}
       </div>
       
       {/* Pagination UI */}
       {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
             <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm text-center">
               <ChevronLeft className="w-5 h-5 rotate-180 inline" />
             </button>
             <span className="text-slate-500 font-bold text-lg">صفحة {currentPage} من {totalPages}</span>
             <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm text-center">
               <ChevronLeft className="w-5 h-5 inline" />
             </button>
          </div>
       )}
       
       {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
             <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-700 mb-2">لا توجد مواد تطابق تصنيفك حالياً.</h3>
             <p className="text-lg text-slate-500">القسم قيد التحديث المستمر لإضافة كافة المواد الأرشيفية.</p>
          </div>
       )}
    </>
  );
}
