/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import { ConsultantWithCurrentEarning, Roles } from '@/types/types';
import { findOverhead } from '@/utils/findOverhead';
import { useConsultantActionRights } from '@/utils/hooks';
import { updateConsultantUpline } from '@/utils/supabase-client';
import {
  Card,
  Flex,
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
  useDisclosure
} from '@chakra-ui/react';
import dagre from 'dagre';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { FiDollarSign, FiEdit2, FiEyeOff, FiPercent, FiTrash } from 'react-icons/fi';
import ReactFlow, { Background, Controls, Edge, Handle, Node, Position, useEdgesState, useNodesState } from 'reactflow';
import { Avatar } from '../AppShell/Avatar';
import { RealTimeCompanyConsultantsContext } from '../Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
import { AdjustEarningModal } from './AdjustEarningModal';
import { DeletionModal } from './DeletionModal';
import { UpdateConsultantModal } from './UpdateConsultantModal';

const nodeTypes = { consultant: ConsultantCard };
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 400;
const nodeHeight = 181;

export default function Consultants({ roles }: { roles: Roles }) {
  const consultants = useContext(RealTimeCompanyConsultantsContext);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getConsultantNodes(consultants, roles);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getConsultantNodes(consultants, roles);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [consultants, roles, setEdges, setNodes]);

  const onConnect = useCallback(async ({ source, target }: { source: string | null; target: string | null }) => {
    if (!source || !target) return;
    await updateConsultantUpline(target, source);
  }, []);

  return (
    <Flex gap={20} flex="1 1 auto" overflowX="auto">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Flex>
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
  const highestRole = Math.max(...roles.map(o => o.id));
  const isHighestRole = highestRole === consultant.role.id;
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
        {!isHighestRole && <Handle style={{ width: '8px', height: '8px' }} type="source" position={Position.Bottom} />}
        {consultant.upline && <Handle style={{ width: '8px', height: '8px' }} type="target" position={Position.Top} />}
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

function getConsultantNodes(consultants: Array<ConsultantWithCurrentEarning> | null, roles: Roles) {
  if (!consultants) return { nodes: [], edges: [] };

  const nodes = consultants.map(consultant => {
    // TODO add groups for every overhead
    const overHead = findOverhead({
      consultant,
      otherConsultants: consultants,
    });

    return {
      id: consultant.id,
      type: 'consultant',
      position: { x: 0, y: 0 },
      data: { consultant, otherConsultants: consultants, roles },
      draggable: true,
      parentNode: `group-${overHead.id}`,
    };
  });

  consultants.forEach(consultant => {
    if(consultant.role.id === 1) {
      nodes.push({
        id: `group-${consultant.id}`,
        data: { label: `Group ${consultant.name}` },
        position: { x: 0, y: 0 },
        style: { backgroundColor: 'rgba(255, 0, 0, 0.2)' },
      })
    }
  })

  const edges = consultants.reduce((prevEdges: Array<Edge>, currentConsultant: ConsultantWithCurrentEarning) => {
    if (currentConsultant.upline) {
      return [
        ...prevEdges,
        { id: currentConsultant.id, type: 'step', target: currentConsultant.id, source: currentConsultant.upline },
      ];
    }
    return prevEdges;
  }, [] as Array<Edge>);

  return getLayoutedElements({
    nodes,
    edges,
  });
}

function getLayoutedElements({ nodes, edges }: { nodes: Array<Node>; edges: Array<Edge> }) {
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
}
