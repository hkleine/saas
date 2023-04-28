import { ReactNode } from 'react';
import 'server-only';
import AppShell from '../components/AppShell/AppShell';
import AuthWrapper from '../components/Auth/AuthWrapper';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthWrapper>
      <AppShell>{children}</AppShell>
    </AuthWrapper>
  );
}
