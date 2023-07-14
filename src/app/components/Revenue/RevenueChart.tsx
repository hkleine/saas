'use client';
import { useApexChartOptions } from '@/hooks/useApexChartOptions';
import { ConsultantWithEarnings } from '@/types/types';
import { getCertainMonthRevenue } from '@/utils/getCurrentEarningFromConsultant';
import { Card, Flex, Heading, Select } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import { calculateDownlineEarnings } from '../Consultants/ConsultantCard/calculateDownlineEarnings';
import { RealTimeCompanyConsultantsContext } from '../Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeUserContext } from '../Provider/RealTimeUserProvider';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const REVENUE_GRAPH_OPTIONS = {
	lastSix: 6,
	lastTwelve: 12,
};

export function RevenueChart() {
	const user = useContext(RealTimeUserContext);
	const consultants = useContext(RealTimeCompanyConsultantsContext)!;
	const consultant = consultants.find((con) => con.id === user?.id)!;
	const [graphTimeFrame, setGraphTimeFrame] = useState<keyof typeof REVENUE_GRAPH_OPTIONS>('lastSix');
	const options = useApexChartOptions({
		id: 'consultant-revenue-chart',
	});

	if (consultant.earnings.length === 0) {
		return null;
	}

	const revenueTimeSeries = getConsultantEarningsTimeSeries({
		graphTimeFrame,
		consultant,
	});
	const downlineEarningsTimeSeries = getDownlineEarningsTimeSeries({
		consultant,
		otherConsultants: consultants,
		graphTimeFrame,
	});

	return (
		<Card direction="column" p={6} boxShadow={'xl'} rounded={'lg'}>
			<Flex justifyContent="space-between">
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
			</Flex>
			<Chart options={options} series={[revenueTimeSeries, downlineEarningsTimeSeries]} type="area" height={250} />
		</Card>
	);
}

function getConsultantEarningsTimeSeries({
	graphTimeFrame,
	consultant,
}: {
	graphTimeFrame: keyof typeof REVENUE_GRAPH_OPTIONS;
	consultant: ConsultantWithEarnings;
}) {
	const timeframe = REVENUE_GRAPH_OPTIONS[graphTimeFrame];
	const date = new Date();
	const series = [];
	for (let i = 0; i < timeframe; i++) {
		series.push({
			x: date.toLocaleString('default', { month: 'long', year: '2-digit' }),
			y: getCertainMonthRevenue({ consultant, date }),
		});
		date.setMonth(date.getMonth() - 1);
	}

	return {
		name: 'Dein Umsatz',
		data: isZeroSeries(series) ? [] : series.reverse(),
	};
}

function getDownlineEarningsTimeSeries({
	otherConsultants,
	consultant,
	graphTimeFrame,
}: {
	consultant: ConsultantWithEarnings;
	otherConsultants: Array<ConsultantWithEarnings>;
	graphTimeFrame: keyof typeof REVENUE_GRAPH_OPTIONS;
}) {
	const timeframe = REVENUE_GRAPH_OPTIONS[graphTimeFrame];
	const date = new Date();
	const series = [];
	for (let i = 0; i < timeframe; i++) {
		const earning = calculateDownlineEarnings({
			otherConsultants,
			consultant,
			forCertainMonth: date,
		});
		series.push({
			x: new Date(date).toLocaleString('default', { month: 'long', year: '2-digit' }),
			y: earning,
		});
		date.setMonth(date.getMonth() - 1);
	}

	return {
		name: 'Dein Downline Umsatz',
		data: isZeroSeries(series) ? [] : series.reverse(),
	};
}

function isZeroSeries(series: Array<{ x: string; y: number }>) {
	return !series.some((data) => data.y !== 0);
}