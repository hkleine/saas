import { createBrowserSupabaseClient, User } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../types/supabase';
import { ProductWithPrice, SubscriptionWithPriceAndProduct, UserWithEmail } from '../types/types';

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

export const updateUserName = async (user: User | UserWithEmail, name: string) => {
  return supabase
    .from('users')
    .update({
      full_name: name,
    })
    .eq('id', user.id);
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

export async function deleteFile({ filePath }: { filePath: string }) {
  return supabase.storage.from('avatars').remove([filePath]);
}
