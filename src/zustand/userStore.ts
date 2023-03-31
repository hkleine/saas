import { downloadImage } from '@/utils/supabase-client';
import { UserWithEmail } from '@/types/types'
import { getUser } from '@/utils/supabase-client';
import produce from 'immer';
import { create } from 'zustand'

interface UserState {
    user: UserWithEmail | null;
    signedAvatarUrl?: string;
}

type UserStateActions = {
    fetchInitialUserState: () => void
    updateUserName: (name: UserWithEmail['full_name']) => void;
    updateUserAvatar: (avatarUrl: string) => void;
    deleteUserAvatar: () => void;
}

export const useUserStore = create<UserState & UserStateActions>()((set) => ({
    user: null,
    signedAvatarUrl: undefined,
    updateUserName: async (name?: string) => {
        set(
            produce((state: UserState) => {
                state.user!.full_name = name;
            })
        )
    },
    updateUserAvatar: async (avatarUrl: string) => {
        const signedAvatarUrl = await downloadImage(avatarUrl) ?? undefined;
        set(
            produce((state: UserState) => {
                state.user!.avatar_url = avatarUrl;
                state.signedAvatarUrl = signedAvatarUrl;
            })
        )
    },
    deleteUserAvatar: async () => {
        set(
            produce((state: UserState) => {
                state.user!.avatar_url = undefined;
                state.signedAvatarUrl = undefined;
            })
        )
    },
    fetchInitialUserState: async () => {
        const user = await getUser();
        const signedAvatarUrl = await downloadImage(user?.avatar_url ?? '') ?? undefined;
        set({user, signedAvatarUrl});
    },
 }))