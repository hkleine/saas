'use client';
import { UserWithEmail } from '@/types/types';
import {
  Avatar,
  AvatarBadge,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FiUser, FiX } from 'react-icons/fi';
import FormError from './FormError';

export default function Profile({ user }: { user: UserWithEmail | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur', defaultValues: { fullName: user?.full_name, email: user?.email } });

  if (!user) {
    return null;
  }

  return (
    <Stack
      spacing={4}
      w={'full'}
      maxW={'md'}
      bg={useColorModeValue('white', 'gray.700')}
      rounded={'xl'}
      boxShadow={'lg'}
      p={6}
    >
      <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
        User Profile
      </Heading>
      <FormControl id="userName">
        <Stack direction={['column', 'row']} spacing={6}>
          <Center>
            <Avatar size="xl" fontSize={48} icon={<FiUser />}>
              <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                top="-10px"
                colorScheme="red"
                aria-label="remove Image"
                icon={<FiX />}
              />
            </Avatar>
          </Center>
          <Center w="full">
            <Button variant="outline" colorScheme="teal" w="full">
              Change Icon
            </Button>
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
      <Stack spacing={6} direction={['column', 'row']}>
        <Button colorScheme="teal" w="full">
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
