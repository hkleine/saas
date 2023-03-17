import { ReactNode } from 'react';
import AuthWrapper from '../components/Auth/AuthWrapper';
import Sidebar from '../components/Sidebar/Sidebar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthWrapper>
      <Sidebar>{children}</Sidebar>
    </AuthWrapper>
  );
}
