import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
//import { getServerSession } from 'next-auth';
//import GlobalHeader from '@/components/header';
//import SessionProviderClient from './components/SessionProviderClient';
import 'react-image-crop/dist/ReactCrop.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LoaderProvider } from './context/LoaderContext';
import SWRProviders from './context/SWRContext';
import getAuthUser from '@/lib/database/getAuthUser';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose the weights you need
  variable: '--font-poppins', // optional for Tailwind
});

export const metadata: Metadata = {
  title: 'Avensia CV Tools',
  description:
    'A tool that helps create, update, and manage consultant CVs easily. It ensures consistent formatting, quick customization for clients, and up-to-date consultant information across Avensia.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const session = await getServerSession();
  const user = await getAuthUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased font-nunito-sans font-nunito `}>
        {/* <SessionProviderClient session={session}> */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LoaderProvider>
            <SWRProviders user={{ id: user?.userId ?? '' }}>
              <main>
                {/* {session?.user && (
                <section>
                  <GlobalHeader />
                </section>
              )} */}
                <section>{children}</section>
              </main>
            </SWRProviders>
          </LoaderProvider>
        </ThemeProvider>
        {/* </SessionProviderClient> */}
      </body>
    </html>
  );
}
