import { Pricing } from '@/app/components/Pricing/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { getPaymentMethod } from '@/utils/supabase-server';
import 'server-only';

export default async function Billing() {
	const products = await getActiveProductsWithPrices();
	const paymentMethod = await getPaymentMethod();

	return <Pricing products={products} paymentMethod={paymentMethod} />;
}
