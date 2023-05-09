'use client';
import { isUserAllowed } from '@/utils/isUserAllowed';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { Roles } from '../../../types/types';
import { Switch } from '../Atoms/Switch';
import { RealTimeCompanyConsultantsContext } from '../Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { AddConsultantModal } from './AddConsultantModal';
import Consultants from './Consultants';
import ConsultantsTable from './ConsultantsTable';

export default function ConsultantsContainer({ roles }: { roles: Roles }) {
  const [viewType, setViewType] = useState<'diagram' | 'table'>('diagram');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useContext(RealTimeUserContext);
  const consultants = useContext(RealTimeCompanyConsultantsContext);

  if (!consultants || !user) {
    return null;
  }

  const isUserAllowedToAddConsultant = isUserAllowed({ user, minimalRoleRequired: 2 });
  return (
    <>
      <Flex justify="space-between" mb={2}>
        <Switch option1="diagram" option2="table" value={viewType} setValue={setViewType} />
        {isUserAllowedToAddConsultant && (
          <Button leftIcon={<FiUserPlus />} onClick={onOpen}>
            Berater hinzufügen
          </Button>
        )}
      </Flex>

      {viewType === 'diagram' ? (
        <Consultants consultants={consultants} user={user} />
      ) : (
        <ConsultantsTable consultants={consultants} />
      )}

      <AddConsultantModal isOpen={isOpen} onClose={onClose} roles={roles} />
    </>
  );
}
