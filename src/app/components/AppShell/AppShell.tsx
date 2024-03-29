'use client';
import { Box, Drawer, DrawerContent, Flex, useDisclosure } from '@chakra-ui/react';
import '@fontsource/poppins';
import { ReactNode } from 'react';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box minH="100vh" bg="gray.100">
			<Sidebar onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full">
				<DrawerContent>
					<Sidebar onClose={onClose} />
				</DrawerContent>
			</Drawer>
			<MobileNav onOpen={onOpen} />
			<Flex direction="column" ml={{ base: 0, md: 60 }} height="calc(100vh - 80px)">
				{children}
			</Flex>
		</Box>
	);
}
