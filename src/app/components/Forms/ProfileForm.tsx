'use client';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';

export default function Profile(): JSX.Element {
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
        User Profile Edit
      </Heading>
      <FormControl id="userName">
        <Stack direction={['column', 'row']} spacing={6}>
          <Center>
            <Avatar size="xl" src="https://bit.ly/sage-adebayo">
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
            <Button w="full">Change Icon</Button>
          </Center>
        </Stack>
      </FormControl>
      <FormControl id="userName" isRequired>
        <FormLabel>User name</FormLabel>
        <Input placeholder="UserName" _placeholder={{ color: 'gray.500' }} type="text" />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input placeholder="your-email@example.com" _placeholder={{ color: 'gray.500' }} type="email" />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input placeholder="password" _placeholder={{ color: 'gray.500' }} type="password" />
      </FormControl>
      <Stack spacing={6} direction={['column', 'row']}>
        <Button colorScheme="teal" w="full">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}
