'use client';
import { ConsultantWithCurrentEarning, Roles } from '@/types/types';
import { useConsultantActionRights } from '@/utils/hooks';
import {
	Card,
	Flex,
	Heading,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	Stat,
	StatArrow,
	StatHelpText,
	StatLabel,
	StatNumber,
	Tag,
	TagLabel,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { FiDollarSign, FiEdit2, FiEyeOff, FiMenu, FiPercent, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { Handle, Position } from 'reactflow';
import { Avatar } from '../../AppShell/Avatar';
import { ConsultantMenuContext } from '../../Provider/ConsultantMenuProvider';
import { RealTimeUserContext } from '../../Provider/RealTimeUserProvider';
import { AddConsultantModal } from '../Modals/AddConsultantModal';
import { AdjustEarningModal } from '../Modals/AdjustEarningModal';
import { DeletionModal } from '../Modals/DeletionModal';
import { UpdateConsultantModal } from '../Modals/UpdateConsultantModal';
import { calculateDownlineEarnings } from './calculateDownlineEarnings';
import { calculateUplineLevy } from './calculateUplineLevy';

export function ConsultantCard({
	data: { consultant, otherConsultants, roles },
}: {
	data: {
		otherConsultants: Array<ConsultantWithCurrentEarning>;
		consultant: ConsultantWithCurrentEarning;
		roles: Roles;
	};
}) {
	const { setCloseMenuCallback, closeMenuCallback } = useContext(ConsultantMenuContext);
	const user = useContext(RealTimeUserContext);
	const { onOpen: onMenuOpen, isOpen: isMenuOpen, onClose: onMenuClose } = useDisclosure();
	const { onOpen: onDeletionOpen, isOpen: isDeletionOpen, onClose: onDeleteionClose } = useDisclosure();
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();
	const { onOpen: onOpenAddConsultant, isOpen: isAddConsultantOpen, onClose: onCloseAddConsultant } = useDisclosure();
	const {
		onOpen: onOpenUpdateConsultant,
		isOpen: isUpdateConsultantOpen,
		onClose: onCloseUpdateConsultant,
	} = useDisclosure();

	const downlineEarnings = useMemo(
		() => calculateDownlineEarnings({ otherConsultants, consultant }),
		[otherConsultants, consultant],
	);

	const uplineLevy = calculateUplineLevy({ consultant });

	const { isConsultantDeletable, isUpdateDisabled, isUserAllowedToAddConsultant } = useConsultantActionRights({
		consultant,
		otherConsultants,
		user,
	});

	if (!user) {
		return null;
	}

	const isConsultantCardFromCurrentUser = user.id === consultant.id;

	return (
		<Card
			border={isConsultantCardFromCurrentUser ? '1px' : undefined}
			borderColor="purple.500"
			position="relative"
			width={400}
			p={6}
			boxShadow={isConsultantCardFromCurrentUser ? 'xl' : 'lg'}
			rounded={'lg'}>
			<Stack spacing={0} mb={5}>
				<Handle
					isConnectableStart={false}
					style={{
						background: 'var(--chakra-colors-gray-500)',
						width: '14px',
						height: '14px',
						border: '3px solid white',
					}}
					type="source"
					position={Position.Bottom}
				/>
				{consultant.upline && (
					<Handle
						style={{
							background: 'var(--chakra-colors-gray-500)',
							width: '14px',
							height: '14px',
							border: '3px solid white',
						}}
						type="target"
						position={Position.Top}
					/>
				)}
				<HStack>
					<Avatar avatarUrl={consultant.avatar_url} name={consultant.name} size="md" ml={-1} mr={2} />
					<Flex w="full" direction="column">
						<HStack justify="space-between">
							<Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
								{consultant.name}
							</Heading>
							<Menu
								isOpen={isMenuOpen}
								onOpen={() => {
									if (closeMenuCallback) {
										closeMenuCallback();
									}
									setCloseMenuCallback(() => onMenuClose);
									onMenuOpen();
								}}
								onClose={onMenuClose}
								isLazy
								closeOnBlur>
								<MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
									{isMenuOpen ? <FiX /> : <FiMenu />}
								</MenuButton>
								<MenuList paddingX={4} bg="white" borderColor="gray.100" boxShadow="lg">
									<MenuItem onClick={onOpenAddConsultant} isDisabled={!isUserAllowedToAddConsultant} icon={<FiPlus />}>
										Downline hinzufügen
									</MenuItem>
									<MenuItem onClick={onOpenAdjustEarning} isDisabled={isUpdateDisabled} icon={<FiDollarSign />}>
										Einnahmen bearbeiten
									</MenuItem>
									<MenuItem onClick={onOpenUpdateConsultant} isDisabled={isUpdateDisabled} icon={<FiEdit2 />}>
										Berater bearbeiten
									</MenuItem>
									<MenuItem onClick={onDeletionOpen} isDisabled={isConsultantDeletable} icon={<FiTrash />}>
										Berater löschen
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
						<Flex direction="row" gap="2">
							<Text mt="unset" color={'gray.500'}>
								{consultant.role.name}
							</Text>
							<Tag size="sm" colorScheme="cyan" borderRadius="full">
								<TagLabel mr={1}>{consultant.percent}</TagLabel>
								<FiPercent />
							</Tag>
						</Flex>
					</Flex>
				</HStack>
			</Stack>
			<HStack>
				<Stat>
					<StatLabel>Eigene Einnahmen</StatLabel>
					{consultant.currentEarning.concealed ? (
						<FiEyeOff />
					) : (
						<HStack>
							<StatNumber>{consultant.currentEarning.value.toFixed(2)}€</StatNumber>
							{uplineLevy > 0 ? (
								<StatHelpText>
									<StatArrow type="decrease" />
									{((consultant.currentEarning.value / 100) * (100 - consultant.percent)).toFixed(2)}
								</StatHelpText>
							) : null}
						</HStack>
					)}
				</Stat>
				{downlineEarnings > 0 ? (
					<Stat>
						<StatLabel>Downline Einnahmen</StatLabel>
						{consultant.currentEarning.concealed ? (
							<FiEyeOff />
						) : (
							<HStack>
								<StatNumber>{downlineEarnings.toFixed(2)}€</StatNumber>
							</HStack>
						)}
					</Stat>
				) : null}
			</HStack>
			<DeletionModal id={consultant.id} onClose={onDeleteionClose} isOpen={isDeletionOpen} />
			<AdjustEarningModal
				id={consultant.id}
				earning={consultant.currentEarning}
				onClose={onCloseAdjustEarning}
				isOpen={isAdjustEarningOpen}
			/>
			<UpdateConsultantModal
				isOpen={isUpdateConsultantOpen}
				consultant={consultant}
				onClose={onCloseUpdateConsultant}
			/>
			<AddConsultantModal
				uplineId={consultant.id}
				isOpen={isAddConsultantOpen}
				onClose={onCloseAddConsultant}
				roles={roles}
			/>
		</Card>
	);
}
