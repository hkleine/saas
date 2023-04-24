import { UserWithEmail } from '@/types/types';
import { isNull } from 'lodash';

export function getCompanyId(user: UserWithEmail) {
  return isNull(user.consultants) ? user.id : user.consultants.company_id;
}
