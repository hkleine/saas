import { deleteFile, uploadFile } from '@/utils/supabase-client';
import { useUserStore } from '@/zustand/userStore';
import { FormLabel, Spinner } from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useState } from 'react';
import { v4 } from 'uuid';

interface FileUploadProps {
  uid: string;
  onUpload: (url: string) => void;
  children?: ReactNode;
}

export default function FileUpload({ uid, children, onUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const user = useUserStore((state) => state.user);

  if(!user) {
    return null;
  }

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    try {
      if (user.avatar_url) {
        const { error: deleteError } = await deleteFile({ filePath: user.avatar_url });
        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${v4()}-${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await uploadFile({ file, filePath });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <FormLabel
        cursor="pointer"
        color="teal.600"
        paddingX="0.75rem"
        paddingY="0.35rem"
        border="1px solid"
        borderColor="currentcolor"
        htmlFor="single"
        borderRadius="md"
        width="full"
        display="inline-flex"
        justifyContent="center"
        _hover={{ bg: 'teal.50' }}
        _disabled={{ pointerEvents: 'none' }}
      >
        {isUploading ? <Spinner size="sm" /> : children}
      </FormLabel>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={isUploading}
      />
    </>
  );
}
