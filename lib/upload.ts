import { supabase } from './supabaseClient';

const PHOTOS_BUCKET = 'complaints-photos';
const VIDEOS_BUCKET = 'complaints-videos';

function randomPath(prefix: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2);
  return `${prefix}/${ts}-${rand}.${ext}`;
}

export async function uploadImage(file: File) {
  const path = randomPath('photos', file);
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/*',
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadVideo(file: File) {
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
