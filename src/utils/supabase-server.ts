import {
  ConsultantWithCurrentEarning,
  DatabaseConsultant,
  DatabaseEarnings,
  Roles,
  SubscriptionWithPriceAndProduct,
  UserWithEmail,
} from '@/types/types';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { isNil, omit } from 'lodash';
import { cookies, headers } from 'next/headers';
import Stripe from 'stripe';
import { DatabaseUser } from './../types/types';

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
    .select('*, consultants!consultants_id_fkey(*), role(name)')
    .eq('id', authData.user.id)
    .limit(1)
    .single();

  if (error) {
    console.log(error.message);
    return null;
  }
  return { ...data, email: authData.user.email } as any;
}

function convertConsultant(consultantData: any): Array<ConsultantWithCurrentEarning> {
  return consultantData.map(
    (consultant: DatabaseConsultant & { users: DatabaseUser; earnings: Array<DatabaseEarnings> }) => {
      const { name, role } = consultant.users;
      const currentMonthsEarning = consultant.earnings.find(earning => {
        const earningDate = new Date(earning.date);
        const now = new Date();
        return earningDate.getMonth() === now.getMonth();
      })!;

      return {
        ...omit(consultant, ['users', 'earnings']),
        name,
        role,
        currentEarning: { value: currentMonthsEarning.value, id: currentMonthsEarning.id },
      };
    }
  );
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
    .select('*, earnings(*), users!consultants_id_fkey(name, role:role(*))')
    .eq('company_id', companyId);

  if (error) {
    console.log(error.message);
    return null;
  }

  const consultant = convertConsultant(data);

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
