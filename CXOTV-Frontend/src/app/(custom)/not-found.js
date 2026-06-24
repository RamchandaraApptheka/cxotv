"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderAdjust from '@/app/(main)/components/HeaderAdjust';
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import Footer from '@/app/(main)/components/Footer';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCustomAds } from "@/redux/slices/customAdsSlice";
import logo from "../../../public/assets/cxotv-header-logo.jpg"
export default function NotFound() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomAds());
  }, [dispatch]);
  
  return (
    <>
      <HeaderAdjust logo={logo} />
      <NavigationMenu />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">404</h1>
            <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-xl mb-8">
              We&#39;re sorry, the page you requested could not be found.
              The page might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
