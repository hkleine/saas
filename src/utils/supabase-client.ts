import { Database } from '@/types/supabase';
import { createBrowserSupabaseClient, User } from '@supabase/auth-helpers-nextjs';
import {
	ConsultantWithCurrentEarning,
	ProductWithPrice,
	Roles,
	SubscriptionWithPriceAndProduct,
	UserWithEmail
} from '../types/types';
import { convertConsultants } from './convertConsultant';
import { getCompanyId } from './getCompanyId';

export const supabase = createBrowserSupabaseClient<Database>({
	supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
	supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export const getSubscriptionsWithPriceAndProduct = async (): Promise<SubscriptionWithPriceAndProduct | null> => {
	const { data, error } = await supabase.from('subscriptions').select('*, prices(*, products(*))').limit(1).single();

	if (error) {
		console.log(error.message);
	}

	return data as any;
};

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
	const { data, error } = await supabase
		.from('products')
		.select('*, prices(*)')
		.eq('active', true)
		.eq('prices.active', true)
		.order('metadata->index')
		.order('unit_amount', { foreignTable: 'prices' });

	if (error) {
		console.log(error.message);
	}
	// TODO: improve the typing here.
	return (data as any) || [];
};

export const getPaymentMethod = async (user: User) => {
	const { data, error } = await supabase.from('users').select('payment_method').eq('id', user.id);
	if (error) {
		console.log(error.message);
		return null;
	}

	return data as any;
};

export const updateUserName = async (id: string, name: string) => {
	return supabase
		.from('users')
		.update({
			name,
		})
		.eq('id', id);
};

export const updateConsultantPercent = async (id: string, percent: number) => {
	return supabase
		.from('consultants')
		.update({
			percent,
		})
		.eq('id', id);
};

export const updateUserRole = async (id: string, role: number) => {
	return supabase
		.from('users')
		.update({
			role,
		})
		.eq('id', id);
};

export const updateConsultantUpline = async (id: string, newUpline: string) => {
	console.log(id, newUpline);
	return supabase
		.from('consultants')
		.update({
			upline: newUpline,
		})
		.eq('id', id);
};

export const updateUserEmail = async (user: User | UserWithEmail, email: string) => {
	return supabase.auth.updateUser({
		email,
	});
};

export const updateAvatarUrl = async (user: User | UserWithEmail, filePath: string | null) => {
	return supabase
		.from('users')
		.update({
			avatar_url: filePath,
		})
		.eq('id', user.id);
};

export async function uploadFile({ filePath, file }: { file: File; filePath: string }) {
	return supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
}

export async function createSignedImageUrl(filePath: string) {
	return supabase.storage.from('avatars').createSignedUrl(filePath, 60);
}

export async function deleteFile({ filePath }: { filePath: string }) {
	return supabase.storage.from('avatars').remove([filePath]);
}

export function subscribeToUser(userId: string, callback: (paylod: { [key: string]: any }) => void) {
	return supabase
		.channel('user-changes')
		.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` }, callback)
		.subscribe();
}

export function subscribeToCompanyUsers(companyId: string, callback: (paylod: { [key: string]: any }) => void) {
	return supabase
		.channel('consultant-changes')
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'consultants', filter: `company_id=eq.${companyId}` },
			callback,
		)
		.subscribe();
}

export function subscribeToCompanyEarnings(
	consultantIds: Array<string>,
	callback: (paylod: { [key: string]: any }) => void,
) {
	return supabase
		.channel('earning-changes')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'earnings',
				filter: `consultant_id=in.(${consultantIds.toString()})`,
			},
			callback,
		)
		.subscribe();
}

export async function getUser(): Promise<UserWithEmail | null> {
	const { data: authData, error: authUserError } = await supabase.auth.getUser();

	if (authUserError) {
		console.log(authUserError.message);
		return null;
	}
	const { data, error } = await supabase
		.from('users')
		.select('*, consultants!consultants_id_fkey(*), role(*)')
		.eq('id', authData.user.id)
		.limit(1)
		.single();

	if (error) {
		console.log(error.message);
		return null;
	}
	return { ...data, email: authData.user.email } as any;
}

export async function getConsultants(): Promise<Array<ConsultantWithCurrentEarning> | null> {
	const user = await getUser();

	if (!user) {
		return null;
	}
	const companyId = getCompanyId(user);

	const { data, error } = await supabase
		.from('consultants')
		.select('*, earnings(*), users!consultants_id_fkey(*, role:role(*))')
		.or(`company_id.eq.${companyId},id.eq.${companyId}`);

	if (error) {
		console.log(error.message);
		return null;
	}

	const consultant = convertConsultants({ consultantData: data, user });

	return consultant;
}

export async function updateCurrentEarning({ id, newValue }: { id: string; newValue: string }) {
	const now = new Date();
	const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).toISOString();
	const { error } = await supabase
		.from('earnings')
		.update({ value: Number(newValue) })
		.eq('consultant_id', id)
		.gte('date', firstDayOfMonth);
	if (error) throw error;
	return null;
}

export async function getRoles(): Promise<Roles | null> {
	const { data, error } = await supabase.from('roles').select('*');
	if (error) {
		console.log(error.message);
		return null;
	}

	return data as any;
}
