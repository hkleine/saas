import { ConsultantWithCurrentEarning, DatabaseConsultant, DatabaseEarnings, DatabaseUser } from '@/types/types';
import { omit } from 'lodash';

export function convertConsultant(consultantData: any): Array<ConsultantWithCurrentEarning> {
  return consultantData.map(
    (consultant: DatabaseConsultant & { users: DatabaseUser; earnings: Array<DatabaseEarnings> }) => {
      const { name, role, avatar_url } = consultant.users;

      const currentMonthsEarning = consultant.earnings.find(earning => {
        const earningDate = new Date(earning.date);
        const now = new Date();
        return earningDate.getMonth() === now.getMonth();
      })!;

      return {
        ...omit(consultant, ['users', 'earnings']),
        avatar_url,
        name,
        role,
        currentEarning: { value: currentMonthsEarning.value, id: currentMonthsEarning.id },
      };
    }
  );
}
