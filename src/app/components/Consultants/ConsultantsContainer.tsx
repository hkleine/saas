'use client';
import { isUserAllowed } from '@/utils/isUserAllowed';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { Roles } from '../../../types/types';
import ConsultantForm from '../Forms/ConsultantForm';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import Consultants from './Consultants';

export default function ConsultantsContainer({
  roles,
}: {
  roles: Roles;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useContext(RealTimeUserContext);
  if(!user) {
    return null;
  }

  const isUserAllowedToAddConsultant = isUserAllowed({user, minimalRoleRequired: 2})
  return (
    <>
      <Flex justify="space-between">
        <div></div>
        {isUserAllowedToAddConsultant && <Button leftIcon={<FiUserPlus />} onClick={onOpen}>
          Berater hinzufügen
        </Button>}
      </Flex>

      <Consultants />

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
    </>
  );
}
