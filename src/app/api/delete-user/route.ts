import { deleteUser } from '@/utils/supabase-admin';
import { createClient } from '@/utils/supabase-server';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
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
    const { id } = await req.json();

    const { error } = await deleteUser(id);
    if (error) throw error;

    return new Response(JSON.stringify({ message: 'User deleted' }), {
      status: 200,
    });
  } catch (err: any) {
    console.log(err);
    return new Response(err.message, {
      status: 500,
    });
  }
}
