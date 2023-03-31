import ProfileForm from '@/app/components/Forms/ProfileForm';
import { getUser } from '@/utils/supabase-server';

export default async function Profile() {
  const user = await getUser();
  return <ProfileForm user={user} />;
}
