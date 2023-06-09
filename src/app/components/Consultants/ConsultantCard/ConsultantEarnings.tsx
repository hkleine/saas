import { ConsultantWithCurrentEarning } from '@/types/types';
import { HStack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import { FiEyeOff } from 'react-icons/fi';
import { calculateUplineLevy } from './calculateUplineLevy';

interface ConsultantEarningsProps {
	consultant: ConsultantWithCurrentEarning;
}

export function ConsultantEarnings({ consultant }: ConsultantEarningsProps) {
	const uplineLevy = calculateUplineLevy({ consultant });

	return (
		<Stat maxW="50%">
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
	);
}
