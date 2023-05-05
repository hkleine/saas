import {
  Badge,
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
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useContext } from 'react';
import { FiBell, FiChevronDown, FiMenu } from 'react-icons/fi';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { Avatar } from './Avatar';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export function MobileNav({ onOpen, ...rest }: MobileProps) {
  const user = useContext(RealTimeUserContext);
  const supabaseClient = useSupabaseClient();

  if (!user) {
    return null;
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
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
                <Avatar size={'sm'} name={user.name ?? undefined} avatarUrl={user.avatar_url} />
                <HStack gap={2} display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">{user.name ?? user.email ?? ''}</Text>
                  <Badge size="xs" borderRadius="lg" px={2} py={0.5}>
                    {user.role.name}
                  </Badge>
                </HStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList paddingX={4} bg="white" borderColor="gray.100" boxShadow="lg">
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
