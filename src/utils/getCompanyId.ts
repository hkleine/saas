import { UserWithEmail } from '@/types/types';
import { isNil } from 'lodash';

export function getCompanyId(user: UserWithEmail) {
  return isNil(user.consultants) ? user.id : user.consultants.company_id;
}
