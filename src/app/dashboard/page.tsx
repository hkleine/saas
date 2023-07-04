import { getCompanyItems, getConsultantEarnings } from '@/utils/supabase-server';
import { RealTimeConsultantEarningsProvider } from '../components/Provider/RealTimeConsultantEarningsProvider';
import { RealTimeItemsProvider } from '../components/Provider/RealTimeItemsProvider';
import { HomeContainer } from './HomeContainer';

export default async function Home() {
	const consultantEarnings = await getConsultantEarnings();
	const items = await getCompanyItems();

	if (!consultantEarnings) {
		return null;
	}

	return (
		<RealTimeItemsProvider items={items}>
			<RealTimeConsultantEarningsProvider consultantEarnings={consultantEarnings}>
				<HomeContainer />
			</RealTimeConsultantEarningsProvider>
		</RealTimeItemsProvider>
	);
}
