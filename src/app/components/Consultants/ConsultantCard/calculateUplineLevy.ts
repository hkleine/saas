import { ConsultantWithCurrentEarning } from '@/types/types';

export function calculateUplineLevy({ consultant }: { consultant: ConsultantWithCurrentEarning }) {
	return (consultant.currentEarning.value / 100) * consultant.percent;
}
