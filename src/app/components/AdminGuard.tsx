"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/hooks";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAdmin, isLoggedIn } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      router.push("/login");
    } else if (!isAdmin) {
      // If logged in but not admin, redirect to profile page
      router.push("/profile");
    }
  }, [isAdmin, isLoggedIn, router]);

  // Show loading while checking authentication
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-green-950 flex justify-center items-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
