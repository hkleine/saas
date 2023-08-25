'use client';
import { baseTheme, ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import '@fontsource/poppins/400.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { MultiSelectTheme } from 'chakra-multiselect';
import { PropsWithChildren, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';

const colors = {
	primary: baseTheme.colors.purple,
	brand: baseTheme.colors.purple,
};

const fonts = {
	heading: `'Poppins', sans-serif`,
	body: `'Poppins', sans-serif`,
};

const theme = extendTheme(
	{
		colors,
		fonts,
		components: {
			MultiSelect: MultiSelectTheme,
			Button: {
				baseStyle: {
					fontWeight: 'normal',
				},
			},
			Menu: {
				baseStyle: {
					item: {
						borderRadius: 'md',
					},
				},
			},
		},
	},
	withDefaultColorScheme({
		colorScheme: 'primary',
	}),
);

export default function Provider({ children }: PropsWithChildren) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	return (
		<SessionContextProvider supabaseClient={supabaseClient}>
			<ReactFlowProvider>
				<ChakraProvider theme={theme}>{children}</ChakraProvider>
			</ReactFlowProvider>
		</SessionContextProvider>
	);
}
