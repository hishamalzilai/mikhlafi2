import React from 'react';
import { Mail, MapPin, Globe, MessageSquare, Send, Share2 } from 'lucide-react';
import ContactForm from './ContactForm';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata(
  'تواصل معنا',
  'قنوات التواصل الرسمية مع فريق موقع عبدالملك المخلافي.',
  '/contact',
);

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-10 md:p-20 relative overflow-hidden mb-16 shadow-2xl">
         {/* Background Decor */}
         <div className="absolute inset-0 bg-pattern opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/logo-last.png" alt="" className="absolute -left-20 -bottom-32 w-[50rem] h-auto object-contain grayscale invert mix-blend-screen opacity-10 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-start gap-4 max-w-7xl mx-auto">
            <span className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-5 py-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-sm backdrop-blur-sm shadow-inner mt-4 flex items-center gap-2">
               <MessageSquare className="w-4 h-4" />
               قنوات التواصل الرسمية
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white flex items-center gap-4 drop-shadow-xl tracking-tight leading-tight mt-2">
               تواصل معنا
            </h1>

         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid lg:grid-cols-12 gap-16">
            {/* Contact Form Section */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-slate-200 shadow-xl rounded-none relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                     <Send className="text-[#b18c39] w-8 h-8" />
                     أرسل رسالتك الآن
                  </h3>
                  
                  <ContactForm />
               </div>
               {/* Accent decoration */}
               <div className="absolute top-0 right-0 w-32 h-1 bg-[#b18c39]"></div>
            </div>

            {/* Info and Social Section */}
            <div className="lg:col-span-5 space-y-10">
               {/* Contact Cards */}
               <div className="space-y-6">
                  <div className="bg-white p-8 border-r-8 border-[#b18c39] shadow-lg flex items-start gap-6 group hover:translate-x-[-8px] transition-all duration-500">
                     <div className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xl group-hover:bg-[#b18c39] transition-colors">
                        <Mail className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">البريد الإلكتروني الرسمي</h4>
                        <p className="text-xl font-black text-slate-900 break-all" dir="ltr">info@abdulmalik-almekhlafi.com</p>
                        <p className="text-sm text-slate-500 font-bold mt-1">للتواصل المباشر والرد السريع</p>
                     </div>
                  </div>

                  <div className="bg-white p-8 border-r-8 border-slate-900 shadow-lg flex items-start gap-6 group hover:translate-x-[-8px] transition-all duration-500">
                     <div className="w-14 h-14 bg-slate-100 text-[#b18c39] flex items-center justify-center shrink-0 border border-slate-200 shadow-sm group-hover:bg-[#b18c39] group-hover:text-white transition-colors">
                        <Globe className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">الموقع الرسمي</h4>
                        <p className="text-xl font-black text-slate-900" dir="ltr">www.abdulmalik-almekhlafi.com</p>
                        <p className="text-sm text-slate-500 font-bold mt-1">المنصة الرقمية الموثقة</p>
                     </div>
                  </div>

                  <div className="bg-[#1e293b] p-8 border-r-8 border-[#b18c39] shadow-2xl flex items-start gap-6 group">
                     <div className="w-14 h-14 bg-[#b18c39] text-white flex items-center justify-center shrink-0 shadow-lg">
                        <Share2 className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">التواصل الاجتماعي الرسمي</h4>
                        <div className="flex gap-6">
                           <a href="https://x.com/almekhlafi59" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center hover:bg-[#b18c39] transition-all border border-slate-700 hover:border-[#b18c39] shadow-lg group-hover:rotate-6 font-black text-xl italic pt-1 text-center">X</a>
                           <a href="#" className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center hover:bg-[#b18c39] transition-all border border-slate-700 hover:border-[#b18c39] shadow-lg group-hover:rotate-12 font-black text-2xl italic pt-1 text-center font-serif">f</a>
                           <a href="#" className="w-12 h-12 bg-slate-800 text-white flex items-center justify-center hover:bg-[#b18c39] transition-all border border-slate-700 hover:border-[#b18c39] shadow-lg group-hover:rotate-6 font-black text-xl italic pt-1 text-center">Y</a>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Watermark Logo Container */}
               <div className="pt-8 opacity-20 hidden lg:block">
                  <img src="/logo-last.png" alt="" className="w-full grayscale contrast-125" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
