import { Pipeline } from '@/app/components/Pipeline/Pipeline';
import { RealTimeItemsProvider } from '@/app/components/Provider/RealTimeItemsProvider';

export const revalidate = 0;

export default async function PipelinePage() {
	return (
		<RealTimeItemsProvider>
			<Pipeline />
		</RealTimeItemsProvider>
	);
}
