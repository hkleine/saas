import { getConsultant, getConsultantEarnings } from '@/utils/supabase-server';
import { RealTimeConsultantEarningsProvider } from '../components/Provider/RealTimeConsultantEarningsProvider';
import { HomeContainer } from './HomeContainer';

export default async function Home() {
	const consultantEarnings = await getConsultantEarnings();
	const consultant = await getConsultant();

	if (!consultantEarnings || !consultant) {
		return null;
	}

	return (
		<RealTimeConsultantEarningsProvider consultantEarnings={consultantEarnings}>
			<HomeContainer consultant={consultant} />
		</RealTimeConsultantEarningsProvider>
	);
}
