'server only';
import { Pricing } from '@/app/components/Pricing/Pricing';
import { SubscriptionWithPriceAndProduct } from '@/types/types';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { createClient } from '@/utils/supabase-server';

export default async function Billing() {
  const products = await getActiveProductsWithPrices();
  const subscription = await getSubscriptionsWithPriceAndProduct();

  return <Pricing products={products} subscription={subscription} />;
}

async function getSubscriptionsWithPriceAndProduct(): Promise<SubscriptionWithPriceAndProduct | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('subscriptions').select('*, prices(*, products(*))').limit(1).single();
  if (error) {
    console.log(error.message);
  }
  return data as any;
}
