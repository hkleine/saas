'use client';
import { UserWithEmail } from '@/types/types';
import { createSignedImageUrl } from '@/utils/supabase-client';
import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import '@fontsource/poppins';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FiBell, FiChevronDown, FiCreditCard, FiHome, FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { Logo } from './Logo';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/dashboard' },
  { name: 'Settings', icon: FiSettings, href: '/dashboard/settings' },
  { name: 'Billing', icon: FiCreditCard, href: '/dashboard/billing' },
];

export default function Sidebar({ children, user }: { children: ReactNode; user: UserWithEmail | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="gray.100">
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav user={user} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box my="12">
        {LinkItems.map(link => (
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  const path = usePathname();
  const isActive = path === href;
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'gray.100',
        }}
        background={isActive ? 'gray.100' : 'white'}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  user: UserWithEmail | null;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const user = useContext(RealTimeUserContext);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState<string | undefined>();
  const router = useRouter();

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
          <Menu>
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
                  <Text fontSize="sm">{user?.email}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem onClick={() => router.push('/dashboard/profile')}>Profile</MenuItem>
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
};
