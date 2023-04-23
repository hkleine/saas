'use client';
import { ConsultantWithCurrentEarning } from '@/types/types';
import {
  Avatar,
  Card,
  Flex,
  Heading,
  HStack,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { FiPercent } from 'react-icons/fi';

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
  const downlineEarnings = useMemo(
    () => calculateDownlineEarnings({ otherConsultants, consultant }),
    [otherConsultants, consultant]
  );

  const uplineLevy = useMemo(
    () => calculateUplineLevy({ otherConsultants, consultant }),
    [otherConsultants, consultant]
  );

  return (
    <Card width={380} p={6} boxShadow={'lg'} rounded={'lg'}>
      <Stack spacing={0} mb={5}>
        <HStack>
          <Avatar src="https://bit.ly/sage-adebayo" size="md" name="Segun Adebayo" ml={-1} mr={2} />
          <Flex w="full" direction="column">
            <HStack justify="space-between">
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {consultant.name}
              </Heading>
              <Tag size="md" colorScheme="cyan" borderRadius="full">
                <TagLabel mr={1}>{consultant.percent}</TagLabel>
                <FiPercent />
              </Tag>
            </HStack>
            <Text mt="unset" color={'gray.500'}>
              {consultant.role.name}
            </Text>
          </Flex>
        </HStack>
      </Stack>
      <HStack>
        <Stat>
          <StatLabel>Eigene Einnahmen</StatLabel>
          <HStack>
            <StatNumber>{consultant.currentEarning}€</StatNumber>
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
    </Card>
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
  return (consultant.currentEarning / 100) * percentDifference;
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

    return previousNumber + (currentDownline.currentEarning / 100) * percentDifference;
  }, 0);
}
