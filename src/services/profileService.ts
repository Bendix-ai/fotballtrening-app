import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function uploadAvatar(userId: string, imageUri: string): Promise<string> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    // Read the image as a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { upsert: true, contentType: `image/${fileExt}` });

    if (uploadError) {
        console.error('uploadAvatar error:', uploadError);
        throw new Error(uploadError.message);
    }

    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Add cache buster to force refresh
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // Update profile with avatar URL
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

    if (updateError) {
        console.error('updateAvatarUrl error:', updateError);
        throw new Error(updateError.message);
    }

    return publicUrl;
}
