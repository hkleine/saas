'use client';
import { ConsultantWithEarnings, Roles } from '@/types/types';
import { Card, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { Avatar } from '../../AppShell/Avatar';
import { RealTimeUserContext } from '../../Provider/RealTimeUserProvider';
import { ConsultantCardMenu } from './ConsultantCardMenu';
import { ConsultantEarnings } from './ConsultantEarnings';
import { ConsultantRevenueShare } from './ConsultantRevenueShare';
import { DownlineEarnings } from './DownlineEarnings';

export function ConsultantCard({
	data: { consultant, otherConsultants, roles },
}: {
	data: {
		otherConsultants: Array<ConsultantWithEarnings>;
		consultant: ConsultantWithEarnings;
		roles: Roles;
	};
}) {
	const user = useContext(RealTimeUserContext);

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
			rounded={'lg'}>
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
							<ConsultantCardMenu roles={roles} consultant={consultant} otherConsultants={otherConsultants} />
						</HStack>
						<Flex direction="row" gap="2">
							<Text mt="unset" color={'gray.500'}>
								{consultant.role.name}
							</Text>
							<ConsultantRevenueShare percent={consultant.percent} />
						</Flex>
					</Flex>
				</HStack>
			</Stack>
			<Flex>
				<ConsultantEarnings consultant={consultant} />
				<DownlineEarnings consultant={consultant} otherConsultants={otherConsultants} />
			</Flex>
		</Card>
	);
}
