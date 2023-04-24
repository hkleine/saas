import ConsultantsContainer from '@/app/components/Consultants/ConsultantsContainer';
import { getConsultants, getRoles } from '@/utils/supabase-server';
export const revalidate = 0;
export default async function Berater() {
  const roles = await getRoles();
  const consultants = await getConsultants();
  if (!roles) {
    return null;
  }

  return <ConsultantsContainer roles={roles} consultants={consultants} />;
}
