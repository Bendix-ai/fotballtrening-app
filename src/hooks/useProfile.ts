import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores';
import * as profileService from '../services/profileService';

export function useUploadAvatar() {
    const { user, setAvatarUrl } = useAuthStore();

    return useMutation({
        mutationFn: (imageUri: string) =>
            profileService.uploadAvatar(user?.id ?? '', imageUri),
        onSuccess: (url) => {
            setAvatarUrl(url);
        },
    });
}
