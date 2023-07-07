'use client';
import { ConsultantWithEarnings, Roles } from '@/types/types';
import { deleteData } from '@/utils/helpers';
import { useConsultantActionRights } from '@/utils/hooks';
import { Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { useContext } from 'react';
import { FiDollarSign, FiEdit2, FiMenu, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { AddConsultantModal, AdjustEarningModal, DeletionModal, UpdateConsultantModal } from '../../Modals';
import { ConsultantMenuContext } from '../../Provider/ConsultantMenuProvider';
import { RealTimeUserContext } from '../../Provider/RealTimeUserProvider';

interface ConsultantCardMenuProps {
	consultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
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
					Umsatz bearbeiten
				</MenuItem>
				<MenuItem onClick={onOpenUpdateConsultant} isDisabled={isUpdateDisabled} icon={<FiEdit2 />}>
					Berater bearbeiten
				</MenuItem>
				<MenuItem onClick={onDeletionOpen} isDisabled={isConsultantDeletable} icon={<FiTrash />}>
					Berater löschen
				</MenuItem>
			</MenuList>
			<DeletionModal
				onClose={onDeleteionClose}
				isOpen={isDeletionOpen}
				deleteCallback={async () => {
					await deleteData({
						url: `/api/delete-user/${consultant.id}`,
					});
				}}
				title="Berater unwideruflich löschen?"
				successMessage="Berater erfolgreich gelöscht."
				description="Diese Aktion ist unwirderuflich und löscht den Account des Beraters."
			/>
			<AdjustEarningModal consultant={consultant} onClose={onCloseAdjustEarning} isOpen={isAdjustEarningOpen} />
			<UpdateConsultantModal
				isOpen={isUpdateConsultantOpen}
				consultant={consultant}
				onClose={onCloseUpdateConsultant}
				roles={roles}
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
