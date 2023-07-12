import { ConsultantWithEarnings } from '@/types/types';
import { getCurrentEarningFromConsultant } from '@/utils/getCurrentEarningFromConsultant';

export function calculateUplineLevy({ consultant }: { consultant: ConsultantWithEarnings }) {
	const currentEarning = getCurrentEarningFromConsultant(consultant);

	return (currentEarning.value / 100) * consultant.percent;
}
