'use client';
import { ConsultantWithCurrentEarning } from '@/types/types';
import { deleteConsultant } from '@/utils/supabase-client';
import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  IconButton,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
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
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FiDollarSign, FiEdit2, FiPercent, FiTrash } from 'react-icons/fi';

export default function Consultants({ consultants }: { consultants: Array<ConsultantWithCurrentEarning> | null }) {
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
          <Flex>
            {ausbilder
              .filter(a => a.upline === overhead.id)
              .map(au => (
                <VStack key={au.id}>
                  <ConsultantCard consultant={au} otherConsultants={consultants} />
                  <HStack>
                    {azubis
                      .filter(a => a.upline === au.id)
                      .map(az => (
                        <ConsultantCard key={az.id} consultant={az} otherConsultants={consultants} />
                      ))}
                  </HStack>
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

  const isConsultantDeletable = otherConsultants.some(otherConsultant => otherConsultant.upline === consultant.id);

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
}: {
  isOpen: boolean;
  onClose: () => void;
  earning: { id: string; value: number };
}) {
  const [earningValue, setEarningValue] = useState(earning.value);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Einnahmen bearbeiten</ModalHeader>
        <ModalBody>
          <InputGroup>
            <NumberInput
              clampValueOnBlur={true}
              precision={2}
              min={0}
              max={10000000}
              w="full"
              value={earningValue}
              onChange={newValue => setEarningValue(parseFloat(newValue))}
            >
              <NumberInputField />
            </NumberInput>
            <InputRightAddon>€</InputRightAddon>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button w="full" colorScheme="primary">
            Speichern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DeletionModal({ isOpen, onClose, id }: { isOpen: boolean; onClose: () => void; id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function onDelete() {
    setIsDeleting(true);
    await deleteConsultant(id);
    setIsDeleting(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Berater unwideruflich löschen?</ModalHeader>
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
