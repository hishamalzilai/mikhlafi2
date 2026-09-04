"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit, Loader2, MessageSquareQuote, Plus, Search, Trash2 } from 'lucide-react';
import { deleteQuoteAction, getQuotesAction, saveQuoteAction } from '../quotes-actions';

type QuoteRecord = {
  id: number;
  title: string;
  content: string;
  excerpt?: string | null;
  author: string;
  content_type: 'قول' | 'تغريدة';
  source_url?: string | null;
  published_date?: string | null;
};

const EMPTY_FORM = {
  title: '', content: '', excerpt: '', author: 'أ. عبدالملك المخلافي',
  content_type: 'قول' as 'قول' | 'تغريدة', source_url: '', published_date: '',
};

export default function AdminQuotesPage() {
  const [items, setItems] = useState<QuoteRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    const result = await getQuotesAction();
    if (result.success) setItems((result.data || []) as QuoteRecord[]);
    else if (result.error === 'Unauthorized') window.location.href = '/hq-management-system/login';
    else alert(`خطأ: ${result.error}`);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    getQuotesAction().then(result => {
      if (!active) return;
      if (result.success) setItems((result.data || []) as QuoteRecord[]);
      else if (result.error === 'Unauthorized') window.location.href = '/hq-management-system/login';
      else alert(`خطأ: ${result.error}`);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const reset = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setIsEditing(false);
  };

  const edit = (item: QuoteRecord) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      author: item.author,
      content_type: item.content_type,
      source_url: item.source_url || '',
      published_date: item.published_date || '',
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const data = new FormData();
    if (editId) data.set('id', String(editId));
    Object.entries(form).forEach(([key, value]) => data.set(key, value));
    const result = await saveQuoteAction(data);
    setSaving(false);
    if (!result.success) return alert(`خطأ: ${result.error}`);
    setMessage(editId ? 'تم حفظ التعديلات بنجاح' : 'تم نشر المحتوى بنجاح');
    reset();
    await loadItems();
    setTimeout(() => setMessage(''), 3000);
  };

  const remove = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المحتوى نهائيًا؟')) return;
    const result = await deleteQuoteAction(id);
    if (!result.success) return alert(`خطأ: ${result.error}`);
    await loadItems();
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? items.filter(item => [item.title, item.author, item.content_type].some(value => value?.toLowerCase().includes(term))) : items;
  }, [items, search]);

  const field = (key: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [key]: value }));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة الأقوال والتغريدات</h1>
          <p className="mt-1 font-medium text-slate-500">إضافة الأقوال والتغريدات وتعديلها ونشر مصادرها.</p>
        </div>
        {!isEditing && <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-xl bg-[#b18c39] px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-[#9a7930]"><Plus className="h-5 w-5" /> إضافة محتوى جديد</button>}
      </div>

      {message && <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700"><CheckCircle2 className="h-5 w-5" />{message}</div>}

      {isEditing ? (
        <form onSubmit={save} className="mb-8 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h2 className="border-b pb-4 text-xl font-black text-slate-800">{editId ? 'تعديل المحتوى' : 'محرر الأقوال والتغريدات'}</h2>
          <div>
            <label className="mb-2 block font-bold text-slate-700">العنوان *</label>
            <input required value={form.title} onChange={e => field('title', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-bold outline-none focus:border-[#b18c39]" placeholder="عنوان مختصر للقول أو التغريدة" />
          </div>
          <div>
            <label className="mb-2 block font-bold text-slate-700">النبذة الموجزة</label>
            <textarea rows={2} value={form.excerpt} onChange={e => field('excerpt', e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-[#b18c39]" placeholder="وصف يظهر في بطاقة المحتوى..." />
          </div>
          <div>
            <label className="mb-2 block font-bold text-slate-700">نص القول أو التغريدة *</label>
            <textarea required rows={10} value={form.content} onChange={e => field('content', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-medium leading-loose outline-none focus:border-[#b18c39]" placeholder="اكتب النص الكامل هنا..." />
          </div>
          <div className="grid gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 md:grid-cols-2 lg:grid-cols-4">
            <div><label className="mb-2 block font-bold text-slate-700">النوع *</label><select value={form.content_type} onChange={e => field('content_type', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-bold outline-none focus:border-[#b18c39]"><option value="قول">قول</option><option value="تغريدة">تغريدة</option></select></div>
            <div><label className="mb-2 block font-bold text-slate-700">القائل / الكاتب *</label><input required value={form.author} onChange={e => field('author', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-bold outline-none focus:border-[#b18c39]" /></div>
            <div><label className="mb-2 block font-bold text-slate-700">تاريخ النشر</label><input type="date" value={form.published_date} onChange={e => field('published_date', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 font-bold outline-none focus:border-[#b18c39]" /></div>
            <div><label className="mb-2 block font-bold text-slate-700">رابط المصدر</label><input type="url" dir="ltr" value={form.source_url} onChange={e => field('source_url', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-[#b18c39]" placeholder="https://x.com/..." /></div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row"><button disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-[#b18c39] px-10 py-4 font-black text-white disabled:opacity-50">{saving && <Loader2 className="h-5 w-5 animate-spin" />}{editId ? 'حفظ التعديلات' : 'نشر المحتوى'}</button><button type="button" onClick={reset} className="rounded-xl bg-slate-100 px-8 py-4 font-bold text-slate-700">إلغاء الأمر</button></div>
        </form>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative border-b border-slate-100 p-5"><Search className="absolute right-8 top-8 h-5 w-5 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 outline-none focus:border-[#b18c39]" placeholder="البحث في الأقوال والتغريدات..." /></div>
          {loading ? <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-[#b18c39]" /></div> : filtered.length === 0 ? <div className="p-20 text-center text-slate-500"><MessageSquareQuote className="mx-auto mb-4 h-16 w-16 text-slate-200" /><p className="font-black">لا يوجد محتوى حتى الآن</p></div> : (
            <div className="overflow-x-auto"><table className="w-full whitespace-nowrap text-right"><thead className="border-b bg-slate-50 text-sm text-slate-600"><tr><th className="p-5">العنوان</th><th className="p-5">النوع</th><th className="p-5">القائل</th><th className="p-5">التاريخ</th><th className="p-5 text-center">الإجراءات</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="max-w-xs truncate p-5 font-bold">{item.title}</td><td className="p-5"><span className="rounded-full border border-[#b18c39]/20 bg-[#b18c39]/5 px-3 py-1 text-xs font-black text-[#9a7930]">{item.content_type}</span></td><td className="p-5 font-bold text-slate-500">{item.author}</td><td className="p-5 text-slate-500" dir="ltr">{item.published_date}</td><td className="p-5"><div className="flex justify-center gap-3"><button onClick={() => edit(item)} className="rounded-lg bg-blue-50 p-2.5 text-blue-500" title="تعديل"><Edit className="h-4 w-4" /></button><button onClick={() => remove(item.id)} className="rounded-lg bg-red-50 p-2.5 text-red-500" title="حذف"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>
          )}
        </div>
      )}
    </div>
  );
}
