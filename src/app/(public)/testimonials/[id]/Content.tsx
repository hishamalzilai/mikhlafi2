"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { Calendar, UserRound, ArrowRight, Printer, Download, ChevronRight, ChevronLeft, MessageCircle, Send, Link2, Check, Share2, Quote } from 'lucide-react';
import ViewCounter from '@/components/ViewCounter';

// Smart text splitting for pagination (matching ArticleContent)
const splitIntoPages = (textString: string) => {
  const paragraphs = textString.split(/\n+/).map(s => s.trim()).filter(Boolean);
  const CHARS_PER_PAGE = 3000; // Adjusted for better reading on paper
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentLength = 0;

  for (const p of paragraphs) {
    if (p.length > CHARS_PER_PAGE) {
      const words = p.split(/\s+/);
      let chunk = '';
      for (const w of words) {
        if (chunk.length + w.length > CHARS_PER_PAGE) {
          if (currentPage.length > 0) {
            pages.push([...currentPage]);
            currentPage = [];
            currentLength = 0;
          }
          pages.push([chunk.trim()]);
          chunk = w + ' ';
        } else {
          chunk += w + ' ';
        }
      }
      if (chunk.trim()) {
        currentPage.push(chunk.trim());
        currentLength += chunk.length;
      }
    } else {
      if (currentLength + p.length > CHARS_PER_PAGE && currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [p];
        currentLength = p.length;
      } else {
        currentPage.push(p);
        currentLength += p.length;
      }
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  return pages;
};

interface TestimonialContentProps {
  data: {
    id: string;
    author_name: string;
    author_title?: string;
    content: string;
    author_image?: string;
    created_at: string;
    title?: string;
    published_date?: string;
  };
  initialViews: number;
}

export default function Content({ data, initialViews }: TestimonialContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const paperRef = useRef<HTMLDivElement>(null);

  // Fix hydration mismatch by setting share URL on client
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const pages = splitIntoPages(data.content || "");
  const totalPages = Math.max(1, pages.length);
  const paginatedContent = pages[currentPage - 1] || [];

  const scrollToTop = () => {
    if (paperRef.current) {
        paperRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
      if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
          scrollToTop();
      }
  };

  const handlePrev = () => {
      if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
          scrollToTop();
      }
  };

  const handleCopyLink = () => {
     navigator.clipboard.writeText(shareUrl);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-serif print:bg-white print:py-0 print:px-0" dir="rtl">
       
       {/* Actions Bar */}
       <div className="w-full max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <Link 
             href="/testimonials" 
             className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-sans font-bold transition-colors"
          >
             <ArrowRight className="w-5 h-5" />
             العودة للسجل
          </Link>

          <div className="flex gap-3 font-sans">
             <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors font-bold text-sm md:text-base"
             >
                <Printer className="w-4 h-4 md:w-5 md:h-5" />
                طباعة
             </button>
             <button 
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-slate-800 transition-colors font-bold text-sm md:text-base"
             >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                تحميل PDF
             </button>
          </div>
       </div>

       {/* Paper Container */}
       <div 
          ref={paperRef}
          className="w-full max-w-7xl min-h-[297mm] mx-auto bg-white shadow-xl shadow-slate-300 border border-slate-200 print:shadow-none print:border-none print:max-w-full flex flex-col"
       >
          
          <div className="p-8 md:p-16 lg:p-24 flex-1 flex flex-col relative overflow-hidden">
              
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-8 mb-12 relative flex justify-between items-end z-10">
                 <div>
                    <span className="text-[#b18c39] font-black uppercase tracking-[0.3em] text-sm mb-4 block font-sans">{data.title || 'شهادة في الموقف والمسيرة الوطنية'}</span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-tight max-w-4xl font-sans mb-8">
                       {data.author_name} يكتب عن القامة الوطنية
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-8 font-sans text-slate-600 mb-10">
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#b18c39]/20 shadow-lg">
                             {data.author_image ? (
                               <SafeImage src={data.author_image} alt={data.author_name} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                  <UserRound size={32} />
                               </div>
                             )}
                          </div>
                          <div>
                             <div className="text-xl font-black text-slate-900 leading-none">{data.author_name}</div>
                             <div className="text-sm font-bold text-[#b18c39] mt-1">{data.author_title || 'شهادة موثقة'}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-lg font-bold border-r pr-8 border-slate-200">
                          <Calendar className="w-5 h-5 text-[#b18c39]" />
                          {formatDate(data.published_date || data.created_at)}
                       </div>
                       <ViewCounter views={initialViews} className="text-lg text-slate-600" />
                    </div>

                    {/* Share Buttons */}
                    <div className="flex flex-wrap items-center gap-3 font-sans print:hidden translate-y-4">
                        <span className="text-slate-500 font-bold ml-2 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-[#b18c39]" />
                            مشاركة:
                        </span>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(data.author_name)}&via=almekhlafi59`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 hover:bg-[#000000] hover:text-white hover:border-[#000000] flex items-center justify-center text-slate-500 transition-all shadow-sm" title="مشاركة عبر تويتر (X)">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 hover:bg-[#4267B2] hover:text-white hover:border-[#4267B2] flex items-center justify-center text-slate-500 transition-all shadow-sm" title="مشاركة عبر فيسبوك">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        </a>
                        <button onClick={handleCopyLink} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-800 hover:text-white hover:border-slate-800 flex items-center justify-center text-slate-600 transition-all shadow-sm relative group" title="نسخ الرابط">
                           {copied ? <Check className="w-4 h-4 text-emerald-500 group-hover:text-white" /> : <Link2 className="w-4 h-4" />}
                        </button>
                        {copied && <span className="text-xs font-bold text-emerald-600 animate-in fade-in duration-300">تم النسخ!</span>}
                    </div>
                 </div>
                 
              </div>

              {/* Main Text Content */}
              <article className="relative z-10 prose prose-lg md:prose-xl lg:prose-2xl max-w-none text-slate-800 prose-headings:font-black prose-p:text-justify prose-p:leading-[2.4] flex-1 whitespace-pre-wrap prose-p:text-[18px] prose-p:font-bold">
                 {paginatedContent.map((paragraph, index) => (
                    <p key={index} className="mb-8 font-medium">{paragraph}</p>
                 ))}
                 {currentPage === totalPages && (
                    <div className="text-center font-black mt-20 text-slate-500 font-sans tracking-[0.5em] border-y py-8 border-slate-100">
                        *** تمت القراءة ***
                    </div>
                 )}
              </article>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 bg-slate-50 p-6 md:p-10 font-sans flex items-center justify-between print:hidden mt-auto">
               <button 
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
               >
                  <ChevronRight className="w-5 h-5" />
                  السابق
               </button>
               
               <span className="text-slate-500 font-bold text-lg">
                   صفحة {currentPage} من {totalPages}
               </span>

               <button 
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
               >
                  التالي
                  <ChevronLeft className="w-5 h-5" />
               </button>
            </div>
          )}


       </div>
    </div>
  );
}
