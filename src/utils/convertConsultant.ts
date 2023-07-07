import {
	ConsultantWithEarnings,
	DatabaseConsultant,
	DatabaseEarnings,
	DatabaseUser,
	Role,
	UserWithEmail,
} from '@/types/types';
import { omit } from 'lodash';

type Consultant = DatabaseConsultant & {
	users: { role: Role } & Omit<DatabaseUser, 'role'>;
	earnings: Array<DatabaseEarnings>;
};

export function convertConsultants({
	consultantData,
	user,
}: {
	consultantData: any;
	user: UserWithEmail;
}): Array<ConsultantWithEarnings> {
	const converted: Array<ConsultantWithEarnings> = consultantData.map((consultant: Consultant) => {
		const { name, role, avatar_url } = consultant.users;

		return {
			...omit(consultant, ['users', 'earnings']),
			// email: consultant
			avatar_url,
			name,
			role,
			concealed: user.role.id >= role.id && user.id !== consultant.id,
			earnings: consultant.earnings.map((earning) => omit(earning, ['consultant_id'])),
		};
	});
	console.log(converted);
	return converted;
}
