export type NavItem = {
  id: string;
  path: string;
  title: string;
};

export const MASTER_NAVIGATION: NavItem[] = [
  { id: 'home', path: '/', title: 'الرئيسية' },
  { id: 'bio', path: '/bio', title: 'السيرة والمحطات' },
  { id: 'vision', path: '/vision', title: 'دراسات وأبحاث' },
  { id: 'news', path: '/news', title: 'أخبار وآراء' },
  { id: 'articles', path: '/articles', title: 'مقالات' },
  { id: 'quotes', path: '/quotes', title: 'أقوال وتغريدات' },
  { id: 'testimonials', path: '/testimonials', title: 'شهادات وآراء' },
  { id: 'archive', path: '/archive', title: 'الأرشيف الشامل' },
  { id: 'archive-cooperation', path: '/archive-cooperation', title: 'دعوة تعاون توثيق' },
  { id: 'library', path: '/library', title: 'المكتبة المرئية' },
  { id: 'contact', path: '/contact', title: 'تواصل' },
];

export const DEFAULT_NAV_ORDER = MASTER_NAVIGATION.map(item => item.id);
