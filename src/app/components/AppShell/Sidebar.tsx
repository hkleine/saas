import { isUserAllowed } from '@/utils/isUserAllowed';
import { Box, BoxProps, CloseButton, Flex } from '@chakra-ui/react';
import { isUndefined } from 'lodash';
import { IconType } from 'react-icons';
import { FiCreditCard, FiFile, FiHome, FiUsers } from 'react-icons/fi';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';
import { Logo } from './Logo';
import { NavItem } from './NavItem';

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

interface LinkItemProps {
	name: string;
	icon: IconType;
	href: string;
	minimalRoleRequired?: number;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: 'Home', icon: FiHome, href: '/dashboard' },
	{ name: 'Berater', icon: FiUsers, href: '/dashboard/consultants' },
	{ name: 'Produkte', icon: FiFile, href: '/dashboard/products', minimalRoleRequired: 1 },
	{ name: 'Abonnement', icon: FiCreditCard, href: '/dashboard/billing', minimalRoleRequired: 0 },
];

export function Sidebar({ onClose, ...rest }: SidebarProps) {
	const user = useGlobalStateContext((s) => s.user);

	if (!user) {
		return null;
	}

	return (
		<Box
			transition="3s ease"
			bg="white"
			borderRight="1px"
			borderRightColor="gray.200"
			w={{ base: 'full', md: 60 }}
			pos="fixed"
			h="full"
			{...rest}>
			<Flex h="20" alignItems="center" mt="2" mx="6" justifyContent="space-between">
				<Logo />
				<CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
			</Flex>
			<Box my="12">
				{LinkItems.map((link) => {
					return (
						<span key={link.name}>
							{isUndefined(link.minimalRoleRequired) ||
							isUserAllowed({ user, minimalRoleRequired: link.minimalRoleRequired }) ? (
								<NavItem icon={link.icon} href={link.href}>
									{link.name}
								</NavItem>
							) : null}
						</span>
					);
				})}
			</Box>
		</Box>
	);
}
