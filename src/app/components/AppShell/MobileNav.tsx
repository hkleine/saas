import { createSignedImageUrl } from '@/utils/supabase-client';
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { FiBell, FiChevronDown, FiMenu, FiUser } from 'react-icons/fi';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export function MobileNav({ onOpen, ...rest }: MobileProps) {
  const user = useContext(RealTimeUserContext);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | undefined>();

  const supabaseClient = useSupabaseClient();

  async function getAvatarSignedImageUrl(filePath: string) {
    const { error, data } = await createSignedImageUrl(filePath);
    if (error) {
      console.log(error);
      return;
    }
    setSignedAvatarUrl(data.signedUrl);
  }

  useEffect(() => {
    if (user && user.avatar_url) {
      getAvatarSignedImageUrl(user.avatar_url);
      return;
    }
    setSignedAvatarUrl(undefined);
  }, [user]);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <Flex alignItems={'center'}>
          <Menu isLazy>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  fontSize={18}
                  src={signedAvatarUrl}
                  bg="gray.400"
                  icon={<FiUser fontWeight="400" />}
                />
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">{user?.full_name ?? user?.email ?? ''}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              paddingX={4}
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.100', 'gray.700')}
              boxShadow="lg"
            >
              <MenuItem as={Link} href={'/dashboard/profile'}>
                Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={async () => {
                  await supabaseClient.auth.signOut();
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}
