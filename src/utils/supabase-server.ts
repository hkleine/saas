import { Ausbilder, Azubi, Consultant, Overhead, Roles, SubscriptionWithPriceAndProduct, UserWithEmail } from '@/types/types';
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

  const { data, error } = await supabase.from('users u').select('*, consultant').limit(1).single();
  console.log(data, error)
  if (error) {
    console.log(error.message);
    return null;
  }
  return { ...data, email: authData.user.email } as any;
}

export async function getConsultants(): Promise<Array<Overhead> | null> {
  const supabase = createClient();
  const { data: azubis, error: azubisError } = await supabase.from('consultants').select('*, role(name)').eq('role', 3);
  if (azubisError) {
    console.log(azubisError.message);
    return null;
  }

  const { data: ausbilderData, error: ausbilderError } = await supabase
    .from('consultants')
    .select('*, role(name)')
    .eq('role', 2);
  if (ausbilderError) {
    console.log(ausbilderError.message);
    return null;
  }

  const { data: overheadsData, error: overheadError } = await supabase
    .from('consultants')
    .select('*, role(name)')
    .eq('role', 1);
  if (overheadError) {
    console.log(overheadError.message);
    return null;
  }

  const ausbilder: Array<Ausbilder> = (azubis as Array<Azubi>).reduce<Array<Ausbilder>>(
    (previousAusbilder, currentAzubi) => {
      const ausbilderIndex = previousAusbilder.findIndex(prevAusbilder => {
        return prevAusbilder.id === currentAzubi.upline;
      });
      if (!previousAusbilder[ausbilderIndex]) {
        return previousAusbilder;
      }
      previousAusbilder[ausbilderIndex].downlineEarnings =
        previousAusbilder[ausbilderIndex].downlineEarnings +
        calculateDownlineEarnings(previousAusbilder[ausbilderIndex], currentAzubi);

      if ('downlines' in previousAusbilder[ausbilderIndex]) {
        previousAusbilder[ausbilderIndex].downlines.push(currentAzubi);
        return previousAusbilder;
      }

      previousAusbilder[ausbilderIndex].downlines = [currentAzubi];
      return previousAusbilder;
    },
    (ausbilderData as Array<Ausbilder>).map(ausbilder => {
      ausbilder.downlineEarnings = 0;
      return ausbilder;
    })
  );

  const overheads: Array<Overhead> = ausbilder.reduce<Array<Overhead>>(
    (previousOverhead, currentAusbilder) => {
      const overheadIndex = previousOverhead.findIndex(prevAusbilder => {
        return prevAusbilder.id === currentAusbilder.upline;
      });
      if (!previousOverhead[overheadIndex]) {
        return previousOverhead;
      }

      previousOverhead[overheadIndex].downlineEarnings =
        previousOverhead[overheadIndex].downlineEarnings +
        calculateDownlineEarnings(previousOverhead[overheadIndex], currentAusbilder);

      if ('downlines' in previousOverhead[overheadIndex]) {
        previousOverhead[overheadIndex].downlines.push(currentAusbilder);
        return previousOverhead;
      }

      previousOverhead[overheadIndex].downlines = [currentAusbilder];
      return previousOverhead;
    },
    (overheadsData as Array<Overhead>).map(overhead => {
      overhead.downlineEarnings = 0;
      return overhead;
    })
  );

  return overheads as any;
}

function calculateDownlineEarnings(upline: Consultant, downline: Consultant) {
  const percentageDifference = upline.percent - downline.percent;
  return (downline.earnings / 100) * percentageDifference;
}

export async function getRoles(): Promise<Roles | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('roles').select('*').neq('id', 0);
  if (error) {
    console.log(error.message);
    return null;
  }

  return  data as any;
}
