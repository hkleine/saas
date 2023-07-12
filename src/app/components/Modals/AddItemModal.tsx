import { Item } from '@/types/types';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import ItemForm from '../Forms/ItemForm';

export function AddItemModal({ isOpen, onClose, item }: { onClose: () => void; isOpen: boolean; item?: Item }) {
	return (
		<Modal size="2xl" isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent p={4} borderRadius="xl">
				<ModalHeader>{item ? 'Produkt bearbeiten' : 'Produkt hinzufügen'}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<ItemForm onClose={onClose} item={item} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
