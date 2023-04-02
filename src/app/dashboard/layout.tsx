import { getUser } from '@/utils/supabase-server';
import { ReactNode } from 'react';
import AuthWrapper from '../components/Auth/AuthWrapper';
import Sidebar from '../components/Sidebar/Sidebar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  console.log(user);
  return (
    <AuthWrapper>
      <Sidebar user={user}>{children}</Sidebar>
    </AuthWrapper>
  );
}
