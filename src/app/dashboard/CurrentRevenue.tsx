'use client';
import { DatabaseEarnings } from '@/types/types';
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
import { RealTimeConsultantEarningsContext } from '../components/Provider/RealTimeConsultantEarningsProvider';
import { RealTimeUserContext } from '../components/Provider/RealTimeUserProvider';

export function CurrentRevenue() {
	const consultantEarnings = useContext(RealTimeConsultantEarningsContext);
	const user = useContext(RealTimeUserContext);
	const consultants = useContext(RealTimeCompanyConsultantsContext)!;
	const consultant = consultants?.find((con) => con.id === user?.id)!;
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();
	const downlineEarnings = useMemo(
		() => calculateDownlineEarnings({ otherConsultants: consultants, consultant }),
		[consultants, consultant],
	);

	if (!consultantEarnings || consultantEarnings.length === 0) {
		return null;
	}

	const currentMonthEarning = consultantEarnings.find(
		(earning) => new Date(earning.date).getMonth() === new Date().getMonth(),
	);
	const percentDifference = getPercentVsLastMonth(consultantEarnings);

	if (!user || !currentMonthEarning || !consultant) {
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
						statValue={currentMonthEarning.value}
						percentDifference={percentDifference}
					/>
					<ChangeStat title="Downline Umsatz" icon={<FiFilter />} statValue={downlineEarnings} percentDifference={0} />
					<ChangeStat
						title="Gesamt Umsatz"
						icon={<FiCoffee />}
						statValue={downlineEarnings + currentMonthEarning.value}
						percentDifference={0}
					/>
				</HStack>

				<Button rightIcon={<FiArrowRight />} onClick={onOpenAdjustEarning}>
					Umsatz gemacht
				</Button>
			</Flex>

			{/* <Image
				right={10}
				position="absolute"
				maxW={{ base: '100%', sm: '250px', lg: '280px', xl: '300px' }}
				src="/assets/makeItRain.svg"
				alt="make it rain"
			/> */}
			<AdjustEarningModal
				id={user.id}
				earning={{ id: currentMonthEarning?.id, value: currentMonthEarning?.value }}
				onClose={onCloseAdjustEarning}
				isOpen={isAdjustEarningOpen}
			/>
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
	const percentDifferenceColor = percentDifference < 0 ? 'red' : percentDifference > 0 ? 'green' : 'gray';
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

function getPercentVsLastMonth(allEarnings: Array<DatabaseEarnings>) {
	const currentMonth = new Date().getMonth();
	const prevMonth = currentMonth - 1;
	const currentMonthEarning = allEarnings.find((earning) => new Date(earning.date).getMonth() === currentMonth);
	const prevMonthEarning = allEarnings.find((earning) => new Date(earning.date).getMonth() === prevMonth);

	if (!prevMonthEarning || !currentMonthEarning || currentMonthEarning.value === 0) return 0;

	return Math.round(((currentMonthEarning.value - prevMonthEarning.value) / currentMonthEarning.value) * 100);
}
