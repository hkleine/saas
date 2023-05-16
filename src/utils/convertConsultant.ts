import {
  ConsultantWithCurrentEarning,
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

export function convertConsultant({
  consultantData,
  user,
}: {
  consultantData: any;
  user: UserWithEmail;
}): Array<ConsultantWithCurrentEarning> {
  return consultantData.map((consultant: Consultant) => {
    const { name, role, avatar_url } = consultant.users;

    const currentMonthsEarning = consultant.earnings.find(earning => {
      const earningDate = new Date(earning.date);
      const now = new Date();
      return earningDate.getMonth() === now.getMonth();
    })!;
    return {
      ...omit(consultant, ['users', 'earnings']),
      // email: consultant
      avatar_url,
      name,
      role,
      currentEarning: {
        value: currentMonthsEarning.value,
        id: currentMonthsEarning.id,
        concealed: user.role.id >= role.id && user.id !== consultant.id,
      },
    };
  });
}
