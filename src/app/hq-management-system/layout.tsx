"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Newspaper, FileText, BookOpen, Film, FolderArchive, LogOut, UserRound, Menu, X, Home, Quote, Palette, Info } from 'lucide-react';
import Link from 'next/link';
import { logoutAdmin } from './auth-actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace('/hq-management-system/login');
    router.refresh();
  };

  if (pathname === '/hq-management-system/login') {
    return <>{children}</>;
  }

  const isActive = (path: string) => pathname === path ? 'bg-[#b18c39]/10 text-[#b18c39]' : 'hover:bg-slate-800 text-slate-400 hover:text-white';

  const navLinks = [
    { href: "/hq-management-system", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/hq-management-system/home", label: "إدارة الرئيسية", icon: LayoutDashboard, color: "text-[#b18c39]" },
    { href: "/hq-management-system/bio", label: "السيرة والمحطات", icon: UserRound },
    { href: "/hq-management-system/news", label: "الأخبار والآراء", icon: Newspaper },
    { href: "/hq-management-system/about", label: "من نحن", icon: Info },
    { href: "/hq-management-system/testimonials", label: "الشهادات والآراء", icon: Quote },
    { href: "/hq-management-system/articles", label: "المقالات", icon: FileText },
    { href: "/hq-management-system/vision", label: "الدراسات", icon: BookOpen },
    { href: "/hq-management-system/library", label: "المكتبة المرئية", icon: Film },
    { href: "/hq-management-system/archive", label: "الأرشيف الشامل", icon: FolderArchive },
    { href: "/hq-management-system/navigation", label: "ترتيب القائمة", icon: Menu, color: "text-[#b18c39]" },
    { href: "/hq-management-system/branding", label: "الهوية البصرية", icon: Palette, color: "text-[#b18c39]" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans" dir="rtl">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-slate-900 text-white flex items-center justify-between px-4 sticky top-0 z-[60] shadow-xl">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo-last.png" alt="Logo" className="h-8 invert mix-blend-screen opacity-80" />
          <span className="font-black text-sm">لوحة الإدارة</span>
        </div>
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </header>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed lg:sticky top-0 right-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-[55] 
        transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden lg:flex flex-col items-center gap-4">
          <img src="/logo-last.png" alt="Logo" className="w-20 object-contain invert mix-blend-screen opacity-70" />
          <div className="text-white font-black text-lg text-center">
            لوحة تحكم الموقع
          </div>
        </div>
        
        {/* Mobile Sidebar Close Button */}
        <div className="lg:hidden p-4 flex justify-end">
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1 mt-4 font-bold overflow-y-auto no-scrollbar pb-24 lg:pb-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(link.href)}`}
            >
               <link.icon className={`w-5 h-5 ${link.color || ''}`} />
               {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 mt-auto border-t border-slate-800 lg:mb-0 mb-20">
           <button 
             onClick={handleLogout} 
             className="flex items-center gap-3 w-full text-red-400 hover:text-red-300 hover:bg-red-950/30 px-4 py-3 font-bold rounded-xl transition-colors"
           >
             <LogOut className="w-5 h-5" />
             تسجيل الخروج
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 p-4 md:p-8 lg:p-12 pb-24 lg:pb-12">
          {children}
        </div>

        {/* Mobile Bottom Navigation - App-like experience */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-[60] px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Link href="/hq-management-system" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/hq-management-system' ? 'text-[#b18c39]' : 'text-slate-400'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black">الرئيسية</span>
          </Link>
          <Link href="/hq-management-system/home" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/hq-management-system/home' ? 'text-[#b18c39]' : 'text-slate-400'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black">إدارة</span>
          </Link>
          <Link href="/hq-management-system/news" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/hq-management-system/news' ? 'text-[#b18c39]' : 'text-slate-400'}`}>
            <Newspaper size={20} />
            <span className="text-[10px] font-black">الأخبار</span>
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-slate-400">
            <Home size={20} />
            <span className="text-[10px] font-black">الموقع</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
