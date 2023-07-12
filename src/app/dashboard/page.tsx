import { getCompanyItems, getConsultants } from '@/utils/supabase-server';
import { RealTimeCompanyConsultantsProvider } from '../components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeItemsProvider } from '../components/Provider/RealTimeItemsProvider';
import { HomeContainer } from './HomeContainer';

export default async function Home() {
	const items = await getCompanyItems();
	const consultants = await getConsultants();

	return (
		<RealTimeItemsProvider items={items}>
			<RealTimeCompanyConsultantsProvider consultants={consultants}>
				<HomeContainer />
			</RealTimeCompanyConsultantsProvider>
		</RealTimeItemsProvider>
	);
}
