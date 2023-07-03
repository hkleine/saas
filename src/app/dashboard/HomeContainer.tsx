'use client';
import { Grid, GridItem } from '@chakra-ui/react';
import { CurrentRevenue } from './CurrentRevenue';
import { RevenueGraph } from './RevenueGraph';

export function HomeContainer() {
	return (
		<Grid templateColumns=" repeat(auto-fill, minmax(25rem, 1fr))" p={4} gap={4}>
			<GridItem colSpan={2}>
				<CurrentRevenue />
			</GridItem>
			<GridItem colSpan={2}>
				<RevenueGraph />
			</GridItem>
		</Grid>
	);
}
