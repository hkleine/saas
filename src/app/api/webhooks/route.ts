import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '../../../utils/stripe';
import {
	manageSubscriptionStatusChange,
	removeSubscription,
	upsertPriceRecord,
	upsertProductRecord,
} from '../../../utils/supabase-admin';

// Stripe requires the raw body to construct the event.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

async function buffer(body: ReadableStream<Uint8Array>) {
	const chunks = [];
	const reader = body!.getReader();

	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		chunks.push(typeof value === 'string' ? Buffer.from(value) : value);
	}
	return Buffer.concat(chunks);
}

const relevantEvents = new Set([
	'product.created',
	'product.updated',
	'price.created',
	'price.updated',
	'checkout.session.completed',
	'customer.subscription.created',
	'customer.subscription.updated',
	'customer.subscription.deleted',
]);

export async function POST(req: NextRequest) {
	const body = req.body;
	const buf = await buffer(body!);
	const sig = req.headers.get('stripe-signature');
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
	let event: Stripe.Event;

	try {
		if (!sig || !webhookSecret) return;
		event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
	} catch (err: any) {
		console.log(`❌ Error message: ${err.message}`);
		return new Response(`Webhook Error: ${err.message}`, {
			status: 400,
		});
	}

	if (relevantEvents.has(event.type)) {
		try {
			switch (event.type) {
				case 'product.created':
				case 'product.updated':
					await upsertProductRecord(event.data.object as Stripe.Product);
					break;
				case 'price.created':
				case 'price.updated':
					await upsertPriceRecord(event.data.object as Stripe.Price);
					break;
				case 'customer.subscription.created':
				case 'customer.subscription.updated':
					const subscription = event.data.object as Stripe.Subscription;
					await manageSubscriptionStatusChange(
						subscription.id,
						subscription.customer as string,
						event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated',
					);
					break;
				case 'customer.subscription.deleted':
					const { id } = event.data.object as Stripe.Subscription;
					await removeSubscription(id);
					break;
				case 'checkout.session.completed':
					const checkoutSession = event.data.object as Stripe.Checkout.Session;
					if (checkoutSession.mode === 'subscription') {
						const subscriptionId = checkoutSession.subscription;
						await manageSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string, true);
					}
					break;
				// case 'payment_method.attached':
				// case 'payment_method.detached':
				// case 'payment_method.updated':
				default:
					throw new Error('Unhandled relevant event!');
			}
		} catch (error) {
			console.log(error);
			return new Response('Webhook error: "Webhook handler failed. View logs."', {
				status: 400,
			});
		}
	}

	return new Response('', { status: 200 });
}
