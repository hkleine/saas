'use client';
import { ConsultantWithEarnings, Roles } from '@/types/types';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';
import { deleteData } from '@/utils/helpers';
import { useConsultantActionRights } from '@/utils/hooks';
import {
	Card,
	Center,
	Flex,
	IconButton,
	Table,
	Tag,
	TagLabel,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { FiDollarSign, FiEdit2, FiEyeOff, FiPercent, FiTrash } from 'react-icons/fi';
import { AdjustEarningModal, DeletionModal, UpdateConsultantModal } from '../Modals';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';

export default function ConsultantsTable({ roles }: { roles: Roles }) {
	const consultants = useGlobalStateContext((s) => s.consultants);

	const sortedConsultants = consultants.sort((a, b) => {
		if (a.role.id < b.role.id) return -1;
		if (a.role.id > b.role.id) return 1;
		return 0;
	});

	return (
		<Card mx={4} position="relative" boxShadow={'lg'} rounded={'lg'}>
			<Table variant="simple" colorScheme="primary">
				<Thead bg="purple.50">
					<Tr>
						<Th>Name</Th>
						<Th>Email</Th>
						<Th>Rolle</Th>
						<Th width="50px">Umsatzbeteiligung</Th>
						<Th isNumeric>Umsatz</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>
					{sortedConsultants.map((consultant) => {
						return (
							<ConsultantRow
								key={consultant.id}
								roles={roles}
								consultant={consultant}
								otherConsultants={sortedConsultants}
							/>
						);
					})}
				</Tbody>
			</Table>
		</Card>
	);
}

function ConsultantRow({
	otherConsultants,
	consultant,
	roles,
}: {
	consultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
	roles: Roles;
}) {
	const user = useGlobalStateContext((s) => s.user);
	const { onOpen: onDeletionOpen, isOpen: isDeletionOpen, onClose: onDeleteionClose } = useDisclosure();
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();
	const {
		onOpen: onOpenUpdateConsultant,
		isOpen: isUpdateConsultantOpen,
		onClose: onCloseUpdateConsultant,
	} = useDisclosure();

	const { isConsultantDeletable, isUpdateDisabled } = useConsultantActionRights({
		consultant,
		otherConsultants,
		user,
	});

	if (!user) {
		return null;
	}

	const isConsultantCardFromCurrentUser = user.id === consultant.id;
	const { currentDate } = getCurrentAndPreviousMonth();

	const currentEarning = getCertainMonthRevenue({ consultant, date: currentDate });
	return (
		<Tr
			bg={isConsultantCardFromCurrentUser ? 'purple.50' : 'white'}
			border={isConsultantCardFromCurrentUser ? '1px' : undefined}
			borderColor="purple.500">
			<Td>{consultant.name}</Td>
			<Td>{}</Td>
			<Td>{consultant.role.name}</Td>
			<Td>
				<Center>
					<Tag size="sm" colorScheme="cyan" borderRadius="full">
						<TagLabel>{consultant.percent}</TagLabel>
						<FiPercent />
					</Tag>
				</Center>
			</Td>
			{consultant.concealed ? (
				<Td>
					<Center>
						<FiEyeOff />
					</Center>
				</Td>
			) : (
				<Td isNumeric>{currentEarning.toFixed(2)}€</Td>
			)}
			<Td>
				<Flex direction="row" justifyContent="center">
					<IconButton
						isDisabled={isUpdateDisabled}
						onClick={onOpenAdjustEarning}
						size="sm"
						variant="ghost"
						aria-label="edit consultants earnings"
						icon={<FiDollarSign />}
					/>
					<IconButton
						isDisabled={isUpdateDisabled}
						onClick={onOpenUpdateConsultant}
						size="sm"
						variant="ghost"
						aria-label="edit consultant"
						icon={<FiEdit2 />}
					/>
					<IconButton
						isDisabled={isConsultantDeletable}
						size="sm"
						variant="ghost"
						aria-label="delete consultant"
						icon={<FiTrash />}
						onClick={onDeletionOpen}
					/>
				</Flex>
			</Td>
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
		</Tr>
	);
}
