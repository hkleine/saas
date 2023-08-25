'use client';
import { Earning } from '@/types/types';
import { Box, Card, Flex, Heading, Text } from '@chakra-ui/react';
import { groupBy } from 'lodash';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';
import styles from './RevenueHistory.module.css';

export function RevenueHistory() {
	const user = useGlobalStateContext((s) => s.user);
	const consultants = useGlobalStateContext((s) => s.consultants);
	const { earnings } = consultants.find((con) => con.id === user?.id)!;
	const groupedEarning = groupBy(earnings, (earning: Earning) =>
		new Date(earning.date).toLocaleDateString(undefined, {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}),
	);
	return (
		<Card maxH="full" direction="column" gap={4} p={8} boxShadow={'lg'} rounded={'lg'}>
			<Heading size="md">Umsatzhistorie</Heading>
			<Box h="full" pr={2} overflowY="scroll">
				{Object.entries(groupedEarning)
					.sort(sortNewestFirst)
					.map(([date, earnings]) => {
						return (
							<Box mb="6" key={date}>
								<Text ml={4} mb={2}>
									{date}
								</Text>
								<Box className={styles['revenue-container']}>
									{earnings.map((earning) => {
										return (
											<Box key={earning.id} w="full" p="4" borderWidth="1px" overflow="hidden">
												<Flex justifyContent="space-between">
													<Text>{earning.item.name}</Text>
													<Text fontWeight="bold">+{earning.value.toFixed(2)}€</Text>
												</Flex>
											</Box>
										);
									})}
								</Box>
							</Box>
						);
					})}
			</Box>
		</Card>
	);
}

function sortNewestFirst(a: any, b: any) {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}
