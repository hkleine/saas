import { ConsultantWithEarnings, Role } from '@/types/types';
import { v4 } from 'uuid';

export function createConsultant({
	role,
	upline,
	companyId,
	name = 'Default Consultant Name',
	percent = 10,
}: {
	companyId: string;
	role: Role;
	upline: string | null;
	name?: string;
	percent?: number;
}): ConsultantWithEarnings {
	return {
		id: v4(),
		company_id: companyId,
		name,
		percent,
		role,
		upline,
		earnings: [
			{
				date: new Date().toString(),
				id: 'some-earning-id',
				value: 100,
			},
		],
	};
}
