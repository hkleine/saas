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
				deleteAllCookies();
				router.push('/login');
			}
		});
	}, [router, supabaseClient.auth]);

	return <>{children}</>;
}

function deleteAllCookies() {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf('=');
		const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}
