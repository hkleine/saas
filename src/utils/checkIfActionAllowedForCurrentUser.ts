import { ConsultantWithEarnings, UserWithEmail } from '@/types/types';
import { hasConsultantUpline } from './hasConsultantUpline';

export function checkIfActionAllowedForCurrentUser({
	user,
	currentConsultant,
	otherConsultants,
}: {
	user: UserWithEmail;
	currentConsultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
}) {
	if (user.role.id === 0) {
		return false;
	}

	if (user.id === currentConsultant.id) {
		return false;
	}

	if (currentConsultant.upline === user.id) {
		return false;
	}

	let uplineConsultant = currentConsultant;
	while (hasConsultantUpline(uplineConsultant)) {
		uplineConsultant = otherConsultants.find((otherConsultant) => otherConsultant.id === uplineConsultant.upline!)!;

		if (uplineConsultant.id === user.id) {
			return false;
		}
	}

	return true;
}
