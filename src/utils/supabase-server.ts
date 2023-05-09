import { ConsultantWithCurrentEarning, Roles, SubscriptionWithPriceAndProduct, UserWithEmail } from '@/types/types';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { isNil } from 'lodash';
import { cookies, headers } from 'next/headers';
import Stripe from 'stripe';
import { convertConsultant } from './convertConsultant';

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
  const supabase = createClient();

  const user = await getUser();

  if (!user) {
    return null;
  }
  const companyId = isNil(user.consultants) ? user.id : user.consultants.company_id;

  const { data, error } = await supabase
    .from('consultants')
    .select('*, earnings(*), users!consultants_id_fkey(*, role:role(*))')
    .eq('company_id', companyId);

  if (error) {
    console.log(error.message);
    return null;
  }

  const consultant = convertConsultant({ consultantData: data, user });

  return consultant;
}

export async function getRoles(): Promise<Roles | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('roles').select('*').neq('id', 0);
  if (error) {
    console.log(error.message);
    return null;
  }

  return data as any;
}
