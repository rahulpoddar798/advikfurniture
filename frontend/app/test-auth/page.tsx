import { auth } from "@/auth";

export default async function AuthDebugPage() {
  const session = await auth();
  
  const debugInfo = {
    VERCEL_URL: process.env.VERCEL_URL,
    AUTH_URL: process.env.AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  };

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-xl font-bold mb-4">Auth Debugging Info</h1>
      
      <section className="mb-6">
        <h2 className="font-bold border-b mb-2">Environment Variables</h2>
        <pre className="bg-stone-100 p-4 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </section>

      <section className="mb-6">
        <h2 className="font-bold border-b mb-2">Session State</h2>
        <pre className="bg-stone-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </section>

      <section className="mb-6">
        <h2 className="font-bold border-b mb-2">Expected Redirect URI</h2>
        <p className="bg-blue-50 p-4 rounded text-blue-800">
          https://{process.env.VERCEL_URL || 'your-domain'}/api/auth/callback/google
        </p>
      </section>

      <p className="text-stone-500 italic mt-10">
        If the URI above does not match EXACTLY what is in Google Cloud Console, the login will fail.
      </p>
    </div>
  );
}
