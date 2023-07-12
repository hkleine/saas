import { ItemsContainer } from '@/app/components/Items/ItemsContainer';
import { RealTimeItemsProvider } from '@/app/components/Provider/RealTimeItemsProvider';
import { getCompanyItems } from '@/utils/supabase-server';

export default async function Products() {
	const items = await getCompanyItems();

	return (
		<RealTimeItemsProvider items={items}>
			<ItemsContainer />
		</RealTimeItemsProvider>
	);
}
