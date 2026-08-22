import type { Metadata } from 'next';

export const SITE_URL = 'https://abdulmalik-almekhlafi.com';

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
  absoluteTitle = false,
): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
    },
  };
}

export function plainTextExcerpt(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;

  const text = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 160) : fallback;
}
