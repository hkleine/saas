'use client';
import { getCompanyId } from '@/utils/getCompanyId';
import { getCompanyItems, subscribeToItems, supabase } from '@/utils/supabase-client';
import { ReactNode, useEffect } from 'react';
import { useGlobalStateContext } from './GlobalStoreProvider';

export function RealTimeItemsProvider({ children }: { children?: ReactNode }) {
	const setItems = useGlobalStateContext((s) => s.setItems);
	const user = useGlobalStateContext((s) => s.user);
	const companyId = getCompanyId(user);

	useEffect(() => {
		if (!companyId) return;
		const channel = subscribeToItems(companyId, async () => {
			console.log('items changed');
			const items = await getCompanyItems();
			setItems(items);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	return <div>{children}</div>;
}
