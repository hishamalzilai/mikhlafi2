"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Menu,
  X,
  Globe,
  Mail,
  Command
} from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import { getBrandingSettings, BrandingSettings } from '@/app/hq-management-system/branding-actions';
import { getNavOrder } from '@/app/hq-management-system/nav-actions';
import { MASTER_NAVIGATION, NavItem } from '@/lib/nav-config';

export const PortalLogo = ({ className, settings, type = 'header' }: { className?: string, settings?: BrandingSettings | null, type?: 'header' | 'footer' }) => {
  const logoUrl = type === 'header' 
    ? (settings?.header_logo_url || "/logo-last.png")
    : (settings?.footer_logo_url || "/logo-last.png");
  
  const scale = type === 'header'
    ? (settings?.header_logo_scale || 1.0)
    : (settings?.footer_logo_scale || 1.0);

  return (
    <Image 
      src={logoUrl || "/logo-last.png"} 
      alt="الموقع الرسمي لعبدالملك المخلافي"
      width={721}
      height={301}
      priority={type === 'header'}
      style={{ transform: `scale(${scale})`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
      className={`object-contain mix-blend-multiply ${className || ''}`} 
    />
  );
};

export const YemeniEagle = PortalLogo;

function formatCurrentDate() {
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Intl.DateTimeFormat('ar-YE', options).format(new Date());
  } catch {
    return new Date().toLocaleDateString('ar-EG');
  }
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate] = useState(formatCurrentDate);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [navLinks, setNavLinks] = useState<NavItem[]>(MASTER_NAVIGATION);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Branding
      const brandingData = await getBrandingSettings();
      setBranding(brandingData);

      // Fetch Nav Order
      const order = await getNavOrder();
      const mapped = order.map(id => MASTER_NAVIGATION.find(item => item.id === id)).filter(Boolean) as NavItem[];
      // Add any master items that might be missing from the saved order
      const missing = MASTER_NAVIGATION.filter(item => !order.includes(item.id));
      setNavLinks([...mapped, ...missing]);
    };
    fetchData();
    
    const handleCmdK = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleCmdK);
    return () => window.removeEventListener('keydown', handleCmdK);
  }, []);

  return (
    <>
      <div className="bg-[#f5f5f4] text-slate-700 py-2 text-[10px] md:text-xs border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center gap-4">
            <span className="font-bold opacity-80 uppercase hidden sm:block">{currentDate}</span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto mt-1 md:mt-0">
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="bg-white border border-slate-200 rounded-lg py-1.5 px-4 pr-10 text-xs text-slate-500 hover:text-slate-600 transition-all w-full md:w-64 outline-none flex items-center justify-between group shadow-sm hover:shadow-md hover:border-[#b18c39]/50"
              >
                <span className="font-bold flex items-center gap-1.5" suppressHydrationWarning>
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-[#b18c39] transition-colors" />
                  البحث في الموقع...
                </span>
                <span className="hidden sm:flex items-center gap-1 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-widest border border-slate-200">
                  <Command size={10} /> K
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white py-3 md:py-4 border-b-4 border-slate-100 shadow-sm relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative z-10 gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 text-center md:text-right">
            <PortalLogo className="h-32 md:h-44 w-auto" settings={branding} type="header" />
          </div>
        </div>
      </header>

      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-md border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4">
          <ul className="hidden lg:flex items-center justify-between text-slate-700 text-sm font-bold w-full" suppressHydrationWarning>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.id} className={`flex-1 text-center border-l border-slate-50 ${isActive ? 'bg-[#b18c39] text-white shadow-inner' : 'hover:text-[#b18c39] hover:bg-slate-50 transition-all cursor-pointer'}`}>
                  <Link href={link.path} className="block py-5 w-full h-full">
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="lg:hidden p-5 flex justify-between text-slate-800">
            <span className="font-bold text-slate-500">القائمة</span>
            <button aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="text-[#b18c39]" /> : <Menu className="text-[#b18c39]" />}
            </button>
          </div>
          {isMenuOpen && (
            <div className="lg:hidden flex flex-col bg-white border-t border-slate-100">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.id}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`p-4 text-right border-b border-slate-50 text-sm font-bold ${isActive ? 'bg-[#b18c39] text-white' : 'text-slate-700'}`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 py-8 md:py-16 overflow-hidden">
        {children}
      </main>

      <footer className="bg-white text-slate-800 mt-32 pt-32 pb-12 border-t-[10px] border-[#b18c39] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 md:gap-24 mb-16 md:mb-24 text-center md:text-right">
            <div className="col-span-2 flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 mb-8 md:mb-12">
                <PortalLogo className="h-40 md:h-52 w-auto" settings={branding} type="footer" />
              </div>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg font-bold md:pr-16 tracking-tight">
                الموقع الرسمي والأرشيف التاريخي لعبدالملك المخلافي، بهدف توثيق المواقف، الأبحاث، وحفظ الذاكرة الوطنية المعاصرة.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="font-black text-slate-900 text-xl mb-12 border-b border-slate-100 pb-4 inline-block tracking-[0.2em]">خارطة الموقع</p>
              <ul className="space-y-6 text-sm font-bold text-slate-500">
                {navLinks.slice(1, 8).map(link => (
                  <li key={link.id} className="hover:text-[#b18c39] transition-colors flex items-center md:justify-start justify-center gap-4 group font-black uppercase text-xs tracking-widest">
                    <div className="hidden md:block w-2 h-0.5 bg-slate-300 group-hover:bg-[#b18c39] transition-all"></div>
                    <Link href={link.path}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="font-black text-slate-900 text-xl mb-12 border-b border-slate-100 pb-4 inline-block tracking-[0.2em]">تواصل مباشر</p>
              <ul className="space-y-6 text-sm font-bold text-slate-500">
                <li className="flex items-center justify-center md:justify-start gap-4 hover:text-[#b18c39] transition-colors cursor-pointer group" dir="ltr">
                  <Mail className="text-slate-300 group-hover:text-[#b18c39] transition-colors shrink-0 w-5 h-5" /> <span className="text-right">info@abdulmalik-almekhlafi.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-4 hover:text-[#b18c39] transition-colors cursor-pointer group" dir="ltr">
                  <Globe className="text-slate-300 group-hover:text-[#b18c39] transition-colors shrink-0 w-5 h-5" /> <span className="text-right">abdulmalik-almekhlafi.com</span>
                </li>
                <li className="pt-10 flex gap-6 justify-center md:justify-start w-full">
                  <a href="https://x.com/almekhlafi59" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-50 flex items-center justify-center hover:bg-[#b18c39] hover:text-white transition-all cursor-pointer border border-slate-200 font-black text-xl italic shadow-sm shadow-[#b18c39]/10">X</a>
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center hover:bg-[#b18c39] hover:text-white transition-all cursor-pointer border border-slate-200 font-black text-xl italic shadow-sm shadow-[#b18c39]/10">f</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-600">
            <p>© 2026 جميع الحقوق محفوظة - الموقع الرسمي لعبدالملك المخلافي</p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-[0.02] pointer-events-none">
          <YemeniEagle className="w-[60rem] h-[60rem] translate-x-1/4 translate-y-1/4" />
        </div>
      </footer>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
