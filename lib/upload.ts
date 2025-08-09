import { getSupabaseClient } from './supabaseClient';
import { MAX_IMAGE_MB, MAX_VIDEO_MB } from './config';

const PHOTOS_BUCKET = 'complaints-photos';
const VIDEOS_BUCKET = 'complaints-videos';

function randomPath(prefix: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2);
  return `${prefix}/${ts}-${rand}.${ext}`;
}

export async function uploadImage(file: File) {
  // Enforce client-side size limit and compress
  const maxBytes = MAX_IMAGE_MB * 1024 * 1024;
  let toUpload: Blob | File = file;
  if (file.size > maxBytes) {
    // Try compressing image via canvas
    toUpload = await compressImage(file, { maxDimension: 1600, quality: 0.8 });
    if (toUpload.size > maxBytes) {
      throw new Error(`Image exceeds ${MAX_IMAGE_MB} MB even after compression`);
    }
  }
  const supabase = getSupabaseClient();
  const path = randomPath('photos', file);
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, toUpload, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/*',
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadVideo(file: File) {
  // Enforce client-side size limit (no compression for videos in client)
  const maxBytes = MAX_VIDEO_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Video exceeds ${MAX_VIDEO_MB} MB. Please choose a shorter/lower-resolution clip.`);
  }
  const supabase = getSupabaseClient();
  const path = randomPath('videos', file);
  const { error } = await supabase.storage.from(VIDEOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'video/*',
  });
  if (error) throw error;
  const { data } = supabase.storage.from(VIDEOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Utilities
async function compressImage(file: File, opts: { maxDimension: number; quality: number }): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file; // fallback if cannot decode
  const { width, height } = bitmap;
  const scale = Math.min(1, opts.maxDimension / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  const mime = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';
  const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || file), mime, opts.quality));
  try { bitmap.close(); } catch {}
  return blob;
}
