'use client';
import { UserWithEmail } from '@/types/types';
import { updateAvatarUrl, updateUserName } from '@/utils/supabase-client';
import { Button, Center, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FileUpload from './FileUpload';
import FormError from './FormError';

interface ProfileProps {
  user: UserWithEmail | null;
  avatar: string | null;
}

export default function Profile({ user, avatar }: ProfileProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ mode: 'onBlur', defaultValues: { fullName: user?.full_name ?? '', email: user?.email ?? '' } });

  if (!user) {
    return null;
  }

  const onSubmit = handleSubmit(async formData => {
    setIsSubmitting(true);
    const { error } = await updateUserName(user, formData.fullName);
    if (error) {
      toast({
        title: 'Failed to update.',
        description: 'Something went wront while updating please try again later.',
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
            {/* <Avatar size="xl" fontSize={48} src={avatar ?? ''}>
              <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                top="-10px"
                colorScheme="red"
                aria-label="remove Image"
                icon={<FiX />}
              />
            </Avatar> */}
            <img src={avatar!} />
          </Center>
          <Center w="full">
            <FileUpload
              uid={user.id}
              onUpload={url => {
                console.log(url);
                updateAvatarUrl(user, url);
              }}
            >
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
