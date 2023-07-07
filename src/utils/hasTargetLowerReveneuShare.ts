import { ConsultantWithEarnings } from '@/types/types';

export function hasTargetLowerReveneuShare({
	target,
	source,
	otherConsultants,
}: {
	target: string;
	source: string;
	otherConsultants: Array<ConsultantWithEarnings>;
}) {
	const sourceConsultant = otherConsultants.find((otherConsultant) => otherConsultant.id === source)!;
	const targetConsultant = otherConsultants.find((otherConsultant) => otherConsultant.id === target)!;

	if (targetConsultant.percent > sourceConsultant.percent) {
		return true;
	}

	return false;
}
