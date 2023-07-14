import { getCompanyItems, getConsultants, getUser } from '@/utils/supabase-server';
import { ReactNode } from 'react';
import 'server-only';
import AppShell from '../components/AppShell/AppShell';
import AuthWrapper from '../components/Auth/AuthWrapper';
import { RealTimeCompanyConsultantsProvider } from '../components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeItemsProvider } from '../components/Provider/RealTimeItemsProvider';
import { RealTimeUserProvider } from '../components/Provider/RealTimeUserProvider';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
	const consultants = await getConsultants();
	const user = await getUser();
	const items = await getCompanyItems();

	return (
		<AuthWrapper>
			<RealTimeUserProvider user={user}>
				<RealTimeCompanyConsultantsProvider consultants={consultants}>
					<RealTimeItemsProvider items={items}>
						<AppShell>{children}</AppShell>
					</RealTimeItemsProvider>
				</RealTimeCompanyConsultantsProvider>
			</RealTimeUserProvider>
		</AuthWrapper>
	);
}
