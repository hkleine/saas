import { Roles } from '@/types/types';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import ConsultantForm from '../Forms/ConsultantForm';

export function AddConsultantModal({ isOpen, onClose, roles }: { onClose: () => void; isOpen: boolean; roles: Roles }) {
  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={4} borderRadius="xl">
        <ModalHeader>Berater hinzufügen</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ConsultantForm onClose={onClose} roles={roles} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
