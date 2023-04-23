import ConsultantsContainer from '@/app/components/Consultants/ConsultantsContainer';
import { getConsultants, getRoles } from '@/utils/supabase-server';

export default async function Settings() {
  const roles = await getRoles();
  const consultants = await getConsultants();
  if (!roles) {
    return null;
  }

  return <ConsultantsContainer roles={roles} consultants={consultants} />;
}
