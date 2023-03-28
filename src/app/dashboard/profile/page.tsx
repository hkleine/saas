import ProfileForm from '@/app/components/Forms/ProfileForm';
import { downloadImage, getUser } from '@/utils/supabase-server';

export default async function Profile() {
  const user = await getUser();
  const avatar = await downloadImage(user?.avatar_url ?? '');
  return <ProfileForm user={user} avatar={avatar} />;
}
