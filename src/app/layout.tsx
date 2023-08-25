import { Poppins } from 'next/font/google';
import { PropsWithChildren } from 'react';
import 'reactflow/dist/style.css';
import Provider from './components/Provider/Provider';
import './globals.css';

const poppins = Poppins({
	weight: '400',
	subsets: ['latin'],
});
export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={poppins.className}>
			<head />
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
