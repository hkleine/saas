'use client';
import { getURL } from '@/utils/helpers';
import { Card, CardBody, Center, Heading } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  if (!user) {
    return (
      <Center padding="10">
        <Card minW="450px" marginTop="100">
          <CardBody>
            <Heading size="md">Sign in</Heading>
            <Auth
              redirectTo={`${getURL()}/dashboard`}
              appearance={{ theme: ThemeSupa }}
              supabaseClient={supabaseClient}
              providers={['google', 'github']}
              dark={false}
            />
          </CardBody>
        </Card>
      </Center>
    );
  }
}
