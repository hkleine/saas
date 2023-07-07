import { ConsultantWithEarnings } from '@/types/types';

export function isTargetADownline({
	target,
	source,
	otherConsultants,
}: {
	target: string;
	source: string;
	otherConsultants: Array<ConsultantWithEarnings>;
}): boolean {
	const sourceConsultant = otherConsultants.find((otherConsultant) => otherConsultant.id === source)!;
	const companyId = sourceConsultant.company_id;

	if (sourceConsultant.upline === target) {
		return true;
	}

	if (sourceConsultant.upline === companyId) {
		return false;
	}

	return isTargetADownline({ source: sourceConsultant.upline!, target, otherConsultants });
}
