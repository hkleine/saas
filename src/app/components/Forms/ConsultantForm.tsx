'use client';
import { supabase } from '@/utils/supabase-client';
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
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../Forms/FormError';

export default function ConsultantForm() {
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
    toast({
      title: 'Account created.',
      description: 'Please check your E-Mail inbox to verify your address.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    setIsSubmitting(false);
  });

  return (
    <Box>
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
            <FormLabel>E-Mail Adresse</FormLabel>
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
            <FormLabel>Berater Name</FormLabel>
            <Input
              type="text"
              {...register('name', { required: { value: true, message: 'Berater name wird benötigt.' } })}
            />
            {errors.name && <FormError>{errors.name?.message?.toString()}</FormError>}
          </FormControl>
          <FormControl id="password" isInvalid={'password' in errors} isRequired>
            <FormLabel>Passwort</FormLabel>
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
            <FormLabel>Passwort wiederholen</FormLabel>
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
          <FormControl id="percent" isInvalid={'percent' in errors}>
            <FormLabel>Umsatzbeteiligung</FormLabel>

            <NumberInput defaultValue={0}>
              <NumberInputField min={0} max={100} {...register('percent')} />
            </NumberInput>
            {errors.percent && <FormError>{errors.percent?.message?.toString()}</FormError>}
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
  );
}
