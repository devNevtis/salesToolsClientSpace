// src/lib/supabase/uploadToSupabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadVideoToSupabase(file, filename) {
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(filename, file, {
      contentType: 'video/mp4',
      upsert: true,
      returning: 'minimal',
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('videos')
    .getPublicUrl(filename);
  return publicUrlData.publicUrl;
}
