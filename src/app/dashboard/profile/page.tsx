import ProfileForm from '@/app/components/Forms/ProfileForm';
import { getUser } from '@/utils/supabase-server';

export default async function Profile() {
  const user = await getUser();
  console.log(user);
  return <ProfileForm user={user} />;
}
