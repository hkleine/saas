'use client';
import { Consultant, Overhead } from '@/types/types';
import {
  Avatar,
  Card,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
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
import { startCase } from 'lodash';
import { FiPercent } from 'react-icons/fi';

export default function Consultants({ consultants }: { consultants: Array<Overhead> | null }) {
  if (!consultants) {
    return null;
  }

  return (
    <>
      {consultants.map(consultant => {
        return (
          <VStack gap={6}>
            <ConsultantCard consultant={consultant} />
            <Flex>
              {consultant.downlines &&
                consultant.downlines.map(downline => {
                  return (
                    <VStack gap={6}>
                      <ConsultantCard consultant={downline} />
                      <SimpleGrid columns={2} spacing={4}>
                        {downline.downlines &&
                          downline.downlines.map(deeperDownline => <ConsultantCard consultant={deeperDownline} />)}
                      </SimpleGrid>
                    </VStack>
                  );
                })}
            </Flex>
          </VStack>
        );
      })}
    </>
  );
}

function ConsultantCard({ consultant }: { consultant: Consultant }) {
  return (
    <Card width={380} p={6} boxShadow={'lg'} rounded={'lg'}>
      <Stack spacing={0} mb={5}>
        <HStack>
          <Avatar src="https://bit.ly/sage-adebayo" size="md" name="Segun Adebayo" ml={-1} mr={2} />
          <Stack>
            <HStack>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {consultant.name}
              </Heading>
              <Tag size="md" colorScheme="cyan" borderRadius="full">
                <TagLabel mr={1}>{consultant.percent}</TagLabel>
                <FiPercent />
              </Tag>
            </HStack>
            <Text mt="unset" color={'gray.500'}>
              {startCase(consultant.role.name)}
            </Text>
          </Stack>
        </HStack>
      </Stack>
      <HStack>
        <Stat>
          <StatLabel>Eigene Einnahmen</StatLabel>
          <HStack>
            <StatNumber>{consultant.earnings}€</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </HStack>
        </Stat>
        {'downlineEarnings' in consultant ? (
          <Stat>
            <StatLabel>Downline Einnahmen</StatLabel>
            <HStack>
              <StatNumber>{consultant.downlineEarnings}€</StatNumber>
            </HStack>
          </Stat>
        ) : null}
      </HStack>
    </Card>
  );
}
