'use client';
import { ConsultantWithEarnings, Roles } from '@/types/types';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';
import { deleteData } from '@/utils/helpers';
import { useConsultantActionRights } from '@/utils/hooks';
import { Badge, Card, Flex, IconButton, Tag, TagLabel, useDisclosure } from '@chakra-ui/react';
import { CellContext, createColumnHelper, Row } from '@tanstack/react-table';
import { CSSProperties } from 'react';
import { FiDollarSign, FiEdit2, FiPercent, FiTrash } from 'react-icons/fi';
import { CustomTable } from '../Atoms/Table';
import { AdjustEarningModal, DeletionModal, UpdateConsultantModal } from '../Modals';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';

export default function ConsultantsTable({ roles }: { roles: Roles }) {
	const consultants = useGlobalStateContext((s) => s.consultants);
	const user = useGlobalStateContext((s) => s.user);

	const getRowStyles = (row: Row<ConsultantWithEarnings>): CSSProperties => {
		console.log(row.original, user);
		return {
			background: user?.id === row.original.id ? 'var(--chakra-colors-purple-50)' : 'transparent',
			borderLeft: user?.id === row.original.id ? '1px solid var(--chakra-colors-purple-500)' : 'unset',
		};
	};

	const columnHelper = createColumnHelper<ConsultantWithEarnings>();
	const columns = [
		columnHelper.accessor('name', {
			header: () => 'Name',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
			size: 300,
		}),
		columnHelper.accessor('email', {
			header: () => 'Email',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
			size: 300,
		}),
		columnHelper.accessor('role', {
			footer: (info) => info.column.id,
			cell: (info) => (
				<Badge size="xs" borderRadius="lg" px={2} py={0.5}>
					{info.getValue().name}
				</Badge>
			),
			size: 200,
		}),
		columnHelper.accessor('percent', {
			footer: (info) => info.column.id,
			cell: (info) => (
				<Tag size="sm" colorScheme="cyan" borderRadius="full">
					<TagLabel>{info.getValue()}</TagLabel>
					<FiPercent />
				</Tag>
			),
			size: 200,
		}),
		columnHelper.accessor((row) => row, {
			id: 'earnings',
			footer: (info) => info.column.id,
			cell: (info) => {
				const consultant = info.getValue();
				const { currentDate } = getCurrentAndPreviousMonth();
				const currentEarning = getCertainMonthRevenue({ consultant, date: currentDate });

				return <>{currentEarning.toFixed(2)}€</>;
			},
			size: 200,
		}),
		columnHelper.display({
			id: 'actions',
			size: 200,
			cell: (info) => <ActionCell roles={roles} consultants={consultants} info={info} />,
		}),
	];

	return (
		<Card mx={4} position="relative" boxShadow={'lg'} rounded={'lg'}>
			<CustomTable getRowStyles={getRowStyles} title="Berater" data={consultants} columns={columns} />
		</Card>
	);
}

function ActionCell({
	info,
	consultants,
	roles,
}: {
	info: CellContext<ConsultantWithEarnings, unknown>;
	consultants: Array<ConsultantWithEarnings>;
	roles: Roles;
}) {
	const consultant = info.row.original;
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
		otherConsultants: consultants,
		user,
	});

	return (
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
		</Flex>
	);
}
