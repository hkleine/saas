export function isSameMonthOfTheYear(date1: Date, date2: Date) {
	return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}
