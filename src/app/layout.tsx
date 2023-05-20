import { Poppins } from 'next/font/google';
import 'reactflow/dist/style.css';
import Provider from './components/Provider/Provider';
import './globals.css';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <head />
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
