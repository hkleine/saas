import { UserWithEmail } from '@/types/types';

export function getCompanyId(user: UserWithEmail | null) {
	return user?.role.id === 0 ? user?.id : user?.consultant.company_id;
}
