import { ConsultantWithCurrentEarning } from '@/types/types';
import { HStack, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FiEyeOff } from 'react-icons/fi';
import { calculateDownlineEarnings } from './calculateDownlineEarnings';

interface DownlineEarningsProps {
	consultant: ConsultantWithCurrentEarning;
	otherConsultants: Array<ConsultantWithCurrentEarning>;
}

export function DownlineEarnings({ consultant, otherConsultants }: DownlineEarningsProps) {
	const downlineEarnings = useMemo(
		() => calculateDownlineEarnings({ otherConsultants, consultant }),
		[otherConsultants, consultant],
	);

	if (downlineEarnings <= 0) {
		return null;
	}

	return (
		<Stat maxW="50%">
			<StatLabel>Downline Einnahmen</StatLabel>
			{consultant.currentEarning.concealed ? (
				<FiEyeOff />
			) : (
				<HStack>
					<StatNumber>{downlineEarnings.toFixed(2)}€</StatNumber>
				</HStack>
			)}
		</Stat>
	);
}
