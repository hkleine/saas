import { SubscriptionWithPriceAndProduct, UserWithEmail } from '@/types/types';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import Stripe from 'stripe';

export const createClient = () =>
  createServerComponentSupabaseClient({
    headers,
    cookies,
  });

export async function getSubscriptionsWithPriceAndProduct(): Promise<SubscriptionWithPriceAndProduct | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('subscriptions').select('*, prices(*, products(*))').limit(1).single();
  if (error) {
    console.log(error.message);
  }
  return data as any;
}

export async function getPaymentMethod(): Promise<Stripe.PaymentMethod['card'] | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('payment_method').limit(1).single();

  if (error) {
    console.log(error.message);
    return null;
  }
  return data.payment_method as any;
}

export async function getUser(): Promise<UserWithEmail | null> {
  const supabase = createClient();
  const { data: authData, error: authUserError } = await supabase.auth.getUser();

  if (authUserError) {
    console.log(authUserError.message);
    return null;
  }

  const { data, error } = await supabase.from('users').select('*').limit(1).single();
  if (error) {
    console.log(error.message);
    return null;
  }
  return { ...data, email: authData.user.email } as any;
}

export async function downloadImage(path: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from('avatars').download(path);

  if (error) {
    console.log(error);
    return null;
  }
  const url = URL.createObjectURL(data);
  console.log(url);
  return url;
}
