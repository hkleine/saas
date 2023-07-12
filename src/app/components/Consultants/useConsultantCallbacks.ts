import { ConsultantWithEarnings } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { hasTargetLowerReveneuShare } from '@/utils/hasTargetLowerReveneuShare';
import { isTargetADownline } from '@/utils/isTargetADownline';
import { updateConsultantUpline } from '@/utils/supabase-client';
import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

export function useConsultantCallbacks({ consultants }: { consultants: Array<ConsultantWithEarnings> | null }) {
	const toast = useToast();

	return {
		onConnect: useCallback(
			async ({ source, target }: { source: string | null; target: string | null }) => {
				if (!source || !target || !consultants) return;
				const isADownlineOfSource = isTargetADownline({ source, target, otherConsultants: consultants });
				const isDisallowedByReveneuShare = hasTargetLowerReveneuShare({
					source,
					target,
					otherConsultants: consultants,
				});

				if (isDisallowedByReveneuShare) {
					toast(
						createToastSettings({
							title: 'Verbindung fehlgeschlagen',
							description: 'Ziel Berater hat weniger Umsatzbeteiligung.',
							status: 'error',
						}),
					);
					return;
				}

				if (isADownlineOfSource) {
					toast(
						createToastSettings({
							title: 'Verbindung fehlgeschlagen',
							description: 'Kreisförmige Verbindungen sind nicht möglich',
							status: 'error',
						}),
					);
					return;
				}

				await updateConsultantUpline(target, source);
			},
			[consultants],
		),
	};
}
