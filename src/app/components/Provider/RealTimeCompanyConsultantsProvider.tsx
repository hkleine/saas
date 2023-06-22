'use client';
import { ConsultantWithCurrentEarning } from '@/types/types';
import { getCompanyId } from '@/utils/getCompanyId';
import { getConsultants, subscribeToCompanyEarnings, subscribeToCompanyUsers, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RealTimeUserContext } from './RealTimeUserProvider';

export const RealTimeCompanyConsultantsContext = createContext<Array<ConsultantWithCurrentEarning> | null>(null);

export function RealTimeCompanyConsultantsProvider({
	children,
	consultants,
}: {
	children?: ReactNode;
	consultants: Array<ConsultantWithCurrentEarning> | null;
}) {
	const [realtimeConsultants, setRealtimeConsultants] = useState<Array<ConsultantWithCurrentEarning> | null>(
		consultants,
	);
	const user = useContext(RealTimeUserContext);
	const companyId = getCompanyId(user!)!;

	useEffect(() => {
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
		const consultantIds = realtimeConsultants!.map((consultant) => consultant.id);

		const earningsChannel = subscribeToCompanyEarnings(consultantIds, async (payload) => {
			const newConsultants = realtimeConsultants!.map((consultant) => {
				if (consultant.id === payload.new.consultant_id) {
					return { ...consultant, currentEarning: { ...consultant.currentEarning, value: payload.new.value } };
				}

				return consultant;
			});
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
