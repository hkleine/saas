'use client';
import { ConsultantWithEarnings } from '@/types/types';
import { getCompanyId } from '@/utils/getCompanyId';
import { getConsultants, subscribeToCompanyEarnings, subscribeToCompanyUsers, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RealTimeUserContext } from './RealTimeUserProvider';

export const RealTimeCompanyConsultantsContext = createContext<Array<ConsultantWithEarnings> | null>(null);

export function RealTimeCompanyConsultantsProvider({
	children,
	consultants,
}: {
	children?: ReactNode;
	consultants: Array<ConsultantWithEarnings> | null;
}) {
	const [realtimeConsultants, setRealtimeConsultants] = useState<Array<ConsultantWithEarnings> | null>(consultants);
	const user = useContext(RealTimeUserContext);
	const companyId = getCompanyId(user)!;

	useEffect(() => {
		if (!user || !companyId) return;
		const channel = subscribeToCompanyUsers(companyId, async () => {
			console.log('consultants changed');
			const consultants = await getConsultants();
			setRealtimeConsultants(consultants);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	useEffect(() => {
		const consultants = realtimeConsultants ?? [];
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
			console.log(newConsultants);
			setRealtimeConsultants(newConsultants);
		});

		return () => {
			supabase.removeChannel(earningsChannel);
		};
	}, [realtimeConsultants]);

	return (
		<RealTimeCompanyConsultantsContext.Provider value={realtimeConsultants}>
			{children}
		</RealTimeCompanyConsultantsContext.Provider>
	);
}
