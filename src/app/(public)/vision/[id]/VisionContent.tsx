"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Printer, Download, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';

const splitIntoPages = (textString: string) => {
  const paragraphs = textString.split(/\n+/).map(s => s.trim()).filter(Boolean);
  const CHARS_PER_PAGE = 5000;
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentLength = 0;
  for (const p of paragraphs) {
    if (p.length > CHARS_PER_PAGE) {
      if (!/\s/.test(p)) {
        if (currentPage.length > 0) {
          pages.push([...currentPage]);
          currentPage = [];
          currentLength = 0;
        }
        for (let i = 0; i < p.length; i += CHARS_PER_PAGE) {
          pages.push([p.slice(i, i + CHARS_PER_PAGE)]);
        }
        continue;
      }
      const words = p.split(/\s+/);
      let chunk = '';
      for (const w of words) {
        if (chunk.length + w.length > CHARS_PER_PAGE) {
          if (currentPage.length > 0) { pages.push([...currentPage]); currentPage = []; currentLength = 0; }
          pages.push([chunk.trim()]);
          chunk = w + ' ';
        } else { chunk += w + ' '; }
      }
      if (chunk.trim()) { currentPage.push(chunk.trim()); currentLength += chunk.length; }
    } else {
      if (currentLength + p.length > CHARS_PER_PAGE && currentPage.length > 0) {
        pages.push([...currentPage]); currentPage = [p]; currentLength = p.length;
      } else { currentPage.push(p); currentLength += p.length; }
    }
  }
  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
};

interface VisionContentProps {
  studyData: any;
  initialViews: number;
}

export default function VisionContent({ studyData, initialViews }: VisionContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const paperRef = useRef<HTMLDivElement>(null);

  const pages = splitIntoPages(studyData.content || "");
  const totalPages = Math.max(1, pages.length);
  const paginatedContent = pages[currentPage - 1] || [];

  const scrollToTop = () => {
    if (paperRef.current) paperRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleNext = () => { if (currentPage < totalPages) { setCurrentPage(p => p + 1); scrollToTop(); } };
  const handlePrev = () => { if (currentPage > 1) { setCurrentPage(p => p - 1); scrollToTop(); } };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-serif print:bg-white print:py-0 print:px-0">
       <div className="w-full max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <Link href="/vision" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-sans font-bold transition-colors">
             <ArrowRight className="w-5 h-5" /> العودة للدراسات والأبحاث
          </Link>
          <div className="flex gap-3 font-sans">
             <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors font-bold text-sm md:text-base">
                <Printer className="w-4 h-4 md:w-5 md:h-5" /> طباعة
             </button>
             <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-slate-800 transition-colors font-bold text-sm md:text-base">
                <Download className="w-4 h-4 md:w-5 md:h-5" /> تحميل PDF
             </button>
          </div>
       </div>

       <div ref={paperRef} className="w-full max-w-7xl min-h-[297mm] mx-auto bg-white shadow-xl shadow-slate-300 border border-slate-200 print:shadow-none print:border-none print:max-w-full flex flex-col relative">
          <div className="absolute top-0 right-0 w-2 h-full bg-slate-900 print:hidden hidden lg:block"></div>
          <div className="p-8 md:p-16 lg:p-24 flex-1 flex flex-col lg:mr-4">
              <div className="border-b-2 border-slate-200 pb-8 mb-12 relative flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center gap-2 text-[#b18c39] font-sans font-bold text-lg md:text-xl mb-4 border border-[#b18c39]/30 bg-[#b18c39]/5 px-5 py-2 rounded-full">
                       <BookOpen className="w-6 h-6" />
                       {studyData.category || "دراسة متخصصة"}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-snug max-w-4xl font-sans mb-6">{studyData.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 font-sans font-bold text-slate-500 text-lg">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {studyData.published_date || studyData.date}
                       </div>
                       <ViewCounter views={initialViews} className="text-lg text-slate-500" />
                    </div>
                 </div>
                 <div className="text-slate-500 font-sans text-lg md:text-xl font-bold absolute top-0 left-0">صفحة {currentPage} من {totalPages}</div>
              </div>

              {currentPage === 1 && studyData.excerpt && (
                  <div className="bg-slate-50 border border-slate-200 p-8 md:p-12 rounded-xl mb-12 relative">
                     <div className="absolute top-0 right-0 w-2 h-full bg-slate-400 rounded-r-xl"></div>
                     <p className="text-3xl md:text-4xl text-slate-700 font-bold leading-relaxed text-center">{studyData.excerpt}</p>
                  </div>
              )}

              <article className="prose prose-lg md:prose-xl lg:prose-xl max-w-none text-slate-800 prose-headings:font-black prose-p:text-justify prose-p:leading-[2.2] flex-1 whitespace-pre-wrap prose-p:text-[18px] prose-p:font-bold">
                 {paginatedContent.map((paragraph: string, index: number) => (
                    <p key={index} className="mb-8">{paragraph}</p>
                 ))}
                 {currentPage === totalPages && (
                     <div className="text-center font-black mt-24 text-slate-500 font-sans tracking-widest border-t-2 border-dashed border-slate-200 pt-8">
                         *** انتهت ال{studyData.category || 'دراسة'} ***
                     </div>
                 )}
              </article>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-6 md:p-10 font-sans flex items-center justify-between print:hidden mt-auto">
             <button onClick={handlePrev} disabled={currentPage === 1} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" /> الصفحة السابقة
             </button>
             <span className="text-slate-500 font-bold text-lg">صفحة {currentPage} من {totalPages}</span>
             <button onClick={handleNext} disabled={currentPage >= totalPages} className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm">
                الصفحة التالية <ChevronLeft className="w-5 h-5" />
             </button>
          </div>
       </div>
    </div>
  );
}
