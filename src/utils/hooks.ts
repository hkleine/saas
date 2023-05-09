import { ConsultantWithCurrentEarning, UserWithEmail } from '@/types/types';
import { checkIfActionAllowedForCurrentUser } from './checkIfActionAllowedForCurrentUser';

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
    otherConsultants.some(otherConsultant => otherConsultant.upline === consultant.id) ||
    checkIfActionAllowedForCurrentUser({ user, otherConsultants, currentConsultant: consultant });
  const isUpdateDisabled = checkIfActionAllowedForCurrentUser({
    user,
    currentConsultant: consultant,
    otherConsultants,
  });

  return { isUpdateDisabled, isConsultantDeletable };
}
