'use client';
import { ConsultantWithEarnings } from '@/types/types';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';
import {
	Badge,
	Button,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';
import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiBarChart2, FiCoffee, FiFilter } from 'react-icons/fi';
import { calculateDownlineEarnings } from '../Consultants/ConsultantCard/calculateDownlineEarnings';
import { AdjustEarningModal } from '../Modals';
import { useGlobalStateContext } from '../Provider/GlobalStoreProvider';

export function CurrentRevenue() {
	const user = useGlobalStateContext((s) => s.user);
	const consultants = useGlobalStateContext((s) => s.consultants);
	const consultant = consultants.find((con) => con.id === user?.id);
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();

	const { currentMonthRevenue, revenuePercentDifference, previousMonthRevenue } = getConsultantRevenueNumbers({
		consultant,
	});
	const { currentMonthDownlineEarnings, previousMonthDownlineEarnings, downlineEarningsPercentDifference } =
		useDownlineRevenueNumbers({
			consultant,
			otherConsultants: consultants,
		});

	const { currentMonthTotalRevenue, totalRevenuePercentDifference } = useRevenueTotal({
		currentMonthRevenue,
		previousMonthRevenue,
		currentMonthDownlineEarnings,
		previousMonthDownlineEarnings,
	});

	if (!user || !consultant) {
		return null;
	}

	return (
		<Card direction="column" gap={4} p={8} boxShadow={'xl'} rounded={'lg'}>
			<Heading size="lg">Moin, {user.name}</Heading>
			<SimpleGrid columns={{ md: 1, lg: 3 }} spacing={4}>
				<ChangeStat
					title="Umsatz"
					icon={<FiBarChart2 />}
					statValue={currentMonthRevenue}
					percentDifference={revenuePercentDifference}
				/>
				<ChangeStat
					title="Downline Umsatz"
					icon={<FiFilter />}
					statValue={currentMonthDownlineEarnings}
					percentDifference={downlineEarningsPercentDifference}
				/>
				<ChangeStat
					title="Gesamt Umsatz"
					icon={<FiCoffee />}
					statValue={currentMonthTotalRevenue}
					percentDifference={totalRevenuePercentDifference}
				/>
			</SimpleGrid>
			<Button rightIcon={<FiArrowRight />} onClick={onOpenAdjustEarning}>
				Umsatz gemacht
			</Button>
			<AdjustEarningModal consultant={consultant} onClose={onCloseAdjustEarning} isOpen={isAdjustEarningOpen} />
		</Card>
	);
}

function ChangeStat({
	title,
	statValue,
	percentDifference,
	icon,
}: {
	title: string;
	statValue: number;
	percentDifference: number;
	icon: ReactNode;
}) {
	const percentDifferenceColor = percentDifference < 0 ? 'red.500' : percentDifference > 0 ? 'green.500' : 'gray';
	const percentDifferenceIcon =
		percentDifference < 0 ? FiArrowDownRight : percentDifference > 0 ? FiArrowUpRight : null;
	return (
		<Card p={6} boxShadow={'lg'} rounded={'lg'}>
			<Stat>
				<StatLabel>
					<Flex gap={3} alignItems="center">
						<Badge colorScheme="teal" borderRadius="xl" fontSize="lg" p={3}>
							{icon}
						</Badge>
						<Text whiteSpace="nowrap" fontSize="lg">
							{title}
						</Text>
					</Flex>
				</StatLabel>
				<StatNumber fontSize="3xl" mt={2}>
					{statValue.toFixed(2)}€
				</StatNumber>
				<StatHelpText>
					<HStack>
						{percentDifferenceIcon && <Icon color={percentDifferenceColor} as={percentDifferenceIcon} />}
						<Text sx={{ marginInlineStart: 'unset !important' }} color={percentDifferenceColor}>
							{percentDifference}%
						</Text>
						<span>vs letzter Monat</span>
					</HStack>
				</StatHelpText>
			</Stat>
		</Card>
	);
}

function getPercentDifference(currentValue: number, previousValue: number): number {
	if (currentValue === 0) return 0;

	return Math.round(((currentValue - previousValue) / currentValue) * 100);
}

function useDownlineRevenueNumbers({
	consultant,
	otherConsultants,
}: {
	consultant?: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
}) {
	const { previousDate } = getCurrentAndPreviousMonth();
	const currentMonthDownlineEarnings = useMemo(
		() => calculateDownlineEarnings({ otherConsultants, consultant }),
		[otherConsultants, consultant],
	);
	const previousMonthDownlineEarnings = useMemo(
		() =>
			calculateDownlineEarnings({
				otherConsultants,
				consultant,
				forCertainMonth: previousDate,
			}),
		[otherConsultants, consultant],
	);
	const downlineEarningsPercentDifference = getPercentDifference(
		currentMonthDownlineEarnings,
		previousMonthDownlineEarnings,
	);

	return { currentMonthDownlineEarnings, previousMonthDownlineEarnings, downlineEarningsPercentDifference };
}

export function getConsultantRevenueNumbers({ consultant }: { consultant?: ConsultantWithEarnings }) {
	const { previousDate, currentDate } = getCurrentAndPreviousMonth();

	const currentMonthRevenue = getCertainMonthRevenue({ consultant, date: currentDate });

	const previousMonthRevenue = getCertainMonthRevenue({ consultant, date: previousDate }) ?? { id: '1', value: 0 };

	const revenuePercentDifference = getPercentDifference(currentMonthRevenue, previousMonthRevenue);

	return { currentMonthRevenue, previousMonthRevenue, revenuePercentDifference };
}

function useRevenueTotal({
	currentMonthRevenue,
	previousMonthRevenue,
	currentMonthDownlineEarnings,
	previousMonthDownlineEarnings,
}: {
	currentMonthRevenue: number;
	previousMonthRevenue: number;
	currentMonthDownlineEarnings: number;
	previousMonthDownlineEarnings: number;
}) {
	const currentMonthTotalRevenue = currentMonthRevenue + currentMonthDownlineEarnings;
	const previousMonthTotalRevenue = previousMonthRevenue + previousMonthDownlineEarnings;
	const totalRevenuePercentDifference = getPercentDifference(currentMonthTotalRevenue, previousMonthTotalRevenue);
	return { currentMonthTotalRevenue, previousMonthTotalRevenue, totalRevenuePercentDifference };
}
