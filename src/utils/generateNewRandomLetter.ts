import { Item } from '@/types/types';

export function generateNewRandomLetter(variables: Item['variables']) {
	const existingSymbols = Object.keys(variables);
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const alphabetWithoutExistingSymbols = [...alphabet]
		.flatMap((letter) => {
			if (existingSymbols.includes(letter)) {
				return [];
			}
			return letter;
		})
		.join('');

	const randomLetter =
		alphabetWithoutExistingSymbols[Math.floor(Math.random() * alphabetWithoutExistingSymbols.length)];
	return randomLetter;
}
