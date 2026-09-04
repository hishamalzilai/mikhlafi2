import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ArticleContent from './ArticleContent';
import { createPageMetadata, plainTextExcerpt, SITE_URL } from '@/lib/seo';
import { recordPageView } from '@/lib/page-view-server';

// Force dynamic rendering to ensure live data at runtime
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// Server-side data fetching
const getArticle = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) return { robots: { index: false, follow: false } };

  return createPageMetadata(
    article.title,
    plainTextExcerpt(article.excerpt || article.content, 'مقال من أرشيف عبدالملك المخلافي.'),
    `/articles/${id}`,
  );
}

export default async function ArticleReadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const articleData = await getArticle(resolvedParams.id);

  if (!articleData) {
    notFound();
  }

  const initialViews = await recordPageView('articles', String(articleData.id), articleData.title);
  return <ArticleContent articleData={articleData} initialViews={initialViews} shareUrl={`${SITE_URL}/articles/${articleData.id}`} />;
}
