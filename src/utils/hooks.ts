import { ConsultantWithCurrentEarning, UserWithEmail } from '@/types/types';
import { checkIfActionAllowedForCurrentUser } from './checkIfActionAllowedForCurrentUser';
import { isUserAllowed } from './isUserAllowed';

export function useConsultantActionRights({
	consultant,
	otherConsultants,
	user,
}: {
	consultant: ConsultantWithCurrentEarning;
	otherConsultants: Array<ConsultantWithCurrentEarning>;
	user: UserWithEmail | null;
}) {
	if (!user) {
		return { isUpdateDisabled: false, isConsultantDeletable: false };
	}
	const isConsultantDeletable =
		otherConsultants.some((otherConsultant) => otherConsultant.upline === consultant.id) ||
		consultant.role.id === 0 ||
		checkIfActionAllowedForCurrentUser({ user, otherConsultants, currentConsultant: consultant });
	const isUpdateDisabled = checkIfActionAllowedForCurrentUser({
		user,
		currentConsultant: consultant,
		otherConsultants,
	});
	const isUserAllowedToAddConsultant = isUserAllowed({ user, minimalRoleRequired: 2 });

	return { isUpdateDisabled, isConsultantDeletable, isUserAllowedToAddConsultant };
}
