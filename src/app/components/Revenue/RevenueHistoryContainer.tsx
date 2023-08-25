'use client';

import { Box } from '@chakra-ui/react';
import { RevenueHistory } from './RevenueHistory';

export function RevenueHistoryContainer() {
	return (
		<Box h="full" p={4}>
			<RevenueHistory />
		</Box>
	);
}
