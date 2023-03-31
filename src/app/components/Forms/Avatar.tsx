'use client';
import { UserWithEmail } from '@/types/types';
import { deleteFile, updateAvatarUrl } from '@/utils/supabase-client';
import { useUserStore } from '@/zustand/userStore';
import { Avatar as ChakraAvatar, AvatarBadge, IconButton } from '@chakra-ui/react';
import { FiUser, FiX } from 'react-icons/fi';

interface AvatarProps {
  user: UserWithEmail | null;
}

export default function Avatar({ user }: AvatarProps) {
  const signedAvatarUrl = useUserStore((state) => state.signedAvatarUrl);
  const deleteUserAvatar = useUserStore((state) => state.deleteUserAvatar);

  async function onDeleteAvatar() {
    if (user && user.avatar_url) {
      console.log("hi", user)
      await deleteFile({ filePath: user.avatar_url });
      await updateAvatarUrl(user, null);
      deleteUserAvatar();
    }
  }

  return (
    <ChakraAvatar
      size="xl"
      fontSize={48}
      src={signedAvatarUrl}
      bg="gray.400"
      icon={<FiUser fontSize="2.7rem" fontWeight="400" />}
    >
      {signedAvatarUrl && (
        <AvatarBadge
          as={IconButton}
          size="sm"
          rounded="full"
          top="-10px"
          colorScheme="red"
          aria-label="remove Image"
          onClick={onDeleteAvatar}
          icon={<FiX />}
        />
      )}
    </ChakraAvatar>
  );
}
