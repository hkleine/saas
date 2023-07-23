'use client';
import { Item } from '@/types/types';
import { deleteItem } from '@/utils/supabase-client';
import { Card, Flex, IconButton, Tag, useDisclosure } from '@chakra-ui/react';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { CustomTable } from '../Atoms/Table';
import { AddItemModal, DeletionModal } from '../Modals';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';

export function ItemsTable() {
	const items = useGlobalStateContext((s) => s.items);

	const columnHelper = createColumnHelper<Item>();
	const columns = [
		columnHelper.accessor('name', {
			header: () => <>Name</>,
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id,
			size: 300,
		}),
		columnHelper.accessor((row) => row.equation, {
			id: 'equation',
			header: () => <span>Equation</span>,
			footer: (info) => info.column.id,
			size: 300,
		}),
		columnHelper.accessor('variables', {
			footer: (info) => info.column.id,
			cell: (info) => (
				<Flex direction="row" flexFlow="wrap" gap={2}>
					{Object.entries(info.getValue()).map(([symbol, object]) => {
						return (
							<Tag key={symbol} colorScheme="teal">
								{symbol}={object.name}
							</Tag>
						);
					})}
				</Flex>
			),
			size: 400,
		}),
		columnHelper.display({
			id: 'actions',
			size: 200,
			cell: (info) => <ActionCell info={info} />,
		}),
	];

	return (
		<Card mx={4} position="relative" boxShadow={'lg'} rounded={'lg'}>
			<CustomTable title="Produkte" data={items} columns={columns} />
		</Card>
	);
}

function ActionCell({ info }: { info: CellContext<Item, unknown> }) {
	const { onOpen: onDeletionOpen, isOpen: isDeletionOpen, onClose: onDeletionClose } = useDisclosure();
	const { onOpen: openUpdateModal, isOpen: isUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure();
	const user = useGlobalStateContext((s) => s.user);

	if (!user) {
		return null;
	}

	return (
		<Flex justifyContent="center">
			<IconButton
				isDisabled={user.role.id > 1}
				onClick={openUpdateModal}
				size="sm"
				variant="ghost"
				aria-label="edit product"
				icon={<FiEdit2 />}
			/>
			<IconButton
				isDisabled={user.role.id > 1}
				size="sm"
				variant="ghost"
				aria-label="delete product"
				icon={<FiTrash />}
				onClick={onDeletionOpen}
			/>
			<DeletionModal
				onClose={onDeletionClose}
				isOpen={isDeletionOpen}
				deleteCallback={async () => {
					await deleteItem(info.row.original.id);
				}}
				title="Produkt unwideruflich löschen?"
				successMessage="Produkt erfolgreich gelöscht."
				description="Diese Aktion ist unwirderuflich und löscht das Produkt."
			/>
			<AddItemModal isOpen={isUpdateModalOpen} onClose={onUpdateModalClose} item={info.row.original} />
		</Flex>
	);
}
