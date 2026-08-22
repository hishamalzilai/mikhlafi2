"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

type Status = "loading" | "ready" | "success" | "error";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;

    return createBrowserClient(url, anonKey, {
      auth: {
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialiseSession() {
      if (!supabase) {
        setStatus("error");
        setMessage("إعدادات Supabase غير متوفرة.");
        return;
      }

      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          if (!cancelled) {
            setStatus("error");
            setMessage("رابط الدعوة أو الاستعادة منتهي أو غير صالح.");
          }
          return;
        }

        // Remove bearer tokens from the address bar immediately after exchange.
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error || !data.session) {
        setStatus("error");
        setMessage("تعذر إنشاء جلسة المصادقة. اطلب رابطًا جديدًا.");
        return;
      }

      setStatus("ready");
    }

    void initialiseSession();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) return;
    if (password.length < 8) {
      setMessage("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
      return;
    }
    if (password !== confirmation) {
      setMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setSaving(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setStatus("error");
      setMessage("تعذر حفظ كلمة المرور. اطلب رابطًا جديدًا وحاول مرة أخرى.");
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    setStatus("success");
    setMessage("تم تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول إلى لوحة الإدارة.");
  }

  if (status === "loading") {
    return <main className="min-h-screen grid place-items-center bg-slate-950 text-white" dir="rtl">جارٍ التحقق من الرابط…</main>;
  }

  if (status === "success") {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-950 p-6 text-white" dir="rtl">
        <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="mb-3 text-2xl font-black">تم تحديث كلمة المرور</h1>
          <p className="mb-6 text-slate-300">{message}</p>
          <Link className="inline-block rounded-xl bg-[#b18c39] px-6 py-3 font-bold" href="/hq-management-system/login">
            الانتقال إلى تسجيل الدخول
          </Link>
        </section>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-950 p-6 text-white" dir="rtl">
        <section className="w-full max-w-md rounded-2xl border border-red-900/50 bg-slate-900 p-8 text-center">
          <h1 className="mb-3 text-2xl font-black">تعذر إكمال المصادقة</h1>
          <p className="mb-6 text-red-300">{message}</p>
          <Link className="inline-block rounded-xl bg-slate-700 px-6 py-3 font-bold" href="/hq-management-system/login">
            العودة لتسجيل الدخول
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 p-6 text-white" dir="rtl">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="mb-2 text-2xl font-black">تعيين كلمة مرور الإدارة</h1>
        <p className="mb-6 text-slate-400">اختر كلمة مرور قوية لحسابك.</p>
        {message && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{message}</p>}
        <form className="space-y-4" onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="كلمة المرور الجديدة"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-[#b18c39]"
          />
          <input
            type="password"
            minLength={8}
            required
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="تأكيد كلمة المرور"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-[#b18c39]"
          />
          <button disabled={saving} className="w-full rounded-xl bg-[#b18c39] px-4 py-3 font-black disabled:opacity-50">
            {saving ? "جارٍ الحفظ…" : "حفظ كلمة المرور"}
          </button>
        </form>
      </section>
    </main>
  );
}
