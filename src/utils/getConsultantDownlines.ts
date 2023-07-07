import { ConsultantWithEarnings } from '@/types/types';

export function getConsultantDownlines({
	consultant,
	otherConsultants,
}: {
	consultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
}) {
	return otherConsultants.filter((otherConsultants) => consultant.id === otherConsultants.upline);
}
