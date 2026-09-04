import { cache } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createPageMetadata, plainTextExcerpt, SITE_URL } from '@/lib/seo';
import { recordPageView } from '@/lib/page-view-server';
import QuoteContent from './QuoteContent';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const getQuote = cache(async (id: string) => {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const { data, error } = await supabase.from('quotes_tweets').select('*').eq('id', id).single();
  return error ? null : data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getQuote(id);
  if (!item) return { robots: { index: false, follow: false } };
  return createPageMetadata(item.title, plainTextExcerpt(item.excerpt || item.content, 'قول أو تغريدة موثقة.'), `/quotes/${id}`);
}

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getQuote(id);
  if (!item) notFound();
  const initialViews = await recordPageView('quotes_tweets', String(item.id), item.title);
  return <QuoteContent item={item} initialViews={initialViews} shareUrl={`${SITE_URL}/quotes/${item.id}`} />;
}
