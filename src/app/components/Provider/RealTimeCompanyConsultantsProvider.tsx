'use client';
import { getCompanyId } from '@/utils/getCompanyId';
import { getConsultants, subscribeToCompanyEarnings, subscribeToCompanyUsers, supabase } from '@/utils/supabase-client';
import { ReactNode, useEffect } from 'react';
import { useGlobalStateContext } from './GlobalStoreProvider';

export function RealTimeCompanyConsultantsProvider({ children }: { children?: ReactNode }) {
	const setConsultants = useGlobalStateContext((s) => s.setConsultants);
	const user = useGlobalStateContext((s) => s.user);
	const stateConsultants = useGlobalStateContext((s) => s.consultants);
	const stateItems = useGlobalStateContext((s) => s.items);

	const companyId = getCompanyId(user);

	useEffect(() => {
		if (!companyId) return;

		const channel = subscribeToCompanyUsers(companyId, async () => {
			const consultants = await getConsultants();
			setConsultants(consultants);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	useEffect(() => {
		const consultants = stateConsultants;
		const consultantIds = consultants.map((consultant) => consultant.id);

		const earningsChannel = subscribeToCompanyEarnings(consultantIds, async (payload) => {
			console.log('new earning');
			const newConsultants = consultants.map((consultant) => {
				if (consultant.id === payload.new.consultant_id) {
					const item = stateItems.find((stateItem) => stateItem.id === payload.new.item_id);
					return {
						...consultant,
						item: item,
						earnings: [...consultant.earnings, payload.new],
					};
				}

				return consultant;
			});

			setConsultants(newConsultants);
		});

		return () => {
			supabase.removeChannel(earningsChannel);
		};
	}, [stateConsultants]);

	return <div>{children}</div>;
}
