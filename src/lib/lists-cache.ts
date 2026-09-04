"use server";

import { supabase } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export const getCachedArticles = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('published_date', { ascending: false });
    return data || [];
  },
  ['articles-list'],
  { revalidate: 300, tags: [CACHE_TAGS.articles] }
);

export const getCachedQuotes = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('quotes_tweets')
      .select('*')
      .order('published_date', { ascending: false });
    return data || [];
  },
  ['quotes-list'],
  { revalidate: 300, tags: [CACHE_TAGS.quotes] }
);

export const getCachedNews = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('published_date', { ascending: false });
    return data || [];
  },
  ['news-list'],
  { revalidate: 300, tags: [CACHE_TAGS.news] }
);

export const getCachedArchive = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('archive')
      .select('*')
      .order('published_date', { ascending: false });
    return data || [];
  },
  ['archive-list'],
  { revalidate: 3600, tags: [CACHE_TAGS.archive] }
);

export const getCachedTestimonials = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });
    return data || [];
  },
  ['testimonials-list'],
  { revalidate: 300, tags: [CACHE_TAGS.testimonials] }
);

export const getCachedVision = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('studies')
      .select('*')
      .order('published_date', { ascending: false });
    return data || [];
  },
  ['vision-list'],
  { revalidate: 300, tags: [CACHE_TAGS.vision] }
);

export const getCachedMedia = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  },
  ['media-list'],
  { revalidate: 300, tags: [CACHE_TAGS.media] }
);
