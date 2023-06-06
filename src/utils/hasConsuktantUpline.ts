import { ConsultantWithCurrentEarning } from '@/types/types';
import { isNull } from 'lodash';

export function hasConsultantUpline(consultant: ConsultantWithCurrentEarning) {
	return !isNull(consultant.upline);
}
