/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import useLayout from '@/hooks/useLayout';
import { ConsultantWithCurrentEarning, Roles } from '@/types/types';
import { useConsultantActionRights } from '@/utils/hooks';
import { updateConsultantUpline } from '@/utils/supabase-client';
import {
  Card,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
} from '@chakra-ui/react';
import { noop } from 'lodash';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { FiDollarSign, FiEdit2, FiEyeOff, FiMenu, FiPercent, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Handle,
  Node,
  Position,
  ProOptions,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { Avatar } from '../AppShell/Avatar';
import { RealTimeCompanyConsultantsContext } from '../Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { AdjustEarningModal } from './AdjustEarningModal';
import { DeletionModal } from './DeletionModal';
import PlaceholderEdge from './PlaceholderEdge';
import { UpdateConsultantModal } from './UpdateConsultantModal';

const nodeTypes = { consultant: ConsultantCard };
const edgeTypes = {
  placeholder: PlaceholderEdge,
};
const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

export default function Consultants({ roles }: { roles: Roles }) {
  const consultants = useContext(RealTimeCompanyConsultantsContext);
  useLayout();

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getConsultantNodes(consultants, roles);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [consultants, roles]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getConsultantNodes(consultants, roles);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(async ({ source, target }: { source: string | null; target: string | null }) => {
    if (!source || !target) return;
    await updateConsultantUpline(target, source);
  }, []);

  return (
    <ReactFlow
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodes={nodes}
      edges={edges}
      proOptions={proOptions}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      maxZoom={1}
      nodesDraggable={true}
      zoomOnDoubleClick={false}
      // we are setting deleteKeyCode to null to prevent the deletion of nodes in order to keep the example simple.
      // If you want to enable deletion of nodes, you need to make sure that you only have one root node in your graph.
      deleteKeyCode={null}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

function ConsultantCard({
  data: { consultant, otherConsultants, roles },
}: {
  data: {
    otherConsultants: Array<ConsultantWithCurrentEarning>;
    consultant: ConsultantWithCurrentEarning;
    roles: Roles;
  };
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

  const { isConsultantDeletable, isUpdateDisabled, isUserAllowedToAddConsultant } = useConsultantActionRights({
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
        <Handle
          isConnectableStart={false}
          style={{
            background: 'var(--chakra-colors-gray-500)',
            width: '14px',
            height: '14px',
            border: '3px solid white',
          }}
          type="source"
          position={Position.Bottom}
        />
        {consultant.upline && (
          <Handle
            style={{
              background: 'var(--chakra-colors-gray-500)',
              width: '14px',
              height: '14px',
              border: '3px solid white',
            }}
            type="target"
            position={Position.Top}
          />
        )}
        <HStack>
          <Avatar avatarUrl={consultant.avatar_url} name={consultant.name} size="md" ml={-1} mr={2} />
          <Flex w="full" direction="column">
            <HStack justify="space-between">
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {consultant.name}
              </Heading>

              <Menu isLazy>
                {({ isOpen }) => (
                  <>
                    <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                      {isOpen ? <FiX /> : <FiMenu />}
                    </MenuButton>
                    <MenuList paddingX={4} bg="white" borderColor="gray.100" boxShadow="lg">
                      <MenuItem onClick={noop} isDisabled={!isUserAllowedToAddConsultant} icon={<FiPlus />}>
                        Downline hinzufügen
                      </MenuItem>
                      <MenuItem onClick={onOpenAdjustEarning} isDisabled={isUpdateDisabled} icon={<FiDollarSign />}>
                        Einnahmen bearbeiten
                      </MenuItem>
                      <MenuItem onClick={onOpenUpdateConsultant} isDisabled={isUpdateDisabled} icon={<FiEdit2 />}>
                        Berater bearbeiten
                      </MenuItem>
                      <MenuItem onClick={onDeletionOpen} isDisabled={isConsultantDeletable} icon={<FiTrash />}>
                        Berater löschen
                      </MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
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

function getConsultantNodes(consultants: Array<ConsultantWithCurrentEarning> | null, roles: Roles) {
  if (!consultants) return { nodes: [], edges: [] };

  const nodes = consultants.reduce((prevNodes: Array<Node>, currentConsultant: ConsultantWithCurrentEarning) => {
    const hasConsultantDownline = consultants.some(consultant => consultant.upline === currentConsultant.id);

    const nodesWithoutPlaceholder = [
      ...prevNodes,
      {
        id: currentConsultant.id,
        type: 'consultant',
        position: { x: 0, y: 0 },
        data: { consultant: currentConsultant, otherConsultants: consultants, roles },
        draggable: true,
      },
    ];

    // if (!hasConsultantDownline) {
    //   return [
    //     ...nodesWithoutPlaceholder,
    //     {
    //       id: `placeholder-node-${currentConsultant.id}`,
    //       data: { label: '+' },
    //       position: { x: 0, y: 150 },
    //       type: 'placeholder',
    //     },
    //   ];
    // }

    return nodesWithoutPlaceholder;
  }, [] as Array<Node>);

  const edges = consultants.reduce((prevEdges: Array<Edge>, currentConsultant: ConsultantWithCurrentEarning) => {
    const edges = prevEdges;

    // const hasConsultantDownline = consultants.some(consultant => consultant.upline === currentConsultant.id);
    // if (!hasConsultantDownline) {
    //   edges.push({
    //     id: `placeholder-edge-${currentConsultant.id}`,
    //     type: 'placeholder',
    //     target: `placeholder-node-${currentConsultant.id}`,
    //     source: currentConsultant.id,
    //   });
    // }

    if (currentConsultant.upline) {
      edges.push({
        id: currentConsultant.id,
        type: 'placeholder',
        target: currentConsultant.id,
        source: currentConsultant.upline,
      });
    }

    return edges;
  }, [] as Array<Edge>);

  return {
    nodes,
    edges,
  };
}
