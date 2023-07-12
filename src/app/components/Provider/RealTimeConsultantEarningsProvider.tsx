'use client';
import { DatabaseEarnings } from '@/types/types';
import { getCompanyId } from '@/utils/getCompanyId';
import { getConsultantEarnings, subscribeToCompanyEarnings, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RealTimeUserContext } from './RealTimeUserProvider';

export const RealTimeConsultantEarningsContext = createContext<Array<DatabaseEarnings> | null>(null);

export function RealTimeConsultantEarningsProvider({
	children,
	consultantEarnings,
}: {
	children?: ReactNode;
	consultantEarnings: Array<DatabaseEarnings> | null;
}) {
	const [realTimeEarnings, setRealTimeEarnings] = useState<Array<DatabaseEarnings> | null>(consultantEarnings);
	const user = useContext(RealTimeUserContext);
	const companyId = getCompanyId(user!)!;

	useEffect(() => {
		const channel = subscribeToCompanyEarnings([user!.id], async () => {
			console.log('consultant earnings changed');
			const earnings = await getConsultantEarnings();
			setRealTimeEarnings(earnings);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId]);

	return (
		<RealTimeConsultantEarningsContext.Provider value={realTimeEarnings}>
			{children}
		</RealTimeConsultantEarningsContext.Provider>
	);
}
