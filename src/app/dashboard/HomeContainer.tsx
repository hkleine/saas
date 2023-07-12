'use client';
import { Grid, GridItem } from '@chakra-ui/react';
import { CurrentRevenue } from './CurrentRevenue';
import { RevenueChart } from './RevenueChart';

export function HomeContainer() {
	return (
		<Grid
			autoRows="1fr"
			gridAutoFlow="dense"
			templateColumns={{ lg: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
			p={4}
			gap={4}>
			<GridItem colSpan={2}>
				<CurrentRevenue />
			</GridItem>
			<GridItem colSpan={2}>
				<RevenueChart />
			</GridItem>
		</Grid>
	);
}
