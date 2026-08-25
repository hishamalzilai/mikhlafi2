"use client";

import { useState } from 'react';
import { Activity, ShieldCheck, Search, Trash2, CheckCircle2, AlertTriangle, Loader2, Layers } from 'lucide-react';
import { findDuplicatesAction, deleteSpecificItemsAction } from './actions';
import AnalyticsOverview from './AnalyticsOverview';

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<any>(null);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const sections = [
    { id: 'articles', name: 'المقالات', icon: '📝' },
    { id: 'news', name: 'الأخبار', icon: '📰' },
    { id: 'archive', name: 'الدراسات والبحوث', icon: '📚' },
    { id: 'testimonials', name: 'الشهادات المتكررة', icon: '🎓' },
  ];

  const handleFindDuplicates = async (section: any) => {
    setActiveSection(section);
    setDuplicates([]);
    setSelectedIds([]);
    setMessage({ text: '', type: '' });
    setLoadingDuplicates(true);
    
    try {
      const res = await findDuplicatesAction(section.id);
      if (res.success) {
        setDuplicates(res.duplicates || []);
      } else {
        setMessage({ text: res.error || 'حدث خطأ غير معروف.', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'خطأ في الاتصال بالخادم', type: 'error' });
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const handleSelectId = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllExceptLatest = () => {
    const idsToSelect: number[] = [];
    duplicates.forEach(group => {
      const duplicatesToDelete = group.items.slice(1).map((item: any) => item.id);
      idsToSelect.push(...duplicatesToDelete);
    });
    setSelectedIds(idsToSelect);
  };

  const handleDelete = async () => {
    if (confirmText !== 'حذف') {
      setMessage({ text: 'الرجاء كتابة كلمة "حذف" للتأكيد', type: 'error' });
      return;
    }

    if (selectedIds.length === 0) return;

    setIsDeleting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await deleteSpecificItemsAction(activeSection.id, selectedIds);
      if (res.success) {
        setMessage({ text: 'تم حذف البيانات المحددة بنجاح.', type: 'success' });
        
        setTimeout(() => {
          setConfirmText('');
          setShowConfirm(false);
          handleFindDuplicates(activeSection);
        }, 1500);
      } else {
        setMessage({ text: res.error || 'حدث خطأ أثناء الحذف.', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'خطأ في الاتصال', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-10">
         <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#b18c39]" />
         </div>
         <div>
            <h1 className="text-3xl font-black text-slate-900">نظرة عامة</h1>
            <p className="text-slate-500 font-medium">لوحة التحكم والمؤشرات العامة</p>
         </div>
      </div>

      <AnalyticsOverview />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-12">
            <Activity className="w-12 h-12 text-[#b18c39] mb-4" />
            <h3 className="text-2xl font-black text-slate-800 mb-2">أهلاً بك في النظام الموحد</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mt-2">
               جميع العمليات من نشر، وتعديل، وحذف، تتم بصورة لحظية (Real-Time). يرجى اختيار القسم المراد من القائمة الجانبية لإدارة محتوياته.
            </p>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h3 className="text-xl font-black text-[#b18c39] flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Layers className="w-6 h-6" />
          معالجة البيانات المتكررة (Duplicates)
        </h3>
        <p className="text-slate-500 font-medium mb-6">
          يمكنك من خلال هذه القائمة البحث عن العناصر المكررة في الأقسام وعرضها لاختيار ما تود حذفه منها بكل سهولة وأمان.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-800">قسم {section.name}</h4>
                  <p className="text-xs text-slate-400">فحص التكرارات في هذا القسم</p>
                </div>
              </div>
              <button
                onClick={() => handleFindDuplicates(section)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" /> فحص وعرض
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeSection && !showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#b18c39]" />
                التكرارات المكتشفة في: {activeSection.name}
              </h3>
              <button onClick={() => setActiveSection(null)} className="text-slate-400 hover:text-slate-600">
                إغلاق
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {message.text}
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2">
              {loadingDuplicates ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#b18c39]" />
                  <p>جاري البحث عن البيانات المتكررة بدقة عالية...</p>
                </div>
              ) : duplicates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500" />
                  <h4 className="text-lg font-bold text-slate-800">القسم سليم تماماً!</h4>
                  <p>لم يتم العثور على أي عناصر مكررة في قسم {activeSection.name}.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <p className="text-amber-800 font-bold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> تم العثور على {duplicates.length} مجموعة متكررة
                    </p>
                    <button 
                      onClick={selectAllExceptLatest}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    >
                      تحديد الكل باستثناء الأحدث
                    </button>
                  </div>

                  {duplicates.map((group, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                        <span className="truncate max-w-lg" title={group.displayTitle}>{group.displayTitle}</span>
                        <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs">{group.count} نسخ</span>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-sm text-right">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="p-3 font-medium w-12">تحديد</th>
                              <th className="p-3 font-medium">المعرف (ID)</th>
                              <th className="p-3 font-medium">تاريخ الإضافة</th>
                              <th className="p-3 font-medium">الحالة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.items.map((item: any, i: number) => (
                              <tr key={item.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${selectedIds.includes(item.id) ? 'bg-red-50/50' : ''}`}>
                                <td className="p-3">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => handleSelectId(item.id)}
                                  />
                                </td>
                                <td className="p-3 font-bold text-slate-600">#{item.id}</td>
                                <td className="p-3 text-slate-500" dir="ltr">{new Date(item.created_at).toLocaleString('ar-EG')}</td>
                                <td className="p-3">
                                  {i === 0 ? <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">النسخة الأحدث</span> : <span className="text-slate-500 text-xs">نسخة قديمة</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {duplicates.length > 0 && (
              <div className="mt-6 border-t pt-4 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-600">
                  تم تحديد: <span className="text-red-600 text-lg">{selectedIds.length}</span> عنصر للحذف
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (selectedIds.length === 0) {
                        setMessage({ text: 'الرجاء تحديد عنصر واحد على الأقل', type: 'error' });
                        return;
                      }
                      setShowConfirm(true);
                      setConfirmText('');
                      setMessage({ text: '', type: '' });
                    }}
                    disabled={selectedIds.length === 0}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> حذف المحدد
                  </button>
                  <button
                    onClick={() => setActiveSection(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-center text-slate-900 mb-2">تأكيد الحذف النهائي</h3>
            <p className="text-center text-slate-500 font-medium mb-6">
              أنت على وشك حذف <span className="font-bold text-red-600">{selectedIds.length}</span> عنصر متكرر بشكل نهائي.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                للتأكيد، اكتب كلمة <span className="text-red-600 bg-red-50 px-2 py-1 rounded">حذف</span>:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="حذف"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-center font-bold focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                dir="rtl"
              />
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== 'حذف'}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد الحذف'}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setMessage({ text: '', type: '' });
                }}
                disabled={isDeleting}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
