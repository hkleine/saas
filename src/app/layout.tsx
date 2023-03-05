'use client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins';
import { Poppins } from '@next/font/google';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import './globals.css';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const colors = {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  };

  const fonts = {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  };

  const theme = extendTheme({ colors, fonts });
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <html lang="en" className={poppins.className}>
      <head />
      <body>
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}
