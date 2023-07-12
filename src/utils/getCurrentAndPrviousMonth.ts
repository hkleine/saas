export function getCurrentAndPrviousMonth() {
	const currentDate = new Date();
	const previousDate = new Date();
	previousDate.setMonth(currentDate.getMonth() - 1);

	return { currentDate, previousDate };
}
