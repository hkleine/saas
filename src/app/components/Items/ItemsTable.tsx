'use client';
import { Item, UserWithEmail } from '@/types/types';
import { deleteItem } from '@/utils/supabase-client';
import { Card, Flex, IconButton, Table, Tag, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { AddItemModal, DeletionModal } from '../Modals';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';

export function ItemsTable() {
	const items = useGlobalStateContext((s) => s.items);
	const user = useGlobalStateContext((s) => s.user);

	if (!user) {
		return null;
	}

	return (
		<Card mx={4} position="relative" boxShadow={'lg'} rounded={'lg'}>
			<Table variant="simple" colorScheme="primary">
				<Thead bg="purple.50">
					<Tr>
						<Th>Name</Th>
						<Th>Formel</Th>
						<Th>Variablen</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>
					{(items ?? []).map((item) => {
						return <ItemsRow key={item.id} item={item} user={user} />;
					})}
				</Tbody>
			</Table>
		</Card>
	);
}

function ItemsRow({ item, user, ...otherProps }: { item: Item; user: UserWithEmail }) {
	const { onOpen: onDeletionOpen, isOpen: isDeletionOpen, onClose: onDeletionClose } = useDisclosure();
	const { onOpen: openUpdateModal, isOpen: isUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure();
	return (
		<Tr bg={'white'} {...otherProps}>
			<Td width="20%" fontWeight={600}>
				{item.name}
			</Td>
			<Td width="20%">{item.equation}</Td>
			<Td>
				<Flex direction="row" width="50%" flexFlow="wrap" gap={2}>
					{Object.entries(item.variables).map(([symbol, object]) => {
						return (
							<Tag key={symbol} colorScheme="teal">
								{symbol}={object.name}
							</Tag>
						);
					})}
				</Flex>
			</Td>
			<Td width="10%">
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
			</Td>
			<DeletionModal
				onClose={onDeletionClose}
				isOpen={isDeletionOpen}
				deleteCallback={async () => {
					await deleteItem(item.id);
				}}
				title="Produkt unwideruflich löschen?"
				successMessage="Produkt erfolgreich gelöscht."
				description="Diese Aktion ist unwirderuflich und löscht das Produkt."
			/>
			<AddItemModal isOpen={isUpdateModalOpen} onClose={onUpdateModalClose} item={item} />
		</Tr>
	);
}
