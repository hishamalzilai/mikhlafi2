import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import NewsContent from './NewsContent';
import { createPageMetadata, plainTextExcerpt } from '@/lib/seo';
import { recordPageView } from '@/lib/page-view-server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const getNewsItem = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNewsItem(id);

  if (!item) return { robots: { index: false, follow: false } };

  return createPageMetadata(
    item.title,
    plainTextExcerpt(item.excerpt || item.content, 'خبر من الموقع الرسمي لعبدالملك المخلافي.'),
    `/news/${id}`,
  );
}

export default async function NewsReadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const newsItem = await getNewsItem(resolvedParams.id);
  if (!newsItem) notFound();
  const initialViews = await recordPageView('news', String(newsItem.id), newsItem.title);
  return <NewsContent newsItem={newsItem} initialViews={initialViews} />;
}
