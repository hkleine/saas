import { ConsultantWithCurrentEarning } from '@/types/types';
import { getConsultantDownlines } from '@/utils/getConsultantDownlines';

export function calculateDownlineEarnings({
	otherConsultants,
	consultant,
}: {
	otherConsultants: Array<ConsultantWithCurrentEarning>;
	consultant: ConsultantWithCurrentEarning;
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
		if (currentDownline.currentEarning.value === 0) {
			return previousNumber;
		}

		if (currentDownline.upline === consultant.id) {
			const percentDifference = consultant.percent - currentDownline.percent;
			return previousNumber + (currentDownline.currentEarning.value / 100) * percentDifference;
		}

		let upline = downlines.find((downline) => downline.id === currentDownline.upline);
		while (upline!.upline !== consultant.id) {
			upline = downlines.find((downline) => downline.id === upline!.upline);
		}

		const percentDifference = consultant.percent - upline!.percent;
		return previousNumber + (currentDownline.currentEarning.value / 100) * percentDifference;
	}, 0);
}
