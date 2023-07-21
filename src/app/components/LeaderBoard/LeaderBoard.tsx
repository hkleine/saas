import { ConsultantWithEarnings, StatisticType } from '@/types/types';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import {
	Badge,
	Card,
	Flex,
	Heading,
	Select,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiCrown } from 'react-icons/bi';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';
import { getConsultantRevenueNumbers } from '../Revenue/CurrentRevenue';

const SORT_FUNCTION_MAPPING = {
	[StatisticType.EINHEITEN]: sortByEinheiten,
	[StatisticType.UMSATZ]: sortByUmsatz,
};

export function LeaderBoard() {
	const [boardStatistic, setBoardStatistic] = useState<StatisticType>(StatisticType.EINHEITEN);
	const consultants = useGlobalStateContext((s) => s.consultants);
	const top5Consultants = consultants.sort(SORT_FUNCTION_MAPPING[boardStatistic]).slice(0, 5);

	const { currentDate } = getCurrentAndPreviousMonth();
	const month = currentDate.toLocaleString('de', { month: 'long' });
	return (
		<Card direction="column" gap={4} p={8} boxShadow={'xl'} rounded={'lg'}>
			<Flex justifyContent="space-between" alignItems="center">
				<Flex direction="row" gap={4} alignItems="baseline">
					<Heading size="md">Top 5 Berater</Heading>
					<Text fontSize="sm">Monat {month}</Text>
				</Flex>
				<Select
					value={boardStatistic}
					onChange={(event) => setBoardStatistic(event.target.value as StatisticType)}
					borderRadius="lg"
					maxW="180px"
					size="sm">
					{Object.entries(StatisticType).map(([key, value]) => {
						return (
							<option key={key} value={value}>
								Nach {value}
							</option>
						);
					})}
				</Select>
			</Flex>
			<TableContainer>
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th isNumeric></Th>
							<Th>Name</Th>
							<Th>Rolle</Th>
							<Th isNumeric>{boardStatistic}</Th>
						</Tr>
					</Thead>
					<Tbody>
						{top5Consultants.map((consultant, index) => {
							const placement = index + 1;
							return (
								<Tr
									backgroundColor={placement === 1 ? 'gray.100' : placement === 2 ? 'gray.50' : undefined}
									key={consultant.id}>
									<Td width="10%" flexDirection="row" isNumeric>
										<Flex direction="row" gap={4} justifyContent="end" alignItems="center">
											{placement === 1 && <BiCrown fontSize="18px" />} <span>{placement}.</span>
										</Flex>
									</Td>
									<Td width="40%">{consultant.name}</Td>
									<Td width="20%">
										<Badge size="xs" borderRadius="lg" px={2} py={0.5}>
											{consultant.role.name}
										</Badge>
									</Td>
									<Td isNumeric width="30%">
										<ConsultantStatisticNumber consultant={consultant} boardStatistic={boardStatistic} />
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</Card>
	);
}

function ConsultantStatisticNumber({
	boardStatistic,
	consultant,
}: {
	boardStatistic: StatisticType;
	consultant: ConsultantWithEarnings;
}) {
	const { currentMonthRevenue } = getConsultantRevenueNumbers({ consultant });
	return (
		<>
			{boardStatistic === StatisticType.EINHEITEN ? consultant.earnings.length : currentMonthRevenue.toFixed(2) + '€'}
		</>
	);
}

function sortByEinheiten(a: ConsultantWithEarnings, b: ConsultantWithEarnings) {
	const aNumberEarnings = a.earnings.length;
	const bNumberEarnings = b.earnings.length;

	if (aNumberEarnings < bNumberEarnings) {
		return 1;
	}

	if (aNumberEarnings > bNumberEarnings) {
		return -1;
	}

	return 0;
}

function sortByUmsatz(a: ConsultantWithEarnings, b: ConsultantWithEarnings) {
	const { currentMonthRevenue: aRevenue } = getConsultantRevenueNumbers({ consultant: a });
	const { currentMonthRevenue: bRevenue } = getConsultantRevenueNumbers({ consultant: b });

	if (aRevenue < bRevenue) {
		return 1;
	}

	if (aRevenue > bRevenue) {
		return -1;
	}

	return 0;
}
