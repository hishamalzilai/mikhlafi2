export const VIEW_CONTENT_TYPES = [
  'articles',
  'news',
  'archive',
  'studies',
  'testimonials',
  'quotes_tweets',
] as const;

export type ViewContentType = (typeof VIEW_CONTENT_TYPES)[number];

export type PageViewTotal = {
  contentType: ViewContentType;
  contentId: string;
  title: string;
  path: string;
  views: number;
};

export const VIEW_TYPE_CONFIG: Record<
  ViewContentType,
  { table: string; path: string; label: string }
> = {
  articles: { table: 'articles', path: 'articles', label: 'مقال' },
  news: { table: 'news', path: 'news', label: 'خبر أو رأي' },
  archive: { table: 'archive', path: 'archive', label: 'مادة أرشيفية' },
  studies: { table: 'studies', path: 'vision', label: 'دراسة' },
  testimonials: { table: 'testimonials', path: 'testimonials', label: 'شهادة' },
  quotes_tweets: { table: 'quotes_tweets', path: 'quotes', label: 'قول أو تغريدة' },
};

const NUMERIC_ID_TYPES: ViewContentType[] = ['articles', 'news', 'archive', 'studies', 'quotes_tweets'];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isViewContentType(value: unknown): value is ViewContentType {
  return typeof value === 'string' && VIEW_CONTENT_TYPES.includes(value as ViewContentType);
}

export function isValidViewContentId(type: ViewContentType, value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 64) return false;

  if (NUMERIC_ID_TYPES.includes(type)) {
    return /^[1-9]\d*$/.test(value);
  }

  return UUID_PATTERN.test(value);
}

export function getCairoDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
