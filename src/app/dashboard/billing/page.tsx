'server only';
import { Pricing } from '@/app/components/Pricing/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { getPaymentMethod, getSubscriptionsWithPriceAndProduct } from '@/utils/supabase-server';

export default async function Billing() {
  const products = await getActiveProductsWithPrices();
  const subscription = await getSubscriptionsWithPriceAndProduct();
  const paymentMethod = await getPaymentMethod();

  return <Pricing products={products} subscription={subscription} paymentMethod={paymentMethod} />;
}
