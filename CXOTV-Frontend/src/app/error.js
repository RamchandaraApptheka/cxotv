'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import HeaderAdjust from '@/app/(main)/components/HeaderAdjust';
import NavigationMenu from '@/app/(main)/components/NavigationMenu';
import Footer from '@/app/(main)/components/Footer';
import { ReduxProvider } from './providers';
import logo from '../../public/assets/cxotv-header-logo.jpg';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    // <ReduxProvider>
    //   <div className="flex flex-col min-h-screen">
    //     <HeaderAdjust logo={logo} />
    //     <NavigationMenu />
    //     <main className="flex-grow flex items-center justify-center">
    //       <div className="text-center py-20 px-4">
    //         <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
    //         <p className="text-xl mb-8">We apologize for the inconvenience</p>
    //         <div className="flex flex-col md:flex-row justify-center items-center gap-4">
    //           <button
    //             onClick={() => reset()}
    //             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
    //           >
    //             Try again
    //           </button>
    //           <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition-colors">
    //             Go back home
    //           </Link>
    //         </div>
    //       </div>
    //     </main>
    //     <Footer />
    //   </div>
    // </ReduxProvider>
    <div></div>
  );
}
