'use client';
import { createToastSettings } from '@/utils/createToastSettings';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../Forms/FormError';

export default function SimpleCard() {
  const supabase = useSupabaseClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const router = useRouter();
  const toast = useToast();

  const onSubmit = handleSubmit(async formData => {
    setIsSubmitting(true);
    setSignupError(false);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: 0,
          percent: 100,
          upline: null,
        },
      },
    });

    if (error) {
      console.log(error);
      setSignupError(true);
      setIsSubmitting(false);
      return;
    }

    router.push('/login');
    toast(createToastSettings({ title: 'Company Account erfolgreich erstellt.', status: 'success' }));

    setIsSubmitting(false);
  });

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Register your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            And start your journey ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={{ base: 'none', sm: '2xl' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          p={8}
        >
          {signupError && (
            <Alert mb="2" rounded={'lg'} status="error">
              <AlertIcon />
              <AlertTitle>Failed to sign up!</AlertTitle>
              <AlertDescription>Please try again later.</AlertDescription>
            </Alert>
          )}
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={'email' in errors} isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register('email', {
                    required: { value: true, message: 'Email is required.' },
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid E-Mail address.' },
                  })}
                />
                {errors.email && <FormError>{errors.email?.message?.toString()}</FormError>}
              </FormControl>
              <FormControl id="name" isInvalid={'name' in errors} isRequired>
                <FormLabel>Company name</FormLabel>
                <Input
                  type="text"
                  {...register('name', { required: { value: true, message: 'Company name is required.' } })}
                />
                {errors.name && <FormError>{errors.name?.message?.toString()}</FormError>}
              </FormControl>
              <FormControl id="password" isInvalid={'password' in errors} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register('password', {
                    required: { value: true, message: 'Password is required.' },
                    minLength: { value: 8, message: 'Password must consist of at least 8 characters.' },
                  })}
                />
                {errors.password && <FormError>{errors.password?.message?.toString()}</FormError>}
              </FormControl>
              <FormControl id="confirmPassword" isInvalid={'confirmPassword' in errors} isRequired>
                <FormLabel>Confirm password</FormLabel>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    required: { value: true, message: 'Confirmed password is required.' },
                    validate: (val: string) => {
                      if (watch('password') != val) {
                        return 'Your passwords do not match.';
                      }
                    },
                  })}
                />
                {errors.confirmPassword && <FormError>{errors.confirmPassword?.message?.toString()}</FormError>}
              </FormControl>
              <Flex gap={12}>
                <Button variant="outline" disabled={isSubmitting} as={Link} href="/login">
                  Cancel
                </Button>
                <Button type="submit" w="full" isLoading={isSubmitting}>
                  Sign Up
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
