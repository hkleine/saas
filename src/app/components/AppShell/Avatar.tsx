'use client';
import { createSignedImageUrl } from '@/utils/supabase-client';
import { Avatar as ChakraAvatar, AvatarProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function Avatar({ avatarUrl, ...otherProps }: { avatarUrl?: string | null } & Omit<AvatarProps, 'src'>) {
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | undefined>();

  async function getAvatarSignedImageUrl(filePath: string) {
    const { error, data } = await createSignedImageUrl(filePath);
    if (error) {
      console.log(error);
      return;
    }
    setSignedAvatarUrl(data.signedUrl);
  }

  useEffect(() => {
    if (avatarUrl) {
      getAvatarSignedImageUrl(avatarUrl);
      return;
    }
    setSignedAvatarUrl(undefined);
  }, [avatarUrl]);

  return <ChakraAvatar bg="purple.500" color="white" src={signedAvatarUrl} {...otherProps} />;
}
