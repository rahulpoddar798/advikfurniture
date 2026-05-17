import { auth } from "@/auth";

import { auth } from "@/auth";
import { headers, cookies } from "next/headers";

export default async function AuthDebugPage() {
  const session = await auth();
  const headerList = await headers();
  const cookieList = await cookies();
  
  const debugInfo = {
    VERCEL_URL: process.env.VERCEL_URL || "MISSING",
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || "MISSING",
    AUTH_URL: process.env.AUTH_URL || "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
    HOST_HEADER: headerList.get("host"),
    X_FORWARDED_HOST: headerList.get("x-forwarded-host"),
  };

  const authCookies = cookieList.getAll().filter(c => c.name.includes("authjs") || c.name.includes("next-auth"));

  return (
    <div className="p-8 font-mono text-sm bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">Auth Diagnostic Tool</h1>
      
      <section className="mb-8">
        <h2 className="text-lg font-bold text-blue-600 mb-2">1. Environment & Headers</h2>
        <pre className="bg-stone-100 p-4 rounded overflow-auto border">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-purple-600 mb-2">2. Session State</h2>
        <pre className="bg-stone-100 p-4 rounded border">
          {session ? JSON.stringify(session, null, 2) : "NULL (Not Logged In)"}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-orange-600 mb-2">3. Auth Cookies</h2>
        <pre className="bg-stone-100 p-4 rounded border">
          {authCookies.length > 0 ? JSON.stringify(authCookies.map(c => c.name), null, 2) : "NONE FOUND"}
        </pre>
      </section>

      <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        <h3 className="font-bold mb-1">If you were redirected to Home:</h3>
        <p>1. Check if the URL has an error: `?error=...`</p>
        <p>2. If Session is NULL but Cookies exist, your DATABASE_URL might be failing to save the user.</p>
      </div>
    </div>
  );
}
