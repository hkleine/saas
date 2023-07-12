import { stripe } from '@/utils/stripe';
import { createClient } from '@/utils/supabase-server';
import { NextRequest } from 'next/server';
import { getURL } from '../../../utils/helpers';
import { createOrRetrieveCustomer } from '../../../utils/supabase-admin';

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

export async function POST(req: NextRequest) {
	const supabase = createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return new Response('Not authenticated', {
			status: 401,
		});
	}

	try {
		const jsonReq = await req.json();
		const { price, quantity = 1, metadata = {} } = jsonReq;
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) throw Error('Could not get user');

		const customer = await createOrRetrieveCustomer({
			uuid: user.id,
			email: user.email || '',
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			billing_address_collection: 'required',
			customer,
			line_items: [
				{
					price: price.id,
					quantity,
				},
			],
			mode: 'subscription',
			allow_promotion_codes: true,
			subscription_data: {
				trial_from_plan: true,
				metadata,
			},
			success_url: `${getURL()}/dashboard/billing`,
			cancel_url: `${getURL()}/dashboard/billing`,
		});

		return new Response(JSON.stringify({ sessionId: session.id }), {
			status: 200,
		});
	} catch (err: any) {
		console.log(err);
		return new Response(err.message, {
			status: 500,
		});
	}
}
