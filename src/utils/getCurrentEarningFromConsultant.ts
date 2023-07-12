import { ConsultantWithEarnings } from '@/types/types';
import { isSameMonthOfTheYear } from './isSameMonthOfTheYear';

export function getCurrentEarningFromConsultant(consultant: ConsultantWithEarnings) {
	const currentDate = new Date();
	return consultant.earnings.find((con) => isSameMonthOfTheYear(new Date(con.date), currentDate))!;
}

export function getCertainMonthEarningFromConsultant(consultant: ConsultantWithEarnings, date: Date) {
	return consultant.earnings.find((con) => isSameMonthOfTheYear(new Date(con.date), date));
}
