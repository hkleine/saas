'use client';
import { UserWithEmail } from '@/types/types';
import { createSignedImageUrl, deleteFile, updateAvatarUrl } from '@/utils/supabase-client';
import { Avatar as ChakraAvatar, AvatarBadge, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiUser, FiX } from 'react-icons/fi';

interface AvatarProps {
  user: UserWithEmail;
}

export default function EditAvatar({ user }: AvatarProps) {
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (user.avatar_url) {
      getAvatarSignedImageUrl(user.avatar_url);
      return;
    }

    setSignedAvatarUrl(undefined);
  }, [user]);

  async function onDeleteAvatar() {
    if (user && user.avatar_url) {
      setSignedAvatarUrl(undefined);
      await deleteFile({ filePath: user.avatar_url });
      await updateAvatarUrl(user, null);
    }
  }

  async function getAvatarSignedImageUrl(filePath: string) {
    const { error, data } = await createSignedImageUrl(filePath);
    if (error) {
      console.log(error);
      return;
    }
    setSignedAvatarUrl(data.signedUrl);
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
