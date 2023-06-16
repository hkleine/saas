import { getConsultantEarnings } from '@/utils/supabase-server';
import { HomeContainer } from './HomeContainer';

export default async function Home() {
	const consultantEarnings = await getConsultantEarnings();

	if (!consultantEarnings) {
		return null;
	}

	return <HomeContainer consultantEarnings={consultantEarnings} />;
}
