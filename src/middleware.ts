import { NextResponse } from 'next/server';

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { Database } from './types/supabase';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Forward to protected route if we have a session
	if (session) {
		return res;
	}

	// Auth condition not met, redirect to login page.
	const loginUrl = new URL('/login', req.url);
	return NextResponse.redirect(loginUrl);
}
export const config = {
	matcher: ['/dashboard/:path*'],
};
