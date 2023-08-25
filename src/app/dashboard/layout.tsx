import {
	getCompanyItems,
	getConsultantDeals,
	getConsultants,
	getSubscriptionsWithPriceAndProduct,
	getUser,
} from '@/utils/supabase-server';
import { PropsWithChildren } from 'react';
import 'server-only';
import AppShell from '../components/AppShell/AppShell';
import AuthWrapper from '../components/Auth/AuthWrapper';
import { GlobalStoreProvider } from '../components/Provider/GlobalStoreProvider';
import { RealTimeCompanyConsultantsProvider } from '../components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeItemsProvider } from '../components/Provider/RealTimeItemsProvider';
import { RealTimeUserProvider } from '../components/Provider/RealTimeUserProvider';

export default async function DashboardLayout({ children }: PropsWithChildren) {
	const consultants = await getConsultants();
	const user = await getUser();
	const items = await getCompanyItems();
	const subscription = await getSubscriptionsWithPriceAndProduct();
	const deals = await getConsultantDeals();

	if (!user || !consultants || !items) return null;

	return (
		<AuthWrapper>
			<GlobalStoreProvider
				subscription={subscription}
				consultants={consultants}
				user={user}
				items={items}
				deals={deals}>
				<RealTimeUserProvider user={user}>
					<RealTimeCompanyConsultantsProvider>
						<RealTimeItemsProvider>
							<AppShell>{children}</AppShell>
						</RealTimeItemsProvider>
					</RealTimeCompanyConsultantsProvider>
				</RealTimeUserProvider>
			</GlobalStoreProvider>
		</AuthWrapper>
	);
}
