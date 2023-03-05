import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getURL } from '../../../utils/helpers';
import { stripe } from '../../../utils/stripe';
import { createOrRetrieveCustomer } from '../../../utils/supabase-admin';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    });
  }

  const { price, quantity = 1, metadata = {} } = req.body;

  try {
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
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
}
