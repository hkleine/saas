import { ConsultantWithEarnings } from '@/types/types';
import { getCurrentEarningFromConsultant } from '@/utils/getCurrentEarningFromConsultant';
import { HStack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import { FiEyeOff } from 'react-icons/fi';

interface ConsultantEarningsProps {
	consultant: ConsultantWithEarnings;
}

export function ConsultantEarnings({ consultant }: ConsultantEarningsProps) {
	const currentEarning = getCurrentEarningFromConsultant(consultant);
	const uplineLevy = (currentEarning.value / 100) * (100 - consultant.percent);

	return (
		<Stat maxW="50%">
			<StatLabel>Eigene Einnahmen</StatLabel>
			{consultant.concealed ? (
				<FiEyeOff />
			) : (
				<HStack>
					<StatNumber>{currentEarning.value.toFixed(2)}€</StatNumber>
					{uplineLevy > 0 ? (
						<StatHelpText whiteSpace="nowrap">
							<StatArrow type="decrease" />
							{uplineLevy.toFixed(2)}
						</StatHelpText>
					) : null}
				</HStack>
			)}
		</Stat>
	);
}
