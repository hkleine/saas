'use client';
import { UserWithEmail } from '@/types/types';
import { getRoles, subscribeToUser, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const RealTimeUserContext = createContext<UserWithEmail | null>(null);

export function RealTimeUserProvider({ children, user }: { children?: ReactNode; user: UserWithEmail | null }) {
  const [realTimeUser, setRealTimeUser] = useState<UserWithEmail | null>(user);

  useEffect(() => {
    const channel = subscribeToUser(user!.id, async payload => {
      const { data: authData, error: authUserError } = await supabase.auth.getUser();

      if (authUserError) {
        console.log(authUserError.message);
        return null;
      }

      const roles = await getRoles();

      if (!roles) {
        return null;
      }

      const role = roles.find(role => role.id === payload.new.role)!;

      setRealTimeUser({ ...payload.new, role: role, email: authData.user.email });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return <RealTimeUserContext.Provider value={realTimeUser}>{children}</RealTimeUserContext.Provider>;
}
