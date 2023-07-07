import { ConsultantWithEarnings } from '@/types/types';
import { isNull } from 'lodash';

export function hasConsultantUpline(consultant: ConsultantWithEarnings) {
	return !isNull(consultant.upline);
}
