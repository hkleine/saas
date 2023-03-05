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

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw Error('Could not get user');

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email || '',
    });

    if (!customer) throw Error('Could not get customer');
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return res.status(200).json({ url });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
}
