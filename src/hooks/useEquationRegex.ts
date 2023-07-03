import { Item } from '@/types/types';

export function useEquationRegex(variables: Item['variables']) {
	const symbols = Object.keys(variables).join('');
	const regex = `^([${symbols}0-9./*()-]*)=([${symbols}0-9.*/()+-]*)+$`;
	const equationRegex = new RegExp(regex);
	return equationRegex;
}
