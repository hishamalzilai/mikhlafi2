"use client";

import React, { useState, useEffect } from 'react';
import { Save, ArrowUp, ArrowDown, RefreshCw, CheckCircle2, AlertCircle, Menu, ArrowLeft, Layout } from 'lucide-react';
import Link from 'next/link';
import { getNavOrder, updateNavOrder } from '../nav-actions';
import { MASTER_NAVIGATION, NavItem } from '@/lib/nav-config';

export default function NavigationManagement() {
  const [orderedItems, setOrderedItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const order = await getNavOrder();
      // Map the IDs back to the full item data
      const mapped = order.map(id => MASTER_NAVIGATION.find(item => item.id === id)).filter(Boolean) as NavItem[];
      
      // Add any master items that might be missing from the saved order
      const missing = MASTER_NAVIGATION.filter(item => !order.includes(item.id));
      setOrderedItems([...mapped, ...missing]);
      
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...orderedItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    setOrderedItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const order = orderedItems.map(item => item.id);
      const res = await updateNavOrder(order);
      if (res.success) {
        setMessage({ type: 'success', text: 'تم حفظ ترتيب القائمة بنجاح' });
      } else {
        setMessage({ type: 'error', text: res.error || 'حدث خطأ أثناء الحفظ' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-10 h-10 text-[#b18c39] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Link href="/hq-management-system" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#b18c39] transition-colors mb-4 font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">إدارة ترتيب القائمة</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">تحكم في تسلسل التبويبات في أعلى الصفحة والقائمة الجانبية.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-[#b18c39]/20 flex items-center gap-3 disabled:opacity-50 disabled:scale-95 active:scale-95"
        >
          {saving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          حفظ الترتيب
        </button>
      </div>

      {message && (
        <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      {/* Reorder List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-900">
            <Menu className="w-6 h-6" />
            <span className="font-black">العنصر</span>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">التحكم بالترتيب</span>
        </div>
        
        <div className="divide-y divide-slate-50">
          {orderedItems.map((item, index) => (
            <div key={item.id} className="p-6 md:px-10 flex items-center justify-between group hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-6">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-400">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-black text-slate-800 text-lg">{item.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter uppercase">{item.path}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#b18c39] hover:border-[#b18c39]/30 transition-all disabled:opacity-20 shadow-sm"
                >
                  <ArrowUp size={20} />
                </button>
                <button 
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === orderedItems.length - 1}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#b18c39] hover:border-[#b18c39]/30 transition-all disabled:opacity-20 shadow-sm"
                >
                  <ArrowDown size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 text-amber-900 flex items-start gap-5">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 text-amber-600">
           <Layout className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-lg mb-2">تعليمات الترتيب:</h4>
          <p className="text-sm font-medium leading-relaxed opacity-80">
            استخدم الأسهم لتحريك العناصر للأعلى أو للأسفل. الترتيب الذي تراه هنا سيتم تطبيقه فوراً على القائمة الرئيسية في أعلى الموقع، وكذلك في القائمة الجانبية للأجهزة المحمولة. 
            <br />
            <strong className="mt-2 block">ملاحظة:</strong> التغييرات ستظهر للزوار فور الضغط على زر &quot;حفظ الترتيب&quot;.
          </p>
        </div>
      </div>
    </div>
  );
}
