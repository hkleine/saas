import { ConsultantWithEarnings } from '@/types/types';
import { getCurrentAndPreviousMonth } from '@/utils/getCurrentAndPrviousMonth';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';

export function calculateUplineLevy({ consultant }: { consultant: ConsultantWithEarnings }) {
	const { currentDate } = getCurrentAndPreviousMonth();
	const currentEarning = getCertainMonthRevenue({ consultant, date: currentDate });

	return (currentEarning / 100) * consultant.percent;
}
