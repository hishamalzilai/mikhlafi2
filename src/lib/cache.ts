import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';
import type { BrandingSettings } from '@/app/hq-management-system/branding-actions';
import type { HomepageContent } from '@/app/hq-management-system/home-actions';

// Cache tags for revalidation
export const CACHE_TAGS = {
  branding: 'branding-settings',
  homepage: 'homepage-settings',
  articles: 'articles-list',
  quotes: 'quotes-list',
  news: 'news-list',
  archive: 'archive-list',
  testimonials: 'testimonials-list',
  vision: 'vision-list',
  media: 'media-list',
} as const;

const DEFAULT_BRANDING: BrandingSettings = {
  header_logo_url: '/logo-last.png',
  header_logo_scale: 1.0,
  footer_logo_url: '/logo-last.png',
  footer_logo_scale: 1.0,
};

const DEFAULT_HOMEPAGE: HomepageContent = {
  hero_title: 'عبد الملك عبد الجليل المخلافي',
  hero_quote: 'سبتمبر 1962 ثورة أعادت للإنسان اليمني إنسانيته وحريته وكرامته وإيمانه بخالقه .\nثورة 26 سبتمبر بمقاييس ما أحدثته في اليمن من تحول هي واحدة من أعظم الثورات وحركات التغيير في التاريخ الإنساني كله',
  hero_subtitle: 'الموقع الرقمي الشامل والأرشيف التاريخي لعبدالملك المخلافي',
  vision_quote: 'مشروعنا واضح إنهاء التمرد واستعادة الدولة وسلاحها وبناء دولة اتحادية ديمقراطية للجميع بدون إقصاء او تهميش لأي طرف اوفئة او جماعة او منطقة .',
};

export const getCachedBranding = unstable_cache(
  async (): Promise<BrandingSettings> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'branding')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return DEFAULT_BRANDING;
        console.error('Error fetching branding settings:', error);
        return DEFAULT_BRANDING;
      }

      return { ...DEFAULT_BRANDING, ...(data.content as any) } as BrandingSettings;
    } catch (err) {
      console.error('Branding fetch catch:', err);
      return DEFAULT_BRANDING;
    }
  },
  ['branding-settings'],
  { revalidate: 300, tags: [CACHE_TAGS.branding] }
);

export const getCachedHomepage = unstable_cache(
  async (): Promise<HomepageContent> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'homepage')
        .single();

      if (error) {
        console.error('Error fetching homepage settings:', error);
        return DEFAULT_HOMEPAGE;
      }

      return data.content as HomepageContent;
    } catch (err) {
      console.error('Homepage fetch catch:', err);
      return DEFAULT_HOMEPAGE;
    }
  },
  ['homepage-settings'],
  { revalidate: 300, tags: [CACHE_TAGS.homepage] }
);

// Re-export cache tags for use in update actions
export { CACHE_TAGS as cacheTags };
