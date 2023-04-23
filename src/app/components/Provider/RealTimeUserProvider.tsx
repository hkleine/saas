'use client';
import { UserWithEmail } from '@/types/types';
import { subscribeToUser, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const RealTimeUserContext = createContext<UserWithEmail | null>(null);

export function RealTimeUserProvider({ children, user }: { children?: ReactNode; user: UserWithEmail | null }) {
  const [realTimeUser, setRealTimeUser] = useState<UserWithEmail | null>(user);
  console.log('realTimeUser', realTimeUser);
  useEffect(() => {
    const channel = subscribeToUser(async payload => {
      const { data: authData, error: authUserError } = await supabase.auth.getUser();
      console.log(authData);
      if (authUserError) {
        console.log(authUserError.message);
        return null;
      }

      setRealTimeUser({ ...payload.new, email: authData.user.email });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return <RealTimeUserContext.Provider value={realTimeUser}>{children}</RealTimeUserContext.Provider>;
}
