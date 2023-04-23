'use client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && !session) {
        router.push('/login');
      }
      if (event === 'SIGNED_IN' && !session) {
        router.push('/dashboard');
      }
    });
  }, []);

  return <>{children}</>;
}
