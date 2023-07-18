import { ConsultantWithEarnings } from '@/types/types';
import { isSameMonthOfTheYear } from './isSameMonthOfTheYear';

function getCertainMonthEarningsFromConsultant({
	consultant,
	date,
}: {
	consultant?: ConsultantWithEarnings;
	date: Date;
}) {
	return consultant?.earnings.filter((con) => isSameMonthOfTheYear(new Date(con.date), date)) ?? [];
}

export function getCertainMonthRevenue({
	consultant,
	date,
}: {
	consultant?: ConsultantWithEarnings;
	date: Date;
}): number {
	const earnings = getCertainMonthEarningsFromConsultant({ consultant, date });

	return earnings.reduce((previousNumber, currentEarning) => {
		return previousNumber + currentEarning.value;
	}, 0);
}

export function getNumberOfItemsForCertainMonth({
	consultant,
	date,
}: {
	consultant?: ConsultantWithEarnings;
	date: Date;
}): number {
	return getCertainMonthEarningsFromConsultant({ consultant, date }).length;
}
