'use client';
import { isUserAllowed } from '@/utils/isUserAllowed';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { Roles } from '../../../types/types';
import { Switch } from '../Atoms/Switch';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { AddConsultantModal } from './AddConsultantModal';
import Consultants from './Consultants';
import ConsultantsTable from './ConsultantsTable';

export default function ConsultantsContainer({ roles }: { roles: Roles }) {
  const [viewType, setViewType] = useState<'diagram' | 'table'>('diagram');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useContext(RealTimeUserContext);

  if (!user) {
    return null;
  }

  const isUserAllowedToAddConsultant = isUserAllowed({ user, minimalRoleRequired: 2 });
  return (
    <>
      <Flex
        zIndex={1}
        justify="space-between"
        position={viewType === 'diagram' ? 'absolute' : 'relative'}
        width="87vw"
        p="4"
      >
        <Switch option1="diagram" option2="table" value={viewType} setValue={setViewType} />
        {isUserAllowedToAddConsultant && (
          <Button leftIcon={<FiUserPlus />} onClick={onOpen}>
            Berater hinzufügen
          </Button>
        )}
      </Flex>

      {viewType === 'diagram' ? <Consultants roles={roles} /> : <ConsultantsTable />}

      <AddConsultantModal isOpen={isOpen} onClose={onClose} roles={roles} />
    </>
  );
}
