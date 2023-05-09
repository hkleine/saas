/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import { ConsultantWithCurrentEarning, UserWithEmail } from '@/types/types';
import { findOverhead } from '@/utils/findOverhead';
import { useConsultantActionRights } from '@/utils/hooks';
import {
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
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
import { useContext, useMemo } from 'react';
import { FiDollarSign, FiEdit2, FiEyeOff, FiPercent, FiTrash } from 'react-icons/fi';
import { Avatar } from '../AppShell/Avatar';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { AdjustEarningModal } from './AdjustEarningModal';
import { DeletionModal } from './DeletionModal';
import { UpdateConsultantModal } from './UpdateConsultantModal';

export default function Consultants({
  consultants,
  user,
}: {
  consultants: Array<ConsultantWithCurrentEarning>;
  user: UserWithEmail;
}) {
  const overheads = getOverheads({ user, otherConsultants: consultants });

  return (
    <Flex gap={20} flex="1 1 auto" overflowX="auto">
      {overheads.map(overhead => (
        <VStack key={overhead.id}>
          <ConsultantCard consultant={overhead} otherConsultants={consultants} />
          <Flex gap={2}>
            {consultants
              .filter(a => a.upline === overhead.id)
              .map(au => (
                <VStack key={au.id}>
                  <ConsultantCard consultant={au} otherConsultants={consultants} />
                  <Grid templateColumns="auto auto" gap={2}>
                    {consultants
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
  const { onOpen: onDeletionOpen, isOpen: isDeletionOpen, onClose: onDeleteionClose } = useDisclosure();
  const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();
  const {
    onOpen: onOpenUpdateConsultant,
    isOpen: isUpdateConsultantOpen,
    onClose: onCloseUpdateConsultant,
  } = useDisclosure();
  const downlineEarnings = useMemo(
    () => calculateDownlineEarnings({ otherConsultants, consultant }),
    [otherConsultants, consultant]
  );

  const uplineLevy = calculateUplineLevy({ consultant });

  const { isConsultantDeletable, isUpdateDisabled } = useConsultantActionRights({
    consultant,
    otherConsultants,
    user,
  });

  if (!user) {
    return null;
  }

  const isConsultantCardFromCurrentUser = user.id === consultant.id;

  return (
    <Card
      border={isConsultantCardFromCurrentUser ? '1px' : undefined}
      borderColor="purple.500"
      position="relative"
      width={400}
      p={6}
      boxShadow={isConsultantCardFromCurrentUser ? 'xl' : 'lg'}
      rounded={'lg'}
    >
      <Stack spacing={0} mb={5}>
        <HStack>
          <Avatar avatarUrl={consultant.avatar_url} name={consultant.name} size="md" ml={-1} mr={2} />
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
                  isDisabled={isUpdateDisabled}
                />
                <IconButton
                  isDisabled={isUpdateDisabled}
                  onClick={onOpenUpdateConsultant}
                  size="xs"
                  variant="ghost"
                  aria-label="edit consultant"
                  icon={<FiEdit2 />}
                />
                <IconButton
                  isDisabled={isConsultantDeletable}
                  size="xs"
                  variant="ghost"
                  aria-label="delete consultant"
                  icon={<FiTrash />}
                  onClick={onDeletionOpen}
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
          {consultant.currentEarning.concealed ? (
            <FiEyeOff />
          ) : (
            <HStack>
              <StatNumber>{consultant.currentEarning.value.toFixed(2)}€</StatNumber>
              {uplineLevy > 0 ? (
                <StatHelpText>
                  <StatArrow type="decrease" />
                  {((consultant.currentEarning.value / 100) * (100 - consultant.percent)).toFixed(2)}
                </StatHelpText>
              ) : null}
            </HStack>
          )}
        </Stat>
        {downlineEarnings > 0 ? (
          <Stat>
            <StatLabel>Downline Einnahmen</StatLabel>
            {consultant.currentEarning.concealed ? (
              <FiEyeOff />
            ) : (
              <HStack>
                <StatNumber>{downlineEarnings.toFixed(2)}€</StatNumber>
              </HStack>
            )}
          </Stat>
        ) : null}
      </HStack>
      <DeletionModal id={consultant.id} onClose={onDeleteionClose} isOpen={isDeletionOpen} />
      <AdjustEarningModal
        id={consultant.id}
        earning={consultant.currentEarning}
        onClose={onCloseAdjustEarning}
        isOpen={isAdjustEarningOpen}
      />
      <UpdateConsultantModal
        isOpen={isUpdateConsultantOpen}
        consultant={consultant}
        onClose={onCloseUpdateConsultant}
      />
    </Card>
  );
}

function calculateUplineLevy({ consultant }: { consultant: ConsultantWithCurrentEarning }) {
  return (consultant.currentEarning.value / 100) * consultant.percent;
}

function calculateDownlineEarnings({
  otherConsultants,
  consultant,
}: {
  otherConsultants: Array<ConsultantWithCurrentEarning>;
  consultant: ConsultantWithCurrentEarning;
}) {
  const firstDownlines = getConsultantDownlines({ consultant, otherConsultants });
  const downlines = otherConsultants.reduce((previousDownlines, currentOtherConsultant) => {
    const isDownline = !!previousDownlines.find(prevDown => prevDown.id === currentOtherConsultant.upline);

    if (isDownline) {
      return [...previousDownlines, currentOtherConsultant];
    }

    return previousDownlines;
  }, firstDownlines);

  return downlines.reduce((previousNumber, currentDownline) => {
    if (currentDownline.currentEarning.value === 0) {
      return previousNumber;
    }

    if (currentDownline.upline === consultant.id) {
      const percentDifference = consultant.percent - currentDownline.percent;
      return previousNumber + (currentDownline.currentEarning.value / 100) * percentDifference;
    }

    let upline = downlines.find(downline => downline.id === currentDownline.upline);
    while (upline!.upline !== consultant.id) {
      upline = downlines.find(downline => downline.id === upline!.upline);
    }

    const percentDifference = consultant.percent - upline!.percent;
    return previousNumber + (currentDownline.currentEarning.value / 100) * percentDifference;
  }, 0);
}

function getConsultantDownlines({
  consultant,
  otherConsultants,
}: {
  consultant: ConsultantWithCurrentEarning;
  otherConsultants: Array<ConsultantWithCurrentEarning>;
}) {
  return otherConsultants.filter(otherConsultants => consultant.id === otherConsultants.upline);
}

function getOverheads({
  user,
  otherConsultants,
}: {
  user: UserWithEmail;
  otherConsultants: Array<ConsultantWithCurrentEarning>;
}) {
  if (user.role.id === 0) {
    return otherConsultants.filter(consultant => consultant.role.id === 1);
  }
  const consultant = otherConsultants.find(otherConsultant => otherConsultant.id === user.id);

  if (!consultant) {
    return [];
  }

  return [findOverhead({ consultant, otherConsultants })];
}
