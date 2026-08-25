import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import VisionContent from './VisionContent';
import { createPageMetadata, plainTextExcerpt } from '@/lib/seo';
import { recordPageView } from '@/lib/page-view-server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const getStudy = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('studies')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const study = await getStudy(id);

  if (!study) return { robots: { index: false, follow: false } };

  return createPageMetadata(
    study.title,
    plainTextExcerpt(study.excerpt || study.content, 'دراسة من أرشيف عبدالملك المخلافي.'),
    `/vision/${id}`,
  );
}

export default async function StudyReadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const studyData = await getStudy(resolvedParams.id);
  if (!studyData) notFound();
  const initialViews = await recordPageView('studies', String(studyData.id), studyData.title);
  return <VisionContent studyData={studyData} initialViews={initialViews} />;
}
