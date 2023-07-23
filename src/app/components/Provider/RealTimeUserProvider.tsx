'use client';
import { UserWithEmail } from '@/types/types';
import { getRoles, subscribeToUser, supabase } from '@/utils/supabase-client';
import { ReactNode, useEffect } from 'react';
import { useGlobalStateContext } from './GlobalStoreProvider';

export function RealTimeUserProvider({ children, user }: { children?: ReactNode; user: UserWithEmail }) {
	const setUser = useGlobalStateContext((s) => s.setUser);

	useEffect(() => {
		const channel = subscribeToUser(user.id, async (payload) => {
			const { data: authData, error: authUserError } = await supabase.auth.getUser();

			if (authUserError) {
				return null;
			}

			const roles = await getRoles();

			if (!roles) {
				return null;
			}

			const role = roles.find((role) => role.id === payload.new.role)!;

			setUser({ ...payload.new, role: role, email: authData.user.email });
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [user]);

	return <div>{children}</div>;
}
