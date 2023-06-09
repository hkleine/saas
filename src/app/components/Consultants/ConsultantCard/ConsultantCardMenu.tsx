'use client';
import { ConsultantWithCurrentEarning, Roles } from '@/types/types';
import { useConsultantActionRights } from '@/utils/hooks';
import { Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { FiDollarSign, FiEdit2, FiMenu, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { ConsultantMenuContext } from '../../Provider/ConsultantMenuProvider';
import { RealTimeUserContext } from '../../Provider/RealTimeUserProvider';
import { AddConsultantModal } from '../Modals/AddConsultantModal';
import { AdjustEarningModal } from '../Modals/AdjustEarningModal';
import { DeletionModal } from '../Modals/DeletionModal';
import { UpdateConsultantModal } from '../Modals/UpdateConsultantModal';

interface ConsultantCardMenuProps {
	consultant: ConsultantWithCurrentEarning;
	otherConsultants: Array<ConsultantWithCurrentEarning>;
	roles: Roles;
}

export function ConsultantCardMenu({ consultant, otherConsultants, roles }: ConsultantCardMenuProps) {
	const user = useContext(RealTimeUserContext);

	const { setCloseMenuCallback, closeMenuCallback } = useContext(ConsultantMenuContext);
	const { onOpen: onMenuOpen, isOpen: isMenuOpen, onClose: onMenuClose } = useDisclosure();
	const { onOpen: onDeletionOpen, isOpen: isDeletionOpen, onClose: onDeleteionClose } = useDisclosure();
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();
	const { onOpen: onOpenAddConsultant, isOpen: isAddConsultantOpen, onClose: onCloseAddConsultant } = useDisclosure();
	const {
		onOpen: onOpenUpdateConsultant,
		isOpen: isUpdateConsultantOpen,
		onClose: onCloseUpdateConsultant,
	} = useDisclosure();

	const { isConsultantDeletable, isUpdateDisabled, isUserAllowedToAddConsultant } = useConsultantActionRights({
		consultant,
		otherConsultants,
		user,
	});

	return (
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
		</Menu>
	);
}
