import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import DealForm from '../Forms/DealForm';

export function AddDealModal({ isOpen, onClose }: { onClose: () => void; isOpen: boolean }) {
	return (
		<Modal size="5xl" isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent p={4} borderRadius="xl">
				<ModalHeader>Deal hinzufügen</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<DealForm onClose={onClose} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
