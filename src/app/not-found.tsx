import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة',
  description: 'تعذر العثور على الصفحة المطلوبة.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900">
      <header className="border-b-4 border-slate-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-5 sm:px-6">
          <Link href="/" aria-label="العودة إلى الصفحة الرئيسية">
            {/* Static 44 KB asset: bypass the image optimizer on the high-traffic 404 path. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-last.png"
              alt="الموقع الرسمي لعبدالملك المخلافي"
              width="240"
              height="100"
              className="h-16 w-auto object-contain mix-blend-multiply sm:h-20"
            />
          </Link>
          <Link
            href="/"
            className="border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black text-slate-700 transition-colors hover:border-[#b18c39] hover:text-[#b18c39] sm:text-sm"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[68vh] max-w-6xl items-center px-4 py-16 sm:px-6">
        <section className="relative w-full overflow-hidden border-t-[6px] border-[#b18c39] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-24 text-[15rem] font-black leading-none text-white/[0.035] sm:text-[22rem]"
          >
            404
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="mb-6 text-6xl font-black tracking-tight text-[#b18c39] sm:text-8xl">
              404
            </p>
            <div className="mx-auto mb-8 h-1 w-24 bg-[#b18c39]" />
            <h1 className="mb-5 text-3xl font-black leading-tight sm:text-5xl">
              الصفحة غير موجودة
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base font-bold leading-8 text-slate-300 sm:text-lg">
              ربما نُقل المحتوى أو تغيّر رابطه. يمكنك العودة إلى الصفحة الرئيسية أو متابعة التصفح من الأقسام الرئيسية.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="bg-[#b18c39] px-7 py-4 text-sm font-black text-white shadow-lg transition-colors hover:bg-[#9a7930]"
              >
                العودة للرئيسية
              </Link>
              <Link
                href="/articles"
                className="border border-white/20 bg-white/5 px-7 py-4 text-sm font-black text-white transition-colors hover:border-[#b18c39] hover:text-[#d6b66d]"
              >
                تصفح المقالات
              </Link>
              <Link
                href="/archive"
                className="border border-white/20 bg-white/5 px-7 py-4 text-sm font-black text-white transition-colors hover:border-[#b18c39] hover:text-[#d6b66d]"
              >
                تصفح الأرشيف
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs font-bold text-slate-600">
        © 2026 جميع الحقوق محفوظة - الموقع الرسمي لعبدالملك المخلافي
      </footer>
    </div>
  );
}
