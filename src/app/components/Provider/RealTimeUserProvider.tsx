import { UserWithEmail } from '@/types/types';
import { getUser, subscribeToUser, supabase } from '@/utils/supabase-client';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const RealTimeUserContext = createContext<UserWithEmail | null>(null);

export function RealTimeUserProvider({ children }: { children?: ReactNode }) {
  const [realTimeUser, setRealTimeUser] = useState<UserWithEmail | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      setRealTimeUser(fetchedUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const channel = subscribeToUser(async payload => {
      const { data: authData, error: authUserError } = await supabase.auth.getUser();

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
