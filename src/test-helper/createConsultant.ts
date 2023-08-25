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
		email: 'bla@bla.de',
		percent,
		role,
		upline,
		earnings: [
			{
				item: {
					id: 'some-item-id',
					company_id: 'some-company',
					created_at: 'today',
					equation: 'y=2*x',
					name: 'first-earning',
					variables: { x: 'moin', y: 'moin2' },
				},
				date: new Date().toString(),
				id: 'some-earning-id',
				value: 100,
			},
		],
	};
}
