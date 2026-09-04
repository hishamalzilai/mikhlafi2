import type { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { CACHE_TAGS } from '@/lib/cache';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

type SitemapRecord = {
  id: string | number;
  published_date?: string | null;
  created_at?: string | null;
};

const getSitemapRecords = unstable_cache(
  async () => {
    const [articles, news, archive, studies, testimonials, quotes] = await Promise.all([
      supabase.from('articles').select('id, published_date'),
      supabase.from('news').select('id, published_date'),
      supabase.from('archive').select('id, published_date'),
      supabase.from('studies').select('id, published_date'),
      supabase.from('testimonials').select('id, published_date, created_at'),
      supabase.from('quotes_tweets').select('id, published_date, created_at'),
    ]);

    return {
      articles: (articles.data || []) as SitemapRecord[],
      news: (news.data || []) as SitemapRecord[],
      archive: (archive.data || []) as SitemapRecord[],
      vision: (studies.data || []) as SitemapRecord[],
      testimonials: (testimonials.data || []) as SitemapRecord[],
      quotes: (quotes.data || []) as SitemapRecord[],
    };
  },
  ['public-sitemap-records'],
  {
    revalidate: 3600,
    tags: [
      CACHE_TAGS.articles,
      CACHE_TAGS.news,
      CACHE_TAGS.archive,
      CACHE_TAGS.vision,
      CACHE_TAGS.testimonials,
      CACHE_TAGS.quotes,
    ],
  },
);

function toLastModified(record: SitemapRecord): Date | undefined {
  const value = record.published_date || record.created_at;
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/archive',
    '/archive-cooperation',
    '/articles',
    '/bio',
    '/contact',
    '/library',
    '/news',
    '/quotes',
    '/testimonials',
    '/vision',
  ];

  const records = await getSitemapRecords();
  const dynamicGroups = [
    { path: '/articles', records: records.articles },
    { path: '/news', records: records.news },
    { path: '/archive', records: records.archive },
    { path: '/vision', records: records.vision },
    { path: '/testimonials', records: records.testimonials },
    { path: '/quotes', records: records.quotes },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = dynamicGroups.flatMap((group) =>
    group.records.map((record) => ({
      url: `${SITE_URL}${group.path}/${record.id}`,
      lastModified: toLastModified(record),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...dynamicEntries];
}
