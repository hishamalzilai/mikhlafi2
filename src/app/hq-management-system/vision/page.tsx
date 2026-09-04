"use client";

import { useEffect, useState } from 'react';
import { getStudiesAction, saveStudyAction, deleteStudyAction } from '../vision-actions';
import { Loader2, Plus, Trash2, Edit, CheckCircle2, BookOpen, UserRound, Tag, Search } from 'lucide-react';

const STUDY_CATEGORIES = ['ورقة عمل', 'دراسة', 'بحث', 'حوار', 'تحليل سياسي', 'رؤية استراتيجية'];

export default function AdminStudiesPage() {
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 10;
  
  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('أ. عبدالملك المخلافي');
  const [category, setCategory] = useState('دراسة');
  const [publishedDate, setPublishedDate] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStudies = async () => {
    setLoading(true);
    try {
      const result = await getStudiesAction();
      if (result.success && result.data) {
        setStudies(result.data);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const resetForm = () => {
    setIsAdding(false);
    setEditId(null);
    setTitle(''); setExcerpt(''); setContent(''); setPublishedDate(''); setAuthor('أ. عبدالملك المخلافي'); setCategory('دراسة');
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setTitle(item.title);
    setExcerpt(item.excerpt || '');
    setContent(item.content || '');
    setAuthor(item.author || 'أ. عبدالملك المخلافي');
    setCategory(item.category || 'دراسة');
    setPublishedDate(item.published_date || '');
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      if (editId) formData.append('id', String(editId));
      formData.append('title', title);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('author', author);
      formData.append('category', category);
      formData.append('published_date', publishedDate);

      const result = await saveStudyAction(formData);
      
      if (!result.success) throw new Error(result.error);

      setSuccessMsg(editId ? 'تم تعديل الدراسة بنجاح!' : 'تمت إضافة الدراسة بنجاح!');
      resetForm();
      fetchStudies();
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (error: any) {
      alert("خطأ: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("هل أنت متأكد من حذف هذه الدراسة نهائياً؟")) return;
    try {
      const result = await deleteStudyAction(id);
      if (!result.success) throw new Error(result.error);
      fetchStudies();
    } catch (e: any) {
      alert("خطأ في الحذف: " + e.message);
    }
  };

  const filteredStudies = studies.filter(s => 
    (s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
    (s.author?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );
  const totalPages = Math.max(1, Math.ceil(filteredStudies.length / ITEMS_PER_PAGE));
  const paginatedStudies = filteredStudies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="animate-in fade-in duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900">إدارة الدراسات والأبحاث</h1>
            <p className="text-slate-500 font-medium mt-1">إضافة، تعديل وحذف الدراسات والأبحاث الأكاديمية والسياسية.</p>
          </div>
          
          {!isAdding && (
             <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                   <Search className="w-5 h-5 absolute top-3 right-3 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="البحث في الدراسات..." 
                     value={searchTerm}
                     onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-medium text-sm"
                   />
                </div>
                <button 
                   onClick={() => setIsAdding(true)}
                   className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center whitespace-nowrap"
                >
                   <Plus className="w-5 h-5" /> إضافة دراسة جديدة
                </button>
             </div>
          )}
       </div>

       {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </div>
       )}

       {isAdding ? (
         <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-black text-slate-800 mb-6 border-b pb-4">{editId ? 'تعديل بيانات الدراسة' : 'محرر الدراسات والأبحاث'}</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
               <div>
                  <label className="block text-slate-700 font-bold mb-2">عنوان الدراسة *</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold" placeholder="مثال: دراسة تحليلية في الأوضاع السياسية..." />
               </div>
               
               <div>
                  <label className="block text-slate-700 font-bold mb-2">النبذة الموجزة (Excerpt)</label>
                  <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-medium resize-none text-slate-600" placeholder="وصف مقتضب يظهر في واجهة الموقع..."></textarea>
               </div>

               <div>
                  <label className="block text-slate-700 font-bold mb-2">النص الكامل للدراسة *</label>
                  <textarea required value={content} onChange={e => setContent(e.target.value)} rows={15} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-medium leading-relaxed" placeholder="يمكنك كتابة الدراسة الكاملة هنا..."></textarea>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 border border-slate-100 rounded-2xl">
                 <div>
                    <label className="block text-slate-700 font-bold mb-2">التصنيف *</label>
                    <div className="relative">
                       <Tag className="w-5 h-5 absolute top-3.5 right-3 text-slate-400" />
                       <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 pr-10 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold text-slate-700 appearance-none cursor-pointer">
                          {STUDY_CATEGORIES.map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-slate-700 font-bold mb-2">تاريخ النشر (اختياري)</label>
                    <input type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold text-slate-700" />
                 </div>
                 
                 <div>
                    <label className="block text-slate-700 font-bold mb-2">الباحث</label>
                    <div className="relative">
                       <UserRound className="w-5 h-5 absolute top-3.5 right-3 text-slate-400" />
                       <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 pr-10 focus:border-[#b18c39] focus:outline-none focus:ring-1 focus:ring-[#b18c39] font-bold text-slate-700" placeholder="اسم الباحث..." />
                    </div>
                 </div>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <button type="submit" disabled={saving} className="bg-[#b18c39] hover:bg-[#9a7930] text-white px-10 py-4 rounded-xl font-black transition-all shadow-lg shadow-[#b18c39]/20 flex items-center justify-center gap-2 w-full sm:w-auto">
                     {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editId ? 'حفظ التعديلات' : 'نشر الدراسة')}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto">
                     إلغاء الأمر
                  </button>
               </div>
            </form>
         </div>
       ) : (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
               <div className="p-20 text-center flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#b18c39]" /></div>
            ) : studies.length === 0 ? (
               <div className="p-24 text-center text-slate-500 flex flex-col items-center">
                  <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="text-xl font-black text-slate-700 mb-2">لا توجد أي دراسات</h3>
                  <p>ابدأ بإضافة أول دراسة لتنعكس مباشرة على الموقع!</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-right whitespace-nowrap">
                     <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-sm">
                        <tr>
                           <th className="p-5 font-black">م</th>
                           <th className="p-5 font-black">العنوان</th>
                           <th className="p-5 font-black">التصنيف</th>
                           <th className="p-5 font-black">الباحث</th>
                           <th className="p-5 font-black">تاريخ النشر</th>
                           <th className="p-5 font-black text-center">الإجراءات</th>
                        </tr>
                     </thead>
                     <tbody>
                        {paginatedStudies.map((n, i) => (
                           <tr key={n.id} className="border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors group">
                              <td className="p-5 font-bold text-slate-400">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                              <td className="p-5 font-bold text-slate-800 max-w-xs truncate" title={n.title}>
                                 {n.title}
                              </td>
                              <td className="p-5">
                                 <span className="text-xs font-black text-[#b18c39] px-3 py-1.5 bg-[#b18c39]/5 border border-[#b18c39]/20 rounded-full">{n.category || 'دراسة'}</span>
                              </td>
                              <td className="p-5 text-slate-500 font-bold">{n.author}</td>
                              <td className="p-5 text-slate-500 font-medium" dir="ltr">{n.published_date}</td>
                              <td className="p-5">
                                 <div className="flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(n)} className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-sm" title="تعديل الدراسة">
                                       <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(n.id)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm" title="حذف الدراسة بالكامل">
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                     <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4">
                        <button 
                           type="button"
                           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                           disabled={currentPage === 1}
                           className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-sm font-bold transition-all shadow-sm"
                        >
                           السابق
                        </button>
                        <span className="text-slate-500 font-bold text-sm">
                           صفحة {currentPage} من {totalPages}
                        </span>
                        <button 
                           type="button"
                           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                           disabled={currentPage === totalPages}
                           className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-sm font-bold transition-all shadow-sm"
                        >
                           التالي
                        </button>
                     </div>
                  )}
               </div>
            )}
         </div>
       )}
    </div>
  );
}
