"use client";

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getMediaThumbnailUrl } from '@/lib/validate-url';
import { Play, ChevronLeft, ChevronRight, Search, Clock, Film, X, Expand } from 'lucide-react';

type MediaFilter = 'all' | 'video' | 'photo';

type MediaItem = {
  id: number;
  title?: string | null;
  type: 'video' | 'photo' | 'image';
  thumbnail_url?: string | null;
  duration?: string | null;
  description?: string | null;
};

interface LibraryListClientProps { mediaList: MediaItem[]; }

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function MediaCard({ item, index, onSelect }: { item: MediaItem; index: number; onSelect: () => void }) {
  const [imgSrc, setImgSrc] = useState(getMediaThumbnailUrl(item.thumbnail_url || '', item.type, '/default-video-cover.png'));

  const handleImageError = () => {
    if (imgSrc.includes('maxresdefault.jpg')) {
      setImgSrc(imgSrc.replace('maxresdefault.jpg', 'hqdefault.jpg'));
    } else if (imgSrc.includes('hqdefault.jpg')) {
      setImgSrc(imgSrc.replace('hqdefault.jpg', '0.jpg'));
    } else if (item.type === 'video' && imgSrc !== '/default-video-cover.png') {
      setImgSrc('/default-video-cover.png');
    }
  };

  return (
    <div 
      onClick={onSelect}
      className="relative cursor-pointer group break-inside-avoid animate-in fade-in overflow-hidden border border-slate-800 shadow-xl"
      style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
         <Image 
           src={imgSrc || '/icon.png'} 
           alt={item.title || 'مادة مرئية'} 
           fill
           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
           priority={index < 4}
           onError={handleImageError}
           className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
         />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
         <div className="bg-[#b18c39]/90 backdrop-blur-md p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(177,140,57,0.6)] text-white">
            {item.type === 'video' ? <Play className="w-8 h-8 ml-1" /> : <Expand className="w-8 h-8" />}
         </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
         <span className="bg-slate-900/80 backdrop-blur-md text-[#b18c39] border border-[#b18c39]/30 text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full shadow-lg">
           {item.type === 'video' ? 'مقطع مرئي' : 'صورة'}
         </span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 space-y-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8">
         {item.type === 'video' && item.title && (
            <h3 className="text-white font-black text-sm md:text-base line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-snug">
               {item.title}
            </h3>
         )}
         <div className="flex items-center gap-4 text-slate-300 text-xs font-bold">
            {item.type === 'video' && item.duration && (
               <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-[#b18c39]" />
                  {item.duration}
               </span>
            )}
            {item.description && <span className="line-clamp-1 opacity-80">{item.description}</span>}
         </div>
      </div>
    </div>
  );
}

export default function LibraryListClient({ mediaList }: LibraryListClientProps) {
  const [activeFilter, setActiveFilter] = useState<MediaFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, title: string, desc: string} | null>(null);
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPhoto(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredItems = activeFilter === 'all' 
    ? mediaList 
    : mediaList.filter(item => item.type === activeFilter);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (filter: MediaFilter) => { setActiveFilter(filter); setCurrentPage(1); };

  return (
    <>
       {/* Filter Navigation */}
       <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          {([
            { id: 'all', label: 'الجميع' },
            { id: 'photo', label: 'الصور' },
            { id: 'video', label: 'الفيديوهات' },
          ] as const).map(filter => (
             <button
               key={filter.id}
               onClick={() => handleFilterChange(filter.id)}
               className={`px-8 py-3.5 rounded-none text-sm md:text-base font-black transition-all duration-500 border ${
                 activeFilter === filter.id 
                 ? 'bg-[#b18c39] text-white border-[#b18c39] shadow-[0_0_25px_rgba(177,140,57,0.4)] scale-105' 
                 : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
               }`}
             >
               {filter.label}
             </button>
          ))}
       </div>

       {/* Media Grid */}
       <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {paginatedItems.map((item, index) => (
             <MediaCard 
               key={`${item.id}-${item.thumbnail_url}-${item.type}`}
               item={item} 
               index={index} 
               onSelect={() => setSelectedPhoto({ url: item.thumbnail_url || '', title: item.title || 'مادة مرئية', desc: item.description || '' })}
             />
          ))}
       </div>
       
       {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-slate-900 border border-slate-800 animate-in fade-in shadow-inner">
             <Search className="w-16 h-16 text-slate-700 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-slate-300 mb-2">لا توجد وسائط تطابق فلترك حالياً.</h3>
             <p className="text-lg text-slate-600">سيتم تزويد المكتبة بالمزيد من المواد الرقمية تباعاً.</p>
          </div>
       )}

       {/* Pagination */}
       {totalPages > 1 && (
          <div className="mt-24 flex items-center justify-center gap-4">
             <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center gap-2 px-6 py-3 rounded-none border border-slate-700 bg-slate-800 text-slate-500 hover:bg-[#b18c39] hover:text-white hover:border-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md font-bold">
               <ChevronRight className="w-5 h-5" /> السابق
             </button>
             <span className="text-slate-500 font-bold text-lg">صفحة {currentPage} من {totalPages}</span>
             <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center gap-2 px-6 py-3 rounded-none border border-slate-700 bg-slate-800 text-slate-500 hover:bg-[#b18c39] hover:text-white hover:border-[#b18c39] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md font-bold">
               التالي <ChevronLeft className="w-5 h-5" />
             </button>
          </div>
       )}

       {/* Photo Lightbox using Portal */}
       {selectedPhoto && mounted && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-slate-950/98 backdrop-blur-xl px-4 md:px-12 py-12">
             <button 
                onClick={() => setSelectedPhoto(null)} 
                className="absolute top-6 right-6 md:top-8 md:right-8 w-14 h-14 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center border border-slate-600 transition-all hover:scale-110 shadow-2xl z-[9999999] hover:text-[#b18c39]"
             >
                <X className="w-6 h-6" />
             </button>
             
             <div className="relative w-full h-full max-h-[75vh] max-w-7xl flex items-center justify-center z-[99999] animate-in zoom-in-95 duration-500 mb-8">
                 {selectedPhoto?.url && (
                    selectedPhoto.url.includes('youtube.com') || selectedPhoto.url.includes('youtu.be') ? (
                       <div className="w-full aspect-video max-h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                          <iframe 
                            src={`https://www.youtube.com/embed/${
                               selectedPhoto.url.includes('v=') 
                               ? selectedPhoto.url.split('v=')[1].split('&')[0] 
                               : selectedPhoto.url.split('youtu.be/')[1].split('?')[0]
                            }?autoplay=1`}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                       </div>
                    ) : (
                       <div className="relative w-full h-full min-h-[50vh]">
                          <Image 
                            src={selectedPhoto.url} 
                            alt={selectedPhoto.title} 
                            fill
                            priority
                            className="object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-xl" 
                          />
                       </div>
                    )
                 )}
              </div>
             
             {/* Info overlay below the image */}
             {selectedPhoto.desc && (
                <div className="max-w-4xl w-full text-center animate-in slide-in-from-bottom-8 duration-700 z-[99999] mt-4">
                  <p className="text-lg text-white font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-lg">{selectedPhoto.desc}</p>
                </div>
             )}
          </div>,
          document.body
       )}
    </>
  );
}
