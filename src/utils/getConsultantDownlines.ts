import { ConsultantWithCurrentEarning } from '@/types/types';

export function getConsultantDownlines({
	consultant,
	otherConsultants,
}: {
	consultant: ConsultantWithCurrentEarning;
	otherConsultants: Array<ConsultantWithCurrentEarning>;
}) {
	return otherConsultants.filter((otherConsultants) => consultant.id === otherConsultants.upline);
}
