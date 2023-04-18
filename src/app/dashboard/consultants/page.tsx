import Consultants from '@/app/components/Consultants/Consultants';
import { getConsultants } from '@/utils/supabase-server';

export default async function Settings() {
  const consultants = await getConsultants();

  return (
    <div>
      <Consultants consultants={consultants} />
    </div>
  );
}
