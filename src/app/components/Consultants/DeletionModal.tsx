import { createToastSettings } from '@/utils/createToastSettings';
import { deleteData } from '@/utils/helpers';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export function DeletionModal({ isOpen, onClose, id }: { isOpen: boolean; onClose: () => void; id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasDeletionError, setHasDeletionError] = useState(false);
  const toast = useToast();

  async function onDelete() {
    setHasDeletionError(false);
    setIsDeleting(true);

    try {
      await deleteData({
        url: `/api/delete-user/${id}`,
      });
    } catch (error) {
      console.log(error);
      setHasDeletionError(true);
      setIsDeleting(false);
      return;
    }

    toast(createToastSettings({ title: 'Berater erfolgreich gelöscht.', status: 'success' }));

    setIsDeleting(false);
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Berater unwideruflich löschen?</ModalHeader>
        <ModalCloseButton />
        {hasDeletionError && (
          <Alert mb="2" rounded={'lg'} status="error">
            <AlertIcon />
            <AlertTitle>Fehler beim Löschen!</AlertTitle>
            <AlertDescription>Versuche es später erneut.</AlertDescription>
          </Alert>
        )}
        <ModalBody>Diese Aktion ist unwirderuflich und löscht den Account des Beraters.</ModalBody>

        <ModalFooter>
          <Button isLoading={isDeleting} mr={3} variant="ghost" onClick={onClose}>
            Abbruch
          </Button>
          <Button isLoading={isDeleting} onClick={onDelete} colorScheme="red">
            Löschen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
