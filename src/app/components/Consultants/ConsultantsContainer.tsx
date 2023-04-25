'use client';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import { ConsultantWithCurrentEarning, Roles } from '../../../types/types';
import ConsultantForm from '../Forms/ConsultantForm';
import Consultants from './Consultants';

export default function ConsultantsContainer({
  roles,
  consultants,
}: {
  consultants: Array<ConsultantWithCurrentEarning> | null;
  roles: Roles;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex justify="space-between">
        <div></div>
        <Button leftIcon={<FiUserPlus />} onClick={onOpen}>
          Berater hinzufügen
        </Button>
      </Flex>

      <Consultants />

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={4} borderRadius="xl">
          <ModalHeader>Berater hinzufügen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ConsultantForm onClose={onClose} roles={roles} consultants={consultants} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
