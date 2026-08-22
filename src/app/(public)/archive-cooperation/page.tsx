import React from 'react';
import { Mail, ShieldCheck, History, Share2, MessageSquare, Send, Globe, Award, Landmark } from 'lucide-react';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata(
  'مبادرة توثيق الأرشيف',
  'شارك في توثيق وحفظ الأرشيف التاريخي لعبدالملك المخلافي.',
  '/archive-cooperation',
);

export const dynamic = 'force-static';

export default function ArchiveCooperationPage() {
  return (
    <div className="min-h-screen bg-white pb-24 animate-in fade-in duration-1000">
      {/* Premium Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-[6px] border-[#b18c39] text-white p-12 md:p-32 relative overflow-hidden mb-20 shadow-2xl">
         {/* Background Ornaments */}
         <div className="absolute inset-0 bg-pattern opacity-5 mix-blend-overlay pointer-events-none"></div>
         <img src="/logo-last.png" alt="" className="absolute -left-32 -bottom-40 w-[60rem] h-auto object-contain grayscale invert mix-blend-screen opacity-5 pointer-events-none" />
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(177,140,57,0.08),transparent_50%)]"></div>
         
         <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-5xl mx-auto">
            <div className="bg-[#b18c39]/10 text-[#b18c39] border border-[#b18c39]/20 px-6 py-2.5 font-black uppercase tracking-[0.3em] text-xs md:text-sm rounded-full backdrop-blur-sm shadow-inner flex items-center gap-3">
               <History className="w-5 h-5" />
               حفظ الذاكرة الوطنية
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tighter leading-tight">
               مبادرة توثيق <span className="text-[#b18c39]">أرشيف</span> <br className="hidden md:block" /> عبد الملك المخلافي
            </h1>
            <div className="w-32 h-1.5 bg-[#b18c39] rounded-full"></div>

         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            {/* Importance Text */}
            <div className="space-y-10 group">
               <div className="bg-slate-50 p-10 md:p-14 border-r-8 border-[#b18c39] shadow-inner relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                  <Landmark className="absolute -left-10 -bottom-10 w-48 h-48 text-slate-100 -rotate-12 pointer-events-none" />
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight relative z-10">نداء الواجب الوطني</h2>
                  <p className="text-slate-700 text-xl md:text-2xl font-medium leading-[2.2] text-justify relative z-10">
                    ترحب إدارة الموقع بالباحثين والمهتمين بالشأن السياسي اليمني وكل من رافق مسيرة الأستاذ عبد الملك المخلافي للمساهمة في إثراء الأرشيف الرقمي. وندعو من يمتلك أي وثائق أو صور أو مقالات تتعلق بمسيرته السياسية إلى مشاركتها معنا، بهدف توثيق وحفظ الذاكرة الوطنية.
                  </p>
               </div>

               <div className="flex items-start gap-6 p-8 bg-red-50 border border-red-100 rounded-none transform hover:-rotate-1 transition-transform shadow-lg">
                  <div className="w-16 h-16 bg-red-100 flex items-center justify-center shrink-0 shadow-inner">
                     <ShieldCheck className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-red-900 mb-3 uppercase tracking-wider">لماذا هذا النداء الآن؟</h3>
                     <p className="text-red-700 font-bold leading-relaxed text-lg">
                        تأتي هذه الدعوة في ظل ما تعرضت له ممتلكاته ووثائقه من نهب ومصادرة أكثر من مرة، كان آخرها قيام جماعة الحوثي بمصادرة منزله بما يحتويه، بما في ذلك وثائقه وأرشيفه وتاريخه الشخصي.
                     </p>
                  </div>
               </div>
            </div>

            {/* Visual Call to Action */}
            <div className="relative group">
               <div className="absolute inset-0 bg-[#b18c39]/20 -rotate-3 scale-105 blur-2xl group-hover:bg-[#b18c39]/30 transition-all"></div>
               <div className="relative bg-white border border-slate-200 p-12 md:p-16 shadow-2xl flex flex-col items-center gap-10 text-center">
                  <div className="w-24 h-24 bg-slate-900 text-[#b18c39] flex items-center justify-center shadow-2xl transform group-hover:rotate-[360deg] transition-all duration-1000">
                     <Share2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">شاركنا في إعادة تجميع التاريخ</h3>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed">
                     كل صورة أو قصاصة ورق أو مقال قديم يمثل قطعة من أحجية سياسية وطنية نسعى لإكمالها اليوم للأجيال القادمة.
                  </p>
                  
                  <div className="w-full space-y-4 pt-6">
                     <Link href="/contact" className="w-full bg-[#b18c39] hover:bg-[#9a7930] text-white font-black py-6 flex items-center justify-center gap-4 text-xl shadow-xl transition-all hover:scale-[1.02]">
                        <Send className="w-6 h-6" />
                        تواصل معنا الآن
                     </Link>
                     <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">للتواصل وإرسال المواد، يرجى استخدام القنوات الرسمية المعلنة.</p>
                  </div>

                  {/* Contact channels hidden as requested */}
               </div>
            </div>
         </div>

         {/* Values Bar */}
         <div className="grid md:grid-cols-3 gap-8 py-20 border-t border-slate-100">
            <div className="flex items-center gap-6 p-8 hover:bg-slate-50 transition-colors">
               <Award className="w-12 h-12 text-[#b18c39]" />
               <div>
                  <h4 className="font-black text-xl text-slate-900">الأمانة والتوثيق</h4>
                  <p className="text-sm font-bold text-slate-500 mt-1">نلتزم بأعلى معايير الدقة والأمانة العلمية في عرض المواد.</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 hover:bg-slate-50 transition-colors border-y md:border-y-0 md:border-x border-slate-100">
               <History className="w-12 h-12 text-[#b18c39]" />
               <div>
                  <h4 className="font-black text-xl text-slate-900">الإتاحة الرقمية</h4>
                  <p className="text-sm font-bold text-slate-500 mt-1">نسعى لتوفير الأرشيف للباحثين والمهتمين بالتحول الديمقراطي.</p>
               </div>
            </div>
            <div className="flex items-center gap-6 p-8 hover:bg-slate-50 transition-colors">
               <ShieldCheck className="w-12 h-12 text-[#b18c39]" />
               <div>
                  <h4 className="font-black text-xl text-slate-900">حماية الإرث</h4>
                  <p className="text-sm font-bold text-slate-500 mt-1">نسعى لتعويض ما دمرته يد العبث والنهب الميليشياوي.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
