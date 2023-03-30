'use client';
import { UserWithEmail } from '@/types/types';
import { deleteFile, downloadImage, updateAvatarUrl } from '@/utils/supabase-client';
import { Avatar as ChakraAvatar, AvatarBadge, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiUser, FiX } from 'react-icons/fi';

interface AvatarProps {
  avatarUrl?: string;
  user: UserWithEmail | null;
}

export default function Avatar({ user, avatarUrl }: AvatarProps) {
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (avatarUrl) {
      downloadAvatar(avatarUrl);
      return;
    }

    setSignedAvatarUrl(undefined);
  }, [avatarUrl]);

  async function onDeleteAvatar() {
    if (user && avatarUrl) {
      setSignedAvatarUrl(undefined);
      await deleteFile({ filePath: avatarUrl });
      await updateAvatarUrl(user, null);
    }
  }

  async function downloadAvatar(filePath: string) {
    const { error, data } = await downloadImage(filePath);
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
