import Consultants from '@/app/components/Consultants/Consultants';
import { getConsultants, getRoles } from '@/utils/supabase-server';

export default async function Settings() {
  const consultants = await getConsultants();
  const roles = await getRoles();

  return (
    <div>
      <Consultants consultants={consultants} roles={roles}/>
    </div>
  );
}
