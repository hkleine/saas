import { getUser } from '@/utils/supabase-server';
import { ReactNode } from 'react';
import 'server-only';
import AppShell from '../components/AppShell/AppShell';
import AuthWrapper from '../components/Auth/AuthWrapper';
import { RealTimeUserProvider } from '../components/Provider/RealTimeUserProvider';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // This is giving outdated data from time to time
  const user = await getUser();

  return (
    <AuthWrapper>
      <RealTimeUserProvider user={user}>
        <AppShell>{children}</AppShell>
      </RealTimeUserProvider>
    </AuthWrapper>
  );
}
