import ConsultantsContainer from '@/app/components/Consultants/ConsultantsContainer';
import { RealTimeCompanyConsultantsProvider } from '@/app/components/Provider/RealTimeCompanyConsultantsProvider';
import { RealTimeItemsProvider } from '@/app/components/Provider/RealTimeItemsProvider';
import { getCompanyItems, getConsultants, getRoles } from '@/utils/supabase-server';
export const revalidate = 0;
export default async function Berater() {
	const roles = await getRoles();
	const consultants = await getConsultants();
	const items = await getCompanyItems();

	if (!roles) {
		return null;
	}

	return (
		<RealTimeCompanyConsultantsProvider consultants={consultants}>
			<RealTimeItemsProvider items={items}>
				<ConsultantsContainer roles={roles} />
			</RealTimeItemsProvider>
		</RealTimeCompanyConsultantsProvider>
	);
}
