"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('nns_token');
      if (!token && pathname !== '/login') {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  // Show a loading state while checking authentication, except on the login page
  if (isChecking && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111113] p-4">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <h1 className="text-xl font-bold text-orange-500 tracking-tight text-center">NNS Loading...</h1>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
