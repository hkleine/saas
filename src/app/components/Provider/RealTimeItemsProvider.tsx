'use client';
import { Item } from '@/types/types';
import { getCompanyId } from '@/utils/getCompanyId';
import { getCompanyItems, subscribeToItems, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RealTimeUserContext } from './RealTimeUserProvider';

export const RealTimeItemsContext = createContext<Array<Item> | null>(null);

export function RealTimeItemsProvider({ children, items }: { children?: ReactNode; items: Array<Item> | null }) {
	const [realTimeItems, setRealTimeItems] = useState<Array<Item> | null>(items);
	const user = useContext(RealTimeUserContext);
	const companyId = getCompanyId(user!)!;

	useEffect(() => {
		const channel = subscribeToItems(companyId, async () => {
			console.log('items changed');
			const items = await getCompanyItems();
			setRealTimeItems(items);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	return <RealTimeItemsContext.Provider value={realTimeItems}>{children}</RealTimeItemsContext.Provider>;
}
