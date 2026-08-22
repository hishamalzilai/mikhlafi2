"use server";

import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import {
  IMAGE_MIME_TYPES,
  DOCUMENT_MIME_TYPES,
  VIDEO_MIME_TYPES,
  validateFileMagicBytes,
} from '@/lib/file-validation';

// Allowed file extensions and MIME types
const ALLOWED_TYPES: Record<string, string[]> = {
  image: [...IMAGE_MIME_TYPES],
  video: [...VIDEO_MIME_TYPES, 'video/ogg', 'video/quicktime'],
  document: [...DOCUMENT_MIME_TYPES, 'application/msword'],
};

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'ogg', 'mov', 'pdf', 'doc', 'docx'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAGIC_BYTES_SAMPLE_SIZE = 12;

// Allowed storage bucket names
const ALLOWED_BUCKETS = ['media', 'archive-media'];

function sanitizeFileName(name: string): string {
  // Remove path traversal attempts and dangerous characters
  return name
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    .replace(/[^a-zA-Z0-9._\-\u0600-\u06FF]/g, '_');
}

export async function uploadMediaAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  try {
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || 'uploads';
    const bucket = formData.get('bucket') as string || 'media';

    if (!file) throw new Error("No file uploaded");

    // Validate bucket name against allowlist
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return { success: false, error: `Bucket غير مسموح: ${bucket}` };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `حجم الملف يتجاوز الحد الأقصى (${MAX_FILE_SIZE / 1024 / 1024}MB)` };
    }

    // Validate file extension
    const originalName = file.name || 'image.png';
    const fileExt = (originalName.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return { success: false, error: `نوع الملف غير مسموح: .${fileExt}` };
    }

    // Validate MIME type
    const allowedMimeTypes = Object.values(ALLOWED_TYPES).flat();
    const isValidMime = allowedMimeTypes.includes(file.type);
    if (!isValidMime) {
      return { success: false, error: `نوع MIME غير مسموح: ${file.type}` };
    }

    // Validate actual file content (magic bytes) to prevent extension/MIME spoofing
    const fileHead = await file.slice(0, MAGIC_BYTES_SAMPLE_SIZE).arrayBuffer();
    if (!validateFileMagicBytes(fileHead, allowedMimeTypes)) {
      return { success: false, error: 'محتوى الملف لا يطابق النوع المعلن. رفع مرفوض.' };
    }

    // Sanitize the upload path to prevent path traversal
    const sanitizedPath = path.replace(/\.\./g, '').replace(/^\/+/, '');

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${sanitizedPath}/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { 
      success: true, 
      url: publicUrlData.publicUrl,
      fileName: fileName
    };
  } catch (err: any) {
    console.error("[UploadAction] Error:", err);
    return { success: false, error: err.message };
  }
}
