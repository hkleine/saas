import { Pricing } from '@/app/components/Pricing/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';

export default async function Billing() {
  const products = await getActiveProductsWithPrices();

  return <Pricing products={products} />;
}
