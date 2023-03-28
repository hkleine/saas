import { uploadFile } from '@/utils/supabase-client';
import { FormLabel } from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useState } from 'react';

interface FileUploadProps {
  uid: string;
  onUpload: (url: string) => void;
  children?: ReactNode;
}

export default function FileUpload({ uid, children, onUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid}.${fileExt}`;
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
      >
        {children}
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
