import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ArchiveDetailClient from './ArchiveDetailClient';
import { createPageMetadata, plainTextExcerpt } from '@/lib/seo';
import { recordPageView } from '@/lib/page-view-server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const getArchiveItem = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('archive')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getArchiveItem(id);

  if (!item) return { robots: { index: false, follow: false } };

  return createPageMetadata(
    item.title,
    plainTextExcerpt(item.description, 'مادة موثقة من أرشيف عبدالملك المخلافي.'),
    `/archive/${id}`,
  );
}

export default async function ArchiveItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getArchiveItem(resolvedParams.id);
  if (!item) notFound();
  const initialViews = await recordPageView('archive', String(item.id), item.title);
  return <ArchiveDetailClient item={item} initialViews={initialViews} />;
}
