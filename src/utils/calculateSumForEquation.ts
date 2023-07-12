import { preferences } from '@/preferences';
import { EquationVariable } from '@/types/types';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import nerdamer from 'nerdamer/nerdamer.core.js';
import 'nerdamer/Solve.js';

const { sumSymbol } = preferences.items;

export function calculateSumForEquation({
	variables,
	equation,
}: {
	variables: Record<string, EquationVariable & { value: number | string }>;
	equation?: string | null;
}) {
	if (!equation) {
		return 0;
	}

	const knownVariables = Object.entries(variables).reduce((currentVariables, [key, values]) => {
		if (key === sumSymbol) {
			return currentVariables;
		}
		return { ...currentVariables, [key]: `${values.value}` };
	}, {});
	const eq = nerdamer(equation).evaluate(knownVariables);
	const result = eq.solveFor(sumSymbol);
	return eval(result.toString());
}
