'use client';
import { ConsultantWithCurrentEarning, UserWithEmail } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { deleteData } from '@/utils/helpers';
import { updateCurrentEarning } from '@/utils/supabase-client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import { isNull } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { FiDollarSign, FiEdit2, FiPercent, FiTrash } from 'react-icons/fi';
import { RealTimeCompanyConsultantsContext } from '../Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';

export default function Consultants() {
  const consultants = useContext(RealTimeCompanyConsultantsContext);

  if (!consultants) {
    return null;
  }
  const overheads = consultants.filter(consultant => consultant.role.id === 1);
  const ausbilder = consultants.filter(consultant => consultant.role.id === 2);
  const azubis = consultants.filter(consultant => consultant.role.id === 3);

  return (
    <Flex gap={20}>
      {overheads.map(overhead => (
        <VStack key={overhead.id}>
          <ConsultantCard consultant={overhead} otherConsultants={consultants} />
          <Flex gap={2}>
            {ausbilder
              .filter(a => a.upline === overhead.id)
              .map(au => (
                <VStack key={au.id}>
                  <ConsultantCard consultant={au} otherConsultants={consultants} />
                  <Grid templateColumns="auto auto" gap={2}>
                    {azubis
                      .filter(a => a.upline === au.id)
                      .map(az => (
                        <ConsultantCard key={az.id} consultant={az} otherConsultants={consultants} />
                      ))}
                  </Grid>
                </VStack>
              ))}
          </Flex>
        </VStack>
      ))}
    </Flex>
  );
}

function ConsultantCard({
  consultant,
  otherConsultants,
}: {
  otherConsultants: Array<ConsultantWithCurrentEarning>;
  consultant: ConsultantWithCurrentEarning;
}) { 
  const user = useContext(RealTimeUserContext);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();
  const downlineEarnings = useMemo(
    () => calculateDownlineEarnings({ otherConsultants, consultant }),
    [otherConsultants, consultant]
  );

  const uplineLevy = useMemo(
    () => calculateUplineLevy({ otherConsultants, consultant }),
    [otherConsultants, consultant]
  );

  if(!user) {
    return null;
  }

  const isConsultantDeletable = otherConsultants.some(otherConsultant => otherConsultant.upline === consultant.id) || checkIfActionAllowedForCurrentUser({user, otherConsultants, currentConsultant: consultant});
  const isUpdateEarningDisabled = checkIfActionAllowedForCurrentUser({user, currentConsultant: consultant, otherConsultants});

  return (
    <Card position="relative" width={400} p={6} boxShadow={'lg'} rounded={'lg'}>
      <Stack spacing={0} mb={5}>
        <HStack>
          <Avatar src="https://bit.ly/sage-adebayo" size="md" name="Segun Adebayo" ml={-1} mr={2} />
          <Flex w="full" direction="column">
            <HStack justify="space-between">
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {consultant.name}
              </Heading>
              <Flex direction="row">
                <IconButton
                  onClick={onOpenAdjustEarning}
                  size="xs"
                  variant="ghost"
                  aria-label="edit consultant"
                  icon={<FiDollarSign />}
                  isDisabled={isUpdateEarningDisabled}
                />
                <IconButton size="xs" variant="ghost" aria-label="edit consultant" icon={<FiEdit2 />} />
                <IconButton
                  isDisabled={isConsultantDeletable}
                  size="xs"
                  variant="ghost"
                  aria-label="delete consultant"
                  icon={<FiTrash />}
                  onClick={onOpen}
                />
              </Flex>
            </HStack>
            <Flex direction="row" gap="2">
              <Text mt="unset" color={'gray.500'}>
                {consultant.role.name}
              </Text>
              <Tag size="sm" colorScheme="cyan" borderRadius="full">
                <TagLabel mr={1}>{consultant.percent}</TagLabel>
                <FiPercent />
              </Tag>
            </Flex>
          </Flex>
        </HStack>
      </Stack>
      <HStack>
        <Stat>
          <StatLabel>Eigene Einnahmen</StatLabel>
          <HStack>
            <StatNumber>{consultant.currentEarning.value}€</StatNumber>
            {uplineLevy > 0 ? (
              <StatHelpText>
                <StatArrow type="decrease" />
                {uplineLevy.toFixed(2)}
              </StatHelpText>
            ) : null}
          </HStack>
        </Stat>
        {downlineEarnings > 0 ? (
          <Stat>
            <StatLabel>Downline Einnahmen</StatLabel>
            <HStack>
              <StatNumber>{downlineEarnings.toFixed(2)}€</StatNumber>
            </HStack>
          </Stat>
        ) : null}
      </HStack>
      <DeletionModal id={consultant.id} onClose={onClose} isOpen={isOpen} />
      <AdjustEarningModal
        id={consultant.id}
        earning={consultant.currentEarning}
        onClose={onCloseAdjustEarning}
        isOpen={isAdjustEarningOpen}
      />
    </Card>
  );
}

function AdjustEarningModal({
  isOpen,
  onClose,
  earning,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  earning: { id: string; value: number };
  id: string;
}) {
  const fixedInputEarning = earning.value.toFixed(2);
  const [isDirty, setIsDirty] = useState(false);
  const [earningValue, setEarningValue] = useState(fixedInputEarning);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setIsDirty(fixedInputEarning !== earningValue)
  }, [earningValue, fixedInputEarning]);

  async function updateEarning() {
    setIsUpdating(true);

    try {
      await updateCurrentEarning({ id, newValue: earningValue });
    } catch (error) {
      console.log(error);
      setHasError(true);
      setIsUpdating(false);
      return;
    }

    setIsUpdating(false);
    onClose();
    toast(createToastSettings({title: 'Einnahmen erfolgreich bearbeiter', status: 'success'}));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Einnahmen bearbeiten</ModalHeader>
        <ModalCloseButton />
        {hasError && (
          <Alert mb="2" rounded={'lg'} status="error">
            <AlertIcon />
            <AlertTitle>Fehler beim bearbeiten!</AlertTitle>
            <AlertDescription>Versuche es später erneut.</AlertDescription>
          </Alert>
        )}
        <ModalBody>
          <InputGroup>
            <NumberInput
              clampValueOnBlur={true}
              precision={2}
              min={0}
              max={10000000}
              w="full"
              value={earningValue}
              onChange={newValue => setEarningValue(newValue)}
            >
              <NumberInputField />
            </NumberInput>
            <InputRightAddon>€</InputRightAddon>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={!isDirty} onClick={updateEarning} isLoading={isUpdating} w="full" colorScheme="primary">
            Speichern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DeletionModal({ isOpen, onClose, id }: { isOpen: boolean; onClose: () => void; id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasDeletionError, setHasDeletionError] = useState(false);
  const toast = useToast();

  async function onDelete() {
    setHasDeletionError(false);
    setIsDeleting(true);

    try {
      await deleteData({
        url: '/api/delete-user',
        data: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
      setHasDeletionError(true);
      setIsDeleting(false);
      return;
    }

    toast(createToastSettings({title: 'Berater erfolgreich gelöscht.', status: 'success'}));


    setIsDeleting(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Berater unwideruflich löschen?</ModalHeader>
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

function calculateUplineLevy({
  otherConsultants,
  consultant,
}: {
  otherConsultants: Array<ConsultantWithCurrentEarning>;
  consultant: ConsultantWithCurrentEarning;
}) {
  const upline = otherConsultants.find(otherConsultants => otherConsultants.id === consultant.upline);
  const percentDifference = upline ? upline.percent - consultant.percent : 0;
  return (consultant.currentEarning.value / 100) * percentDifference;
}

function calculateDownlineEarnings({
  otherConsultants,
  consultant,
}: {
  otherConsultants: Array<ConsultantWithCurrentEarning>;
  consultant: ConsultantWithCurrentEarning;
}) {
  const downlines = otherConsultants.filter(otherConsultant => otherConsultant.upline === consultant.id);
  return downlines.reduce((previousNumber, currentDownline) => {
    const percentDifference = consultant.percent - currentDownline.percent;

    return previousNumber + (currentDownline.currentEarning.value / 100) * percentDifference;
  }, 0);
}


function checkIfActionAllowedForCurrentUser({user, currentConsultant, otherConsultants} :{user: UserWithEmail , currentConsultant: ConsultantWithCurrentEarning, otherConsultants: Array<ConsultantWithCurrentEarning>}) {
  if(user.role.id === 0) {
    return false;
  }
  
  if(user.id === currentConsultant.id) {
    return false;
  }

  if(currentConsultant.upline === user.id) {
    return false;
  }

  let uplineConsultant = currentConsultant;
  while(hasConsultantUpline(uplineConsultant)) {
    uplineConsultant = otherConsultants.find(otherConsultant => otherConsultant.id === uplineConsultant.upline!)!;

    if(uplineConsultant.id === user.id) {
      return false;
    }
  }

  return true;
}

function hasConsultantUpline(consultant: ConsultantWithCurrentEarning) {
  return !isNull(consultant.upline);
}