import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("--- ADMIN LAYOUT DEBUG ---");
  const session = await auth();
  console.log("Server-side Session User:", session?.user?.email);
  console.log("Server-side User Role:", session?.user?.role);
  
  // Robust check for admin roles
  const adminRoles = ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"];
  const userRole = session?.user?.role;

  if (!session?.user || !adminRoles.includes(userRole)) {
    console.log("ACCESS DENIED: Redirecting to home. Role was:", userRole);
    redirect("/");
  }

  console.log("ACCESS GRANTED to Admin Panel");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex relative">
      {/* Premium Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12" data-lenis-prevent="true">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
