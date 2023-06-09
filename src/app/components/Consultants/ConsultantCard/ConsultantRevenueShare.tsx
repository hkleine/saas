import { Tag, TagLabel } from '@chakra-ui/react';
import { FiPercent } from 'react-icons/fi';

interface ConsultantRevenueShare {
	percent: number;
}

export function ConsultantRevenueShare({ percent }: ConsultantRevenueShare) {
	return (
		<Tag size="sm" colorScheme="cyan" borderRadius="full">
			<TagLabel mr={1}>{percent}</TagLabel>
			<FiPercent />
		</Tag>
	);
}
