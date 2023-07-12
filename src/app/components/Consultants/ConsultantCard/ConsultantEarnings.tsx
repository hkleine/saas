import { ConsultantWithEarnings } from '@/types/types';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';
import { Flex, Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import { FiEyeOff } from 'react-icons/fi';

interface ConsultantEarningsProps {
	consultant: ConsultantWithEarnings;
}

export function ConsultantEarnings({ consultant }: ConsultantEarningsProps) {
	const { currentDate } = getCurrentAndPreviousMonth();

	const currentEarning = getCertainMonthRevenue({ consultant, date: currentDate });
	const uplineLevy = (currentEarning / 100) * (100 - consultant.percent);

	return (
		<Stat maxW="50%">
			<StatLabel>Eigene Einnahmen</StatLabel>
			{consultant.concealed ? (
				<FiEyeOff />
			) : (
				<Flex direction="column">
					<StatNumber>{currentEarning.toFixed(2)}€</StatNumber>
					{uplineLevy > 0 ? (
						<StatHelpText whiteSpace="nowrap">
							<StatArrow type="decrease" />
							{uplineLevy.toFixed(2)}€
						</StatHelpText>
					) : null}
				</Flex>
			)}
		</Stat>
	);
}
