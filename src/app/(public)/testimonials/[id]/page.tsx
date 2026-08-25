import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Content from './Content';
import { createPageMetadata, plainTextExcerpt } from '@/lib/seo';
import { recordPageView } from '@/lib/page-view-server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const getTestimonial = cache(async (id: string) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);

  if (!testimonial) return { robots: { index: false, follow: false } };

  return createPageMetadata(
    testimonial.title || `شهادة ${testimonial.author_name}`,
    plainTextExcerpt(testimonial.content, 'شهادة موثقة في مسيرة عبدالملك المخلافي.'),
    `/testimonials/${id}`,
  );
}

export default async function TestimonialReadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getTestimonial(resolvedParams.id);

  if (!data) {
    notFound();
  }

  const initialViews = await recordPageView(
    'testimonials',
    String(data.id),
    data.title || data.author_name,
  );
  return <Content data={data} initialViews={initialViews} />;
}
