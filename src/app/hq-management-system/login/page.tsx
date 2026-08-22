"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

import { verifyAdmin } from '../auth-actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifyAdmin(email, password);

    if (!result.success) {
      setError(result.error || 'تعذر تسجيل الدخول.');
      setLoading(false);
    } else {
      router.replace('/hq-management-system');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] mix-blend-screen pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#b18c39] rounded-full blur-[150px] opacity-20 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 relative z-10">
        <div className="text-center mb-10">
          <img src="/logo-last.png" alt="Logo" className="h-20 mx-auto mb-6 object-contain invert mix-blend-screen opacity-70" />
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">تسجيل الدخول</h1>
          <p className="text-slate-400 font-medium">المنصة الإدارية للموقع الرسمي</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold text-center flex items-center justify-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني للإدارة" 
              className="w-full bg-slate-950 border border-slate-800 text-white font-medium rounded-xl py-4 pr-12 pl-4 focus:outline-none focus:border-[#b18c39] focus:ring-1 focus:ring-[#b18c39] transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور" 
              className="w-full bg-slate-950 border border-slate-800 text-white font-medium rounded-xl py-4 pr-12 pl-4 focus:outline-none focus:border-[#b18c39] focus:ring-1 focus:ring-[#b18c39] transition-all"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#b18c39] hover:bg-[#9a7930] text-white font-black text-lg py-4 rounded-xl mt-4 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(177,140,57,0.4)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'دخول المنصة'}
          </button>
        </form>
      </div>

      <div className="mt-8 text-slate-500 text-sm font-bold opacity-60 z-10">
         تسجيل دخول آمن عبر Supabase Auth
      </div>
    </div>
  );
}
