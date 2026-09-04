"use server";

import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { getClientIp } from '@/lib/ip';
import { checkRateLimit } from '@/lib/rate-limit';

const SEARCH_WINDOW_MS = 60 * 1000; // 1 minute
const SEARCH_MAX_REQUESTS = 30;

// Define unified search result type
export type SearchResult = {
  id: string;
  type: 'news' | 'article' | 'study' | 'archive' | 'media' | 'testimonial' | 'quote';
  title: string;
  excerpt: string;
  date: string;
  url: string;
};

export async function searchAll(query: string): Promise<SearchResult[]> {
  const h = await headers();
  const clientIp = getClientIp(h);
  const rateCheck = checkRateLimit(`search:${clientIp}`, SEARCH_WINDOW_MS, SEARCH_MAX_REQUESTS);
  if (!rateCheck.allowed) {
    return [];
  }

  if (!query || query.trim().length < 3) return [];
  
  // Cap query length to prevent abuse
  const trimmedQuery = query.trim().substring(0, 200);
  
  // Escape ILIKE special characters to prevent pattern injection
  const escapedQuery = trimmedQuery
    .replace(/\\/g, '\\\\')  // Escape backslash first
    .replace(/%/g, '\\%')    // Escape percent
    .replace(/_/g, '\\_');   // Escape underscore
  const searchPattern = `%${escapedQuery}%`;

  const [rpcResult, testimonialsResult, quotesResult] = await Promise.all([
    supabase.rpc('search_all', { query_text: trimmedQuery }),
    supabase
      .from('testimonials')
      .select('id, title, content, published_date, author_name')
      .or(`title.ilike.${searchPattern},content.ilike.${searchPattern},author_name.ilike.${searchPattern}`)
      .limit(10),
    supabase
      .from('quotes_tweets')
      .select('id, title, content, excerpt, published_date, content_type')
      .or(`title.ilike.${searchPattern},content.ilike.${searchPattern},excerpt.ilike.${searchPattern}`)
      .limit(10)
  ]);

  let results: SearchResult[] = [];

  if (!rpcResult.error && rpcResult.data) {
    results = rpcResult.data.map((item: any) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      excerpt: item.excerpt || '',
      date: item.date_val ? new Date(item.date_val).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      url: item.url_val
    }));
  } else if (rpcResult.error) {
    console.error("Search RPC error:", rpcResult.error);
  }

  if (!testimonialsResult.error && testimonialsResult.data) {
    const testimonialItems = testimonialsResult.data.map((item: any) => ({
      id: item.id,
      type: 'testimonial' as const,
      title: item.title || item.author_name || 'شهادة / مقال',
      excerpt: item.content ? (item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content) : '',
      date: item.published_date ? new Date(item.published_date).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      url: `/testimonials/${item.id}`
    }));
    results = [...results, ...testimonialItems];
  }

  if (!quotesResult.error && quotesResult.data) {
    const quoteItems = quotesResult.data.map((item: {
      id: number;
      title: string;
      content: string;
      excerpt?: string | null;
      published_date?: string | null;
      content_type: string;
    }) => ({
      id: String(item.id),
      type: 'quote' as const,
      title: item.title,
      excerpt: item.excerpt || (item.content?.length > 100 ? `${item.content.substring(0, 100)}...` : item.content) || '',
      date: item.published_date ? new Date(item.published_date).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      url: `/quotes/${item.id}`
    }));
    results = [...results, ...quoteItems];
  }

  return results;
}
