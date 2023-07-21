'use client';
import { ConsultantWithEarnings } from '@/types/types';
import { getCompanyId } from '@/utils/getCompanyId';
import { getConsultants, subscribeToCompanyEarnings, subscribeToCompanyUsers, supabase } from '@/utils/supabase-client';
import { ReactNode, useEffect } from 'react';
import { useGlobalStateContext } from './GlobalStoreProvider';

export function RealTimeCompanyConsultantsProvider({
	children,
	consultants,
}: {
	children?: ReactNode;
	consultants: Array<ConsultantWithEarnings>;
}) {
	const setConsultants = useGlobalStateContext((s) => s.setConsultants);
	const user = useGlobalStateContext((s) => s.user);
	const stateConsultants = useGlobalStateContext((s) => s.consultants);

	const companyId = getCompanyId(user);

	useEffect(() => {
		if (!companyId) return;

		const channel = subscribeToCompanyUsers(companyId, async () => {
			console.log('consultants changed');
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
					return {
						...consultant,
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
