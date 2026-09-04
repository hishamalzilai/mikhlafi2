"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Loader2, Newspaper, FileText, BookOpen, Film, FolderArchive, ArrowLeft, Quote } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchAll, SearchResult } from '@/lib/search';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const cacheRef = useRef<Record<string, SearchResult[]>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleCmdK = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
           // We'll hook this globally in Layout instead, but let's prevent default here just in case.
        }
      }
    };
    window.addEventListener('keydown', handleCmdK);
    return () => window.removeEventListener('keydown', handleCmdK);
  }, [isOpen, onClose]);

  // Debounced search effect
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      // Check cache first
      if (cacheRef.current[trimmedQuery]) {
        setResults(cacheRef.current[trimmedQuery]);
        setLoading(false);
        return;
      }

      try {
        const data = await searchAll(trimmedQuery);
        cacheRef.current[trimmedQuery] = data; // Save to cache
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (url: string) => {
    onClose();
    router.push(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'archive': return <FolderArchive className="w-4 h-4" />;
      case 'media': return <Film className="w-4 h-4" />;
      case 'testimonial': return <Quote className="w-4 h-4" />;
      case 'quote': return <Quote className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'news': return 'الأخبار';
      case 'article': return 'مقال';
      case 'study': return 'دراسة';
      case 'archive': return 'أرشيف';
      case 'media': return 'مكتبة مرئية';
      case 'testimonial': return 'شهادة / رأي';
      case 'quote': return 'قول / تغريدة';
      default: return 'وثيقة';
    }
  };

  if (!mounted || !isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] bg-slate-950/80 backdrop-blur-xl flex flex-col items-center pt-24 px-4 sm:px-6 transition-all duration-500 animate-in fade-in" dir="rtl">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-[#b18c39]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      
      {/* Search Input Container */}
      <div className="w-full max-w-4xl relative z-10 animate-in slide-in-from-top-10 duration-700">
         <div className="relative group">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-[#b18c39] opacity-70 group-focus-within:opacity-100 transition-opacity" />
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن المقالات، الأخبار، أو الوثائق..."
              className="w-full bg-slate-900/60 border border-slate-700 focus:border-[#b18c39]/50 focus:ring-4 focus:ring-[#b18c39]/10 rounded-3xl py-6 pr-20 pl-20 text-2xl font-black text-white placeholder-slate-500 outline-none transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md"
            />
            {query.length > 0 && (
              <button 
                onClick={() => setQuery('')}
                className="absolute left-20 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition-colors"
                title="مسح البحث"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors border border-slate-700 shadow-sm flex items-center gap-1"
            >
              <kbd className="font-sans">ESC</kbd> ✕
            </button>
         </div>

         {/* Results Container */}
         <div className="mt-8 relative">
            {loading && (
               <div className="absolute inset-x-0 top-10 flex justify-center animate-in fade-in">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-full px-6 py-3 flex items-center gap-3 backdrop-blur-sm shadow-xl">
                    <Loader2 className="w-5 h-5 text-[#b18c39] animate-spin" />
                    <span className="text-slate-300 font-bold">جاري البحث الشامل في قواعد البيانات...</span>
                  </div>
               </div>
            )}

            {!loading && query.length > 0 && query.trim().length < 3 && (
               <div className="text-center mt-12 text-slate-500 font-bold text-lg animate-in fade-in">
                  أدخل 3 أحرف على الأقل للبدء...
               </div>
            )}

            {!loading && query.trim().length >= 3 && results.length === 0 && (
               <div className="text-center mt-16 animate-in slide-in-from-bottom-4 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl">
                    <Search className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">عفواً، لا توجد نتائج مطابقة</h3>
                  <p className="text-slate-500 font-medium">لم نعثر على ما يطابق &quot;{query}&quot;، جرب كلمات مفتاحية أخرى.</p>
               </div>
            )}

            {!loading && results.length > 0 && (
               <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-4 md:p-6 shadow-2xl max-h-[60vh] overflow-y-auto w-full custom-scrollbar animate-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center justify-between mb-4 px-2">
                     <span className="text-slate-500 font-bold text-sm">تم العثور على {results.length} نتائج</span>
                  </div>
                  
                  <div className="grid gap-3">
                     {results.map((result, idx) => (
                        <button
                           key={`${result.type}-${result.id}-${idx}`}
                           onClick={() => handleResultClick(result.url)}
                           className="text-right w-full flex items-start md:items-center flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-5 rounded-2xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50 transition-all group outline-none focus:bg-slate-800 focus:border-[#b18c39]/50"
                           style={{ animationFillMode: 'both', animationDelay: `${idx * 50}ms` }}
                        >
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                              result.type === 'news' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                              result.type === 'article' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              result.type === 'study' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                              result.type === 'archive' ? 'bg-[#b18c39]/10 text-[#b18c39] border-[#b18c39]/20' :
                              result.type === 'testimonial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              result.type === 'quote' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                           }`}>
                              {getTypeIcon(result.type)}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <span className="text-xs font-black uppercase tracking-wider text-slate-500">{getTypeName(result.type)}</span>
                                 {result.date && (
                                   <>
                                     <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                     <span className="text-xs font-bold text-slate-500">{result.date}</span>
                                   </>
                                 )}
                              </div>
                              <h4 className="text-lg md:text-xl font-black text-white group-hover:text-[#b18c39] transition-colors line-clamp-1 leading-snug">{result.title}</h4>
                              {result.excerpt && (
                                <p className="text-sm font-medium text-slate-500 mt-1.5 line-clamp-1 max-w-2xl">{result.excerpt}</p>
                              )}
                           </div>
                           
                           <div className="hidden md:flex opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-[#b18c39] items-center gap-2 font-black text-sm shrink-0">
                              عرض <ArrowLeft className="w-4 h-4" />
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>,
    document.body
  );
}
