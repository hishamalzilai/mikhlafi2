import { Eye } from 'lucide-react';

type ViewCounterProps = {
  views: number;
  className?: string;
};

export default function ViewCounter({ views, className = '' }: ViewCounterProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-sans font-bold print:hidden ${className}`}
      title="عدد مرات فتح هذه الصفحة"
    >
      <Eye className="h-4 w-4 text-[#b18c39]" aria-hidden="true" />
      <span>{views.toLocaleString('ar-EG')} مشاهدة</span>
    </div>
  );
}
