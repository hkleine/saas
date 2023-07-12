import { getCompanyItems, getConsultantEarnings, getConsultants } from '@/utils/supabase-server';
import { RealTimeCompanyConsultantsProvider } from '../components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeConsultantEarningsProvider } from '../components/Provider/RealTimeConsultantEarningsProvider';
import { RealTimeItemsProvider } from '../components/Provider/RealTimeItemsProvider';
import { HomeContainer } from './HomeContainer';

export default async function Home() {
	const consultantEarnings = await getConsultantEarnings();
	const items = await getCompanyItems();
	const consultants = await getConsultants();

	if (!consultantEarnings) {
		return null;
	}

	return (
		<RealTimeItemsProvider items={items}>
			<RealTimeConsultantEarningsProvider consultantEarnings={consultantEarnings}>
				<RealTimeCompanyConsultantsProvider consultants={consultants}>
					<HomeContainer />
				</RealTimeCompanyConsultantsProvider>
			</RealTimeConsultantEarningsProvider>
		</RealTimeItemsProvider>
	);
}
