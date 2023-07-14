import ConsultantsContainer from '@/app/components/Consultants/ConsultantsContainer';
import { getRoles } from '@/utils/supabase-server';
export const revalidate = 0;
export default async function Berater() {
	const roles = await getRoles();

	if (!roles) {
		return null;
	}

	return <ConsultantsContainer roles={roles} />;
}
