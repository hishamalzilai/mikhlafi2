import { z } from 'zod';
import { isValidImageUrl, isValidMediaUrl, isValidGeneralUrl } from './validate-url';

export const articleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(500),
  content: z.string().min(10, "Content must be at least 10 characters").max(100000),
  author: z.string().max(200).default("أ. عبدالملك المخلافي"),
  excerpt: z.string().max(2000).optional(),
  published_date: z.string().max(50).optional(),
});

export const newsSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(500),
  content: z.string().min(10, "Content must be at least 10 characters").max(100000),
  excerpt: z.string().max(2000).optional(),
  published_date: z.string().max(50).optional(),
  image_url: z.string().refine(
    (val) => val === '' || isValidImageUrl(val),
    { message: "Invalid image URL" }
  ).optional(),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(500).optional(),
  author_name: z.string().min(2, "Author name is required").max(200),
  author_title: z.string().max(200).optional(),
  content: z.string().min(5, "Content is required").max(50000),
  author_image: z.string().refine(
    (val) => val === '' || isValidImageUrl(val),
    { message: "Invalid image URL" }
  ).nullable().optional(),
  order_index: z.coerce.number().default(0),
  published_date: z.string().max(50).optional(),
});

export const mediaLibrarySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2).max(500),
  type: z.enum(['image', 'video', 'document', 'photo']),
  description: z.string().max(5000).optional().nullable(),
  thumbnail_url: z.string().refine(
    (val) => val === '' || isValidMediaUrl(val) || isValidImageUrl(val),
    { message: "Invalid media URL" }
  ).optional().nullable(),
  duration: z.string().max(50).optional().nullable(),
});

export const archiveSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2).max(500),
  type: z.string().max(100),
  description: z.string().max(10000).optional().nullable(),
  published_date: z.string().max(50).optional(),
  file_url: z.string().refine(
    (val) => val === '' || isValidGeneralUrl(val),
    { message: "Invalid file URL" }
  ).optional().nullable(),
  cover_url: z.string().refine(
    (val) => val === '' || isValidImageUrl(val),
    { message: "Invalid cover URL" }
  ).optional().nullable(),
});

export const studySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2).max(500),
  content: z.string().min(10).max(500000),
  author: z.string().max(200).optional(),
  excerpt: z.string().max(2000).optional(),
  category: z.string().max(200).optional(),
  published_date: z.string().max(50).optional(),
});

export const timelineItemSchema = z.object({
  year: z.string().max(100),
  title: z.string().max(500),
  desc: z.string().max(2000),
  icon: z.string().max(100),
});

export const homepageSchema = z.object({
  hero_title: z.string().min(2).max(500),
  hero_quote: z.string().min(2).max(2000),
  hero_subtitle: z.string().min(2).max(500),
  vision_quote: z.string().min(2).max(2000),
  timeline_items: z.array(timelineItemSchema).optional(),
});

export const brandingSchema = z.object({
  header_logo_url: z.string().refine(isValidImageUrl, { message: "Invalid logo URL" }).min(1, "رابط الشعار مطلوب"),
  header_logo_scale: z.coerce.number().min(0.1).max(3.0).default(1.0),
  footer_logo_url: z.string().refine(isValidImageUrl, { message: "Invalid logo URL" }).min(1, "رابط الشعار مطلوب"),
  footer_logo_scale: z.coerce.number().min(0.1).max(3.0).default(1.0),
});

export const navigationOrderSchema = z.array(z.string().min(1).max(100));

export const contactMessageSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(100),
  email: z.string().email("بريد إلكتروني غير صالح").max(255),
  subject: z.string().min(2, "الموضوع مطلوب").max(200),
  message: z.string().min(10, "الرسالة قصيرة جداً").max(5000),
});

export const cvSchema = z.object({
  biography: z.array(z.string().max(5000)),
  positions: z.array(z.object({
    role: z.string().max(500),
    detail: z.string().max(2000),
  })),
});

export const aboutSchema = z.object({
  text: z.string().min(10, "النص يجب أن يكون 10 أحرف على الأقل").max(50000),
});
