'use client';

import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { FiFilePlus } from 'react-icons/fi';
import { AddItemModal } from '../Modals/AddItemModal';
import { ItemsTable } from './ItemsTable';

export function ItemsContainer() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Flex zIndex={1} justify="space-between" width="87vw" p="4">
				<span></span>
				<Button leftIcon={<FiFilePlus />} onClick={onOpen}>
					Produkt hinzufügen
				</Button>
			</Flex>
			<ItemsTable />
			<AddItemModal isOpen={isOpen} onClose={onClose} />
		</>
	);
}
