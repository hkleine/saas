'use client';
import { getConsultantDeals, subscribeToDeals, supabase } from '@/utils/supabase-client';
import { ReactNode, useEffect } from 'react';
import { useGlobalStateContext } from './GlobalStoreProvider';

export function RealTimeItemsProvider({ children }: { children?: ReactNode }) {
	const setDeals = useGlobalStateContext((s) => s.setDeals);
	const user = useGlobalStateContext((s) => s.user);

	useEffect(() => {
		if (!user?.id) return;
		const channel = subscribeToDeals(user.id, async () => {
			console.log('deals changed');
			const deals = await getConsultantDeals();
			setDeals(deals);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [user]);

	return <div>{children}</div>;
}
