'server only';
import { getUser } from '@/utils/supabase-server';
import { ReactNode } from 'react';
import AppShell from '../components/AppShell/AppShell';
import AuthWrapper from '../components/Auth/AuthWrapper';
import { RealTimeUserProvider } from '../components/Provider/RealTimeUserProvider';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <AuthWrapper>
      <RealTimeUserProvider user={user}>
        <AppShell>{children}</AppShell>
      </RealTimeUserProvider>
    </AuthWrapper>
  );
}
