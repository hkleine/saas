import { getCompanyItems, getConsultants, getSubscriptionsWithPriceAndProduct, getUser } from '@/utils/supabase-server';
import { ReactNode } from 'react';
import 'server-only';
import AppShell from '../components/AppShell/AppShell';
import AuthWrapper from '../components/Auth/AuthWrapper';
import { GlobalStoreProvider } from '../components/Provider/GlobalStoreProvider';
import { RealTimeCompanyConsultantsProvider } from '../components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeItemsProvider } from '../components/Provider/RealTimeItemsProvider';
import { RealTimeUserProvider } from '../components/Provider/RealTimeUserProvider';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
	const consultants = await getConsultants();
	const user = await getUser();
	const items = await getCompanyItems();
	const subscription = await getSubscriptionsWithPriceAndProduct();

	if (!user || !consultants || !items) return null;

	return (
		<AuthWrapper>
			<GlobalStoreProvider subscription={subscription} consultants={consultants} user={user} items={items}>
				<RealTimeUserProvider user={user}>
					<RealTimeCompanyConsultantsProvider consultants={consultants}>
						<RealTimeItemsProvider items={items}>
							<AppShell>{children}</AppShell>
						</RealTimeItemsProvider>
					</RealTimeCompanyConsultantsProvider>
				</RealTimeUserProvider>
			</GlobalStoreProvider>
		</AuthWrapper>
	);
}
