'use client';
import { baseTheme, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import '@fontsource/poppins/400.css';

const colors = {
  primary: baseTheme.colors.teal,
};

const fonts = {
  heading: `'Poppins', sans-serif`,
  body: `'Poppins', sans-serif`,
};

const theme = extendTheme({ colors, fonts, components: {
  Button: {
    baseStyle:{
      fontWeight: 'normal'
    }
  }
} });

export default function Provider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SessionContextProvider>
  );
}
