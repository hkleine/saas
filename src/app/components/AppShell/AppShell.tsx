'use client';
import { UserWithEmail } from '@/types/types';
import { getUser } from '@/utils/supabase-client';
import { Box, Drawer, DrawerContent, Flex, useDisclosure } from '@chakra-ui/react';
import '@fontsource/poppins';
import { ReactNode, useEffect, useState } from 'react';
import { RealTimeUserProvider } from '../Provider/RealTimeUserProvider';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<UserWithEmail | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      console.log(fetchedUser);
      setUser(fetchedUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <RealTimeUserProvider user={user}>
      <Box minH="100vh" bg="gray.100">
        <Sidebar onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
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
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <MobileNav onOpen={onOpen} />
        <Flex direction="column" ml={{ base: 0, md: 60 }} height="calc(100vh - 80px)" p="4">
          {children}
        </Flex>
      </Box>
    </RealTimeUserProvider>
  );
}
