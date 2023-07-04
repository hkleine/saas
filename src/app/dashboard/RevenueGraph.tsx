'use client';
import { DatabaseEarnings } from '@/types/types';
import { Card, Heading, HStack, Select } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import { useContext, useState } from 'react';
import Chart from 'react-apexcharts';
import { RealTimeConsultantEarningsContext } from '../components/Provider/RealTimeConsultantEarningsProvider';

const REVENUE_GRAPH_OPTIONS = {
	lastSix: 6,
	lastTwelve: 12,
};

export function RevenueGraph() {
	const consultantEarnings = useContext(RealTimeConsultantEarningsContext);
	const [graphTimeFrame, setGraphTimeFrame] = useState<keyof typeof REVENUE_GRAPH_OPTIONS>('lastSix');

	if (!consultantEarnings || consultantEarnings.length === 0) {
		return null;
	}

	const series = convertEarningsToTimeSeries(consultantEarnings.slice(-REVENUE_GRAPH_OPTIONS[graphTimeFrame]));

	const options: ApexOptions = {
		chart: {
			toolbar: {
				show: false,
			},
			id: 'apexchart-example',
		},
		colors: ['#805AD5'],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		markers: {
			size: 3,
			colors: ['#fff'],
			strokeColors: ['#805AD5'],
			strokeWidth: 3,
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					return value + '€';
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
	};

	return (
		<Card p={8} boxShadow={'xl'} rounded={'lg'}>
			<HStack justifyContent="space-between">
				<Heading size="md">Umsatz</Heading>
				<Select
					value={graphTimeFrame}
					onChange={(event) => setGraphTimeFrame(event.target.value as keyof typeof REVENUE_GRAPH_OPTIONS)}
					borderRadius="lg"
					maxW="180px"
					size="sm">
					{Object.entries(REVENUE_GRAPH_OPTIONS).map(([key, value]) => {
						return (
							<option key={key} value={key}>
								Letzten {value} Monate
							</option>
						);
					})}
				</Select>
			</HStack>

			<Chart options={options} series={series} type="area" height={250} />
		</Card>
	);
}

function convertEarningsToTimeSeries(earnings: Array<DatabaseEarnings>): ApexAxisChartSeries {
	return [
		{
			name: 'Dein Umsatz',
			data: earnings.map((earning) => {
				return {
					x: new Date(earning.date).toLocaleString('default', { month: 'long', year: '2-digit' }),
					y: earning.value,
				};
			}),
		},
	];
}
