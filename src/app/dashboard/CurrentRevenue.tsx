'use client';
import { ConsultantWithEarnings, DatabaseEarnings } from '@/types/types';
import { getCurrentAndPrviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import {
	getCertainMonthEarningFromConsultant,
	getCurrentEarningFromConsultant,
} from '@/utils/getCurrentEarningFromConsultant';
import { isSameMonthOfTheYear } from '@/utils/isSameMonthOfTheYear';
import {
	Badge,
	Button,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { ReactNode, useContext, useMemo } from 'react';
import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiBarChart2, FiCoffee, FiFilter } from 'react-icons/fi';
import { calculateDownlineEarnings } from '../components/Consultants/ConsultantCard/calculateDownlineEarnings';
import { AdjustEarningModal } from '../components/Modals';
import { RealTimeCompanyConsultantsContext } from '../components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../components/Provider/RealTimeUserProvider';

export function CurrentRevenue() {
	const user = useContext(RealTimeUserContext);
	const consultants = useContext(RealTimeCompanyConsultantsContext)!;
	const consultant = consultants.find((con) => con.id === user?.id)!;
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();

	const { currentMonthRevenue, revenuePercentDifference, previousMonthRevenue } = useConsultantRevenueNumbers({
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

	// if (consultant.earnings.length === 0 || !user || !currentMonthRevenue || !consultant) {
	// 	return null;
	// }

	if (!user) {
		return null;
	}

	return (
		<Card direction={{ base: 'column', sm: 'row' }} alignItems="center" gap={4} p={8} boxShadow={'xl'} rounded={'lg'}>
			<Flex direction="column" gap={6}>
				<Heading size="lg">Moin, {user.name}</Heading>
				<HStack gap={4}>
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
				</HStack>
				<Button rightIcon={<FiArrowRight />} onClick={onOpenAdjustEarning}>
					Umsatz gemacht
				</Button>
			</Flex>
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

function getPercentVsLastMonth(allEarnings: Array<Omit<DatabaseEarnings, 'consultant_id'>>) {
	const { currentDate, previousDate } = getCurrentAndPrviousMonth();
	// Muss auch im selben jahr sein
	const currentMonthRevenue = allEarnings.find((earning) => isSameMonthOfTheYear(new Date(earning.date), currentDate));
	const prevMonthEarning = allEarnings.find((earning) => isSameMonthOfTheYear(new Date(earning.date), previousDate));

	if (!prevMonthEarning || !currentMonthRevenue || currentMonthRevenue.value === 0) return 0;

	return getPercentDifference(currentMonthRevenue.value, prevMonthEarning.value);
}

function getPercentDifference(currentValue: number, previousValue: number): number {
	if (currentValue === 0 && previousValue === 0) return 0;
	return Math.round(((currentValue - previousValue) / currentValue) * 100);
}

function useDownlineRevenueNumbers({
	consultant,
	otherConsultants,
}: {
	consultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
}) {
	const { previousDate } = getCurrentAndPrviousMonth();
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

function useConsultantRevenueNumbers({ consultant }: { consultant: ConsultantWithEarnings }) {
	const { previousDate } = getCurrentAndPrviousMonth();

	const currentMonthRevenue = getCurrentEarningFromConsultant(consultant).value;
	const previousMonthRevenue = (getCertainMonthEarningFromConsultant(consultant, previousDate) ?? { id: '1', value: 0 })
		.value;
	const revenuePercentDifference = getPercentVsLastMonth(consultant.earnings);

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
