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
	Image,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiBarChart2 } from 'react-icons/fi';
import { AdjustEarningModal } from '../components/Modals';
import { RealTimeConsultantEarningsContext } from '../components/Provider/RealTimeConsultantEarningsProvider';
import { RealTimeUserContext } from '../components/Provider/RealTimeUserProvider';

export function CurrentRevenue() {
	const consultantEarnings = useContext(RealTimeConsultantEarningsContext);
	const user = useContext(RealTimeUserContext);
	const { onOpen: onOpenAdjustEarning, isOpen: isAdjustEarningOpen, onClose: onCloseAdjustEarning } = useDisclosure();

	if (!consultantEarnings || consultantEarnings.length === 0) {
		return null;
	}
	const currentMonthEarning = consultantEarnings.find(
		(earning) => new Date(earning.date).getMonth() === new Date().getMonth(),
	);
	const percentDifference = getPercentVsLastMonth(consultantEarnings);
	const percentDifferenceColor = percentDifference < 0 ? 'red' : 'green';
	const percentDifferenceIcon = percentDifference < 0 ? FiArrowDownRight : FiArrowUpRight;

	if (!user || !currentMonthEarning) {
		return null;
	}

	return (
		<Card direction={{ base: 'column', sm: 'row' }} alignItems="center" gap={4} p={8} boxShadow={'lg'} rounded={'lg'}>
			<Flex maxW="75%" direction="column" gap={6}>
				<Heading size="lg">Moin, {user.name}</Heading>
				<Stat>
					<StatLabel>
						<Flex gap={2} alignItems="center">
							<Badge colorScheme="teal" borderRadius="xl" fontSize="xl" p={2}>
								<FiBarChart2 />
							</Badge>
							<Text fontSize="lg">Umsatz</Text>
						</Flex>
					</StatLabel>
					<StatNumber fontSize="3xl" mt={2}>
						{currentMonthEarning?.value.toFixed(2)}€
					</StatNumber>
					<StatHelpText>
						<HStack>
							<Icon color={percentDifferenceColor} as={percentDifferenceIcon} />
							<Text sx={{ marginInlineStart: 'unset !important' }} color={percentDifferenceColor}>
								{percentDifference}%
							</Text>
							<span>vs letzter Monat</span>
						</HStack>
					</StatHelpText>
				</Stat>
				<Button rightIcon={<FiArrowRight />} onClick={onOpenAdjustEarning}>Umsatz gemacht</Button>
			</Flex>

			<Image
				right={12}
				position="absolute"
				maxW={{ base: '100%', sm: '250px', lg: '300px', xl: '320px' }}
				src="/assets/makeItRain.svg"
				alt="make it rain"
			/>
			<AdjustEarningModal
				id={user.id}
				earning={{id: currentMonthEarning?.id, value: currentMonthEarning?.value}}
				onClose={onCloseAdjustEarning}
				isOpen={isAdjustEarningOpen}
			/>
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
