'use client';
import { baseTheme, ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins/400.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { RealTimeUserProvider } from './RealTimeUserProvider';

const colors = {
  primary: baseTheme.colors.teal,
};

const fonts = {
  heading: `'Poppins', sans-serif`,
  body: `'Poppins', sans-serif`,
};

const theme = extendTheme({
  colors,
  fonts,
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
      },
    },
  },
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <RealTimeUserProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </RealTimeUserProvider>
    </SessionContextProvider>
  );
}
