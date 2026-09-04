"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Home, Quote, Type, Info, CheckCircle2, AlertCircle, BookOpen, Calendar, Plus, Trash2, Shield, Globe, Scale, Users } from 'lucide-react';
import { getHomepageSettings, updateHomepageSettings, HomepageContent, TimelineItem } from '../home-actions';

const AVAILABLE_ICONS = [
  { id: 'Shield', icon: Shield, label: 'درع' },
  { id: 'Globe', icon: Globe, label: 'عالم' },
  { id: 'Scale', icon: Scale, label: 'ميزان' },
  { id: 'Users', icon: Users, label: 'أشخاص' },
  { id: 'BookOpen', icon: BookOpen, label: 'كتاب' },
  { id: 'Calendar', icon: Calendar, label: 'تقويم' }
];

export default function HomepageManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [content, setContent] = useState<HomepageContent>({
    hero_title: '',
    hero_quote: '',
    hero_subtitle: '',
    vision_quote: '',
    timeline_items: []
  });

  useEffect(() => {
    async function loadData() {
      const data = await getHomepageSettings();
      if (data) {
        setContent({
          ...data,
          timeline_items: data.timeline_items || []
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const result = await updateHomepageSettings(content);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح، وستظهر فوراً على الموقع.' });
    } else {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ: ' + result.error });
    }
    
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      year: '2024',
      title: 'عنوان المحطة الجديدة',
      desc: 'وصف مختصر لهذه المحطة الوطنية...',
      icon: 'Shield'
    };
    setContent({
      ...content,
      timeline_items: [...(content.timeline_items || []), newItem]
    });
  };

  const removeTimelineItem = (index: number) => {
    const newList = [...(content.timeline_items || [])];
    newList.splice(index, 1);
    setContent({ ...content, timeline_items: newList });
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const newList = [...(content.timeline_items || [])];
    newList[index] = { ...newList[index], [field]: value };
    setContent({ ...content, timeline_items: newList });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#b18c39] animate-spin" />
        <p className="text-slate-500 font-bold">جاري تحميل إعدادات الصفحة الرئيسية...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Home className="text-[#b18c39] w-8 h-8" />
            إدارة الصفحة الرئيسية
          </h1>
          <p className="text-slate-500 font-bold mt-2">تحكم في العناوين، الاقتباسات، والمحتوى التعريفي الواجهة.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#b18c39] hover:bg-[#96752d] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-[#b18c39]/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          حفظ التغييرات
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in zoom-in duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
            : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid gap-8">
        {/* Hero Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
            <Type className="text-[#b18c39] w-5 h-5" />
            <h2 className="text-xl font-black text-slate-800">القسم الرئيسي (Hero)</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Info size={14} className="text-slate-400" /> الاسم واللقب الرئيسي
              </label>
              <input 
                type="text" 
                value={content.hero_title}
                onChange={(e) => setContent({...content, hero_title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#b18c39] focus:bg-white transition-all font-bold"
                placeholder="مثال: عبدالملك المخلافي"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Info size={14} className="text-slate-400" /> الوصف التعريفي القصير (Badge)
              </label>
              <input 
                type="text" 
                value={content.hero_subtitle}
                onChange={(e) => setContent({...content, hero_subtitle: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#b18c39] focus:bg-white transition-all font-bold"
                placeholder="مثال: الموقع الرقمي الشامل والأرشيف التاريخي لعبدالملك المخلافي"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Quote size={14} className="text-slate-400" /> الاقتباس الرئيسي (مقولة الواجهة)
            </label>
            <textarea 
              rows={3}
              value={content.hero_quote}
              onChange={(e) => setContent({...content, hero_quote: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#b18c39] focus:bg-white transition-all font-bold resize-none"
              placeholder="اكتب المقولة التي ستظهر بجانب الصورة..."
            />
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
            <BookOpen className="text-[#b18c39] w-5 h-5" />
            <h2 className="text-xl font-black text-slate-800">قسم الرؤية والدراسات</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Quote size={14} className="text-slate-400" /> اقتباس الرؤية (Vision Quote)
            </label>
            <textarea 
              rows={4}
              value={content.vision_quote}
              onChange={(e) => setContent({...content, vision_quote: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#b18c39] focus:bg-white transition-all font-bold resize-none"
              placeholder="اكتب الاقتباس الذي سيظهر في قسم الرؤية..."
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Calendar className="text-[#b18c39] w-5 h-5" />
              <h2 className="text-xl font-black text-slate-800">المحطات الوطنية</h2>
            </div>
            <button 
              type="button"
              onClick={addTimelineItem}
              className="bg-slate-900 hover:bg-[#b18c39] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> إضافة محطة جديدة
            </button>
          </div>

          <div className="grid gap-6">
            {(content.timeline_items || []).map((item, index) => (
              <div key={index} className="group relative bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 animate-in zoom-in duration-300">
                <button 
                  type="button"
                  onClick={() => removeTimelineItem(index)}
                  className="absolute top-4 left-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase">السنة / الفترة</label>
                    <input 
                      type="text"
                      value={item.year}
                      onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#b18c39] font-bold text-sm"
                      placeholder="مثال: 2015"
                    />
                  </div>
                  
                  <div className="md:col-span-10 space-y-2">
                     <label className="text-xs font-black text-slate-500 uppercase">عنوان المحطة</label>
                     <input 
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#b18c39] font-bold text-sm"
                        placeholder="مثال: نائب رئيس الوزراء"
                     />
                  </div>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase">أيقونة</label>
                    <div className="grid grid-cols-3 gap-2">
                      {AVAILABLE_ICONS.map((icon) => (
                        <button
                          key={icon.id}
                          type="button"
                          onClick={() => updateTimelineItem(index, 'icon', icon.id)}
                          className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                            item.icon === icon.id 
                              ? 'bg-[#b18c39] border-[#b18c39] text-white' 
                              : 'bg-white border-slate-200 text-slate-400 hover:border-[#b18c39] hover:text-[#b18c39]'
                          }`}
                          title={icon.label}
                        >
                          <icon.icon size={16} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-10 space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase">الوصف</label>
                    <textarea 
                      rows={2}
                      value={item.desc}
                      onChange={(e) => updateTimelineItem(index, 'desc', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#b18c39] font-bold text-sm resize-none"
                      placeholder="وصف مختصر..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {(!content.timeline_items || content.timeline_items.length === 0) && (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400 font-bold">لا توجد محطات وطنية مضافة حالياً. اضف أول محطة للبدء.</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
