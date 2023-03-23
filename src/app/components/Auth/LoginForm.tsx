'use client';
import { supabase } from '@/utils/supabase-client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../Forms/FormError';
import { Logo } from '../Sidebar/Logo';
import { OAuthButtonGroup } from './OAuthButtonGroup';
import { PasswordField } from './PasswordField';
import styles from './auth.module.css';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const user = useUser();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onLogin = handleSubmit(async formData => {
    setIsLoading(true);
    setLoginFailed(false);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setLoginFailed(true);
    }

    setIsLoading(false);
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }} className={styles["signup-form"]}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Dont have an account?</Text>
              <Link href="/signup">Sign up</Link>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg-surface' }}
          boxShadow={{ base: 'none', sm: '2xl' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing="6">
            {loginFailed && (
              <Alert mb="2" rounded={'lg'} status="error" fontSize="sm">
                <AlertIcon />
                <AlertDescription>Either the entered E-Mail or Password is wrong.</AlertDescription>
              </Alert>
            )}
            <Stack spacing="5">
              <FormControl isRequired isInvalid={'email' in errors}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: { value: true, message: 'Email is required.' },
                  })}
                />
                {errors.email && <FormError>{errors.email?.message?.toString()}</FormError>}
              </FormControl>
              <FormControl isRequired isInvalid={'password' in errors}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <PasswordField
                  {...register('password', {
                    required: { value: true, message: 'Password is required.' },
                  })}
                />
                {errors.password && <FormError>{errors.password?.message?.toString()}</FormError>}
              </FormControl>
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Link href="/forgot-password">Forgot password?</Link>
            </HStack>
            <Stack spacing="6">
              <Button colorScheme="teal" onClick={onLogin} isLoading={isLoading}>
                Sign in
              </Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
