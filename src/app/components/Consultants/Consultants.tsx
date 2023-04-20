'use client';
import { Consultant, Overhead, Roles } from '@/types/types';
import {
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { startCase } from 'lodash';
import { FiPercent, FiUserPlus } from 'react-icons/fi';
import ConsultantForm from '../Forms/ConsultantForm';

export default function Consultants({ consultants, roles }: { consultants: Array<Overhead> | null, roles: Roles | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button leftIcon={<FiUserPlus />} onClick={onOpen}>
        Berater hinzufügen
      </Button>
      {consultants &&
        consultants.map(consultant => {
          return (
            <VStack key={consultant.id} gap={6}>
              <ConsultantCard consultant={consultant} />
              <Flex>
                {consultant.downlines &&
                  consultant.downlines.map(downline => {
                    return (
                      <VStack key={downline.id} gap={6}>
                        <ConsultantCard consultant={downline} />
                        <SimpleGrid columns={2} spacing={4}>
                          {downline.downlines &&
                            downline.downlines.map(deeperDownline => (
                              <ConsultantCard key={deeperDownline.id} consultant={deeperDownline} />
                            ))}
                        </SimpleGrid>
                      </VStack>
                    );
                  })}
              </Flex>
            </VStack>
          );
        })}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={4} borderRadius="xl">
          <ModalHeader>Berater hinzufügen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ConsultantForm roles={roles} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function ConsultantCard({ consultant }: { consultant: Consultant }) {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <Card width={380} p={6} boxShadow={'lg'} rounded={'lg'}>
      <Stack spacing={0} mb={5}>
        <HStack>
          <Avatar src="https://bit.ly/sage-adebayo" size="md" name="Segun Adebayo" ml={-1} mr={2} />
          <Flex w="full" direction="column">
            <HStack justify="space-between">
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {user.user_metadata.name}
              </Heading>
              <Tag size="md" colorScheme="cyan" borderRadius="full">
                <TagLabel mr={1}>{consultant.percent}</TagLabel>
                <FiPercent />
              </Tag>
            </HStack>
            <Text mt="unset" color={'gray.500'}>
              {startCase(consultant.role.name)}
            </Text>
          </Flex>
        </HStack>
      </Stack>
      <HStack>
        <Stat>
          <StatLabel>Eigene Einnahmen</StatLabel>
          <HStack>
            {/* <StatNumber>{consultant.earnings}€</StatNumber> */}
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
