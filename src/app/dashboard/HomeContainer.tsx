'use client';
import { Grid, GridItem } from '@chakra-ui/react';
import { LeaderBoard } from '../components/LeaderBoard/LeaderBoard';
import { CurrentRevenue } from '../components/Revenue/CurrentRevenue';
import { RevenueChart } from '../components/Revenue/RevenueChart';

export function HomeContainer() {
	return (
		<Grid gridAutoFlow="dense" templateColumns={{ lg: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} p={4} gap={4}>
			<GridItem colSpan={2}>
				<CurrentRevenue />
			</GridItem>
			<GridItem colSpan={2}>
				<RevenueChart />
			</GridItem>
			<GridItem colSpan={2}>
				<LeaderBoard />
			</GridItem>
			<GridItem colSpan={2}></GridItem>
		</Grid>
	);
}
