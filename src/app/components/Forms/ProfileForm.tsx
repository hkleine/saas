'use client';
import { updateAvatarUrl, updateUserName } from '@/utils/supabase-client';
import { Button, Center, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import Avatar from './Avatar';
import FileUpload from './FileUpload';
import FormError from './FormError';

export default function Profile() {
  const user = useContext(RealTimeUserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ mode: 'onBlur' });

  if (!user) {
    return <LoadingSpinner />;
  }

  const onUpload = async (url: string) => {
    await updateAvatarUrl(user, url);
  };

  const onSubmit = handleSubmit(async formData => {
    setIsSubmitting(true);
    const { error } = await updateUserName(user, formData.fullName);

    if (error) {
      toast({
        title: 'Failed to update.',
        description: 'Something went wrong while updating please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    toast({
      title: 'Successfully updated profile.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });

    setIsSubmitting(false);
  });

  return (
    <Stack spacing={4} w={'full'} maxW={'md'} bg="white" rounded={'xl'} boxShadow={'lg'} p={6}>
      <FormControl id="userName">
        <Stack direction={['column', 'row']} spacing={6}>
          <Center>
            <Avatar user={user} />
          </Center>
          <Center w="full">
            <FileUpload avatarUrl={user.avatar_url} uid={user.id} onUpload={onUpload}>
              Change Avatar
            </FileUpload>
          </Center>
        </Stack>
      </FormControl>
      <FormControl isInvalid={'email' in errors} isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          {...register('email', {
            required: { value: true, message: 'Email is required.' },
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid E-Mail address.' },
          })}
          defaultValue={user?.email ?? ''}
          id="email"
          placeholder="your-email@example.com"
          _placeholder={{ color: 'gray.500' }}
          type="email"
        />
        {errors.email && <FormError>{errors.email?.message?.toString()}</FormError>}
      </FormControl>
      <FormControl id="fullName">
        <FormLabel>Full name</FormLabel>
        <Input
          {...register('fullName')}
          defaultValue={user?.full_name ?? ''}
          id="email"
          placeholder="John Doe"
          _placeholder={{ color: 'gray.500' }}
          type="text"
        />
      </FormControl>
      <Button isLoading={isSubmitting} isDisabled={!isDirty} onClick={onSubmit} colorScheme="teal" w="full">
        Save
      </Button>
    </Stack>
  );
}
