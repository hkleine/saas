import { ConsultantWithEarnings } from '@/types/types';
import { getConsultantDownlines } from '@/utils/getConsultantDownlines';
import { getCertainMonthEarningFromConsultant } from '@/utils/getCurrentEarningFromConsultant';

export function calculateDownlineEarnings({
	otherConsultants,
	consultant,
	forCertainMonth,
}: {
	otherConsultants: Array<ConsultantWithEarnings>;
	consultant: ConsultantWithEarnings;
	forCertainMonth?: Date;
}) {
	const firstDownlines = getConsultantDownlines({ consultant, otherConsultants });
	const downlines = otherConsultants.reduce((previousDownlines, currentOtherConsultant) => {
		const isDownline = !!previousDownlines.find((prevDown) => prevDown.id === currentOtherConsultant.upline);

		if (isDownline) {
			return [...previousDownlines, currentOtherConsultant];
		}

		return previousDownlines;
	}, firstDownlines);

	return downlines.reduce((previousNumber, currentDownline) => {
		const month = forCertainMonth ? forCertainMonth : new Date();
		const currentDownlineEarning = getCertainMonthEarningFromConsultant(currentDownline, month);
		if (!currentDownlineEarning || currentDownlineEarning.value === 0) {
			return previousNumber;
		}

		if (currentDownline.upline === consultant.id) {
			const percentDifference = consultant.percent - currentDownline.percent;
			return previousNumber + (currentDownlineEarning.value / 100) * percentDifference;
		}

		let upline = downlines.find((downline) => downline.id === currentDownline.upline);
		while (upline!.upline !== consultant.id) {
			upline = downlines.find((downline) => downline.id === upline!.upline);
		}

		const percentDifference = consultant.percent - upline!.percent;
		return previousNumber + (currentDownlineEarning.value / 100) * percentDifference;
	}, 0);
}
