import { createClient } from '@/utils/supabase-server';
import { getURL } from '../../../utils/helpers';
import { stripe } from '../../../utils/stripe';
import { createOrRetrieveCustomer } from '../../../utils/supabase-admin';

export async function POST() {
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
      return_url: `${getURL()}/dashboard/billing`,
    });

    return new Response(JSON.stringify({ url }), {
      status: 200,
    });
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, {
      status: 500,
    });
  }
}
