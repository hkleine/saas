import { useToken } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';

export function useApexChartOptions({
	id,
	labelsFormatter,
	unit,
}: {
	id?: string;
	unit?: string;
	labelsFormatter?: () => string;
}): ApexOptions {
	const colors = useToken('colors', ['pink.400', 'purple.500', 'blue.400', 'green.400', 'red.400', 'cyan.500']);

	return {
		chart: {
			toolbar: {
				show: false,
			},
			id: id ?? 'default-apex-chart-id',
		},
		colors,
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		markers: {
			size: 3,
			colors: ['#fff'],
			strokeColors: colors,
			strokeWidth: 3,
		},
		yaxis: {
			labels: {
				formatter:
					labelsFormatter ??
					function (value) {
						if (!value) {
							return '0';
						}

						if (unit) {
							return `${value.toFixed(2)}${unit}`;
						}
						return `${value.toFixed(2)}`;
					},
			},
		},
		xaxis: {
			tooltip: {
				enabled: false,
			},
		},
		tooltip: {
			x: {
				show: false,
			},
			y: {
				formatter: function (value) {
					if (!value) {
						return '0';
					}

					if (unit) {
						return `${value.toFixed(2)}${unit}`;
					}
					return `${value.toFixed(2)}`;
				},
			},
		},
		grid: {
			borderColor: '#EDF2F7',
		},
		fill: {
			gradient: {
				opacityFrom: 0.85,
				opacityTo: 0.25,
			},
		},
		noData: {
			text: 'Keine Daten verfügbar',
		},
	};
}
