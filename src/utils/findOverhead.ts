import { ConsultantWithEarnings } from '@/types/types';

const OVERHEAD_ROLE = 1;

export function findOverhead({
	consultant,
	otherConsultants,
}: {
	consultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
}) {
	const { role } = consultant;
	let currentConsultant: ConsultantWithEarnings = consultant;
	for (let roleIndex = role.id; roleIndex > OVERHEAD_ROLE; roleIndex--) {
		const uplineId = currentConsultant.upline;
		const upline = otherConsultants.find((otherConsultants) => otherConsultants.id === uplineId)!;
		currentConsultant = upline;
	}

	return currentConsultant;
}
