'use client';
import { supabase } from '@/utils/supabase-client';
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSucces] = useState(false);

  const onReset = async () => {
    setIsLoading(true);
    setIsError(false);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setIsError(true);
    }
    setIsLoading(false);
    setIsSucces(true);
  };

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'2xl'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Forgot your password?
        </Heading>
        <Text fontSize={{ base: 'sm', sm: 'md' }} color={useColorModeValue('gray.800', 'gray.400')}>
          You&apos;ll get an email with a reset link
        </Text>
        {isSuccess && (
          <Alert status="success">
            <AlertIcon />
            Reset E-Mail has been sent!
          </Alert>
        )}

        {isError && (
          <Alert status="error">
            <AlertIcon />
            Something went wrong please try again later.
          </Alert>
        )}
        <FormControl id="email">
          <Input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <Flex gap={12}>
          <Button variant="outline" as={Link} href="/login">
            Cancel
          </Button>
          <Button w="full" onClick={onReset} isLoading={isLoading}>
            Request Reset
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
}
