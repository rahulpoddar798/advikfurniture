import { auth } from "@/auth";

export default async function AuthDebugPage() {
  const session = await auth();
  
  const debugInfo = {
    VERCEL_URL: process.env.VERCEL_URL || "MISSING",
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || "MISSING",
    AUTH_URL: process.env.AUTH_URL || "NOT SET",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "NOT SET",
  };

  const expectedRedirect = debugInfo.VERCEL_URL !== "MISSING" 
    ? `https://${debugInfo.VERCEL_URL}/api/auth/callback/google`
    : "COULD NOT DETERMINE (VERCEL_URL MISSING)";

  return (
    <div className="p-8 font-mono text-sm bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">Auth Diagnostic Tool</h1>
      
      <section className="mb-8">
        <h2 className="text-lg font-bold text-blue-600 mb-2">1. Critical Variables (Raw Values)</h2>
        <pre className="bg-stone-100 p-4 rounded overflow-auto border">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
        <p className="mt-2 text-xs text-stone-500">
          * VERCEL_URL must not be "MISSING" for automatic redirect generation to work.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-green-600 mb-2">2. Generated Redirect URI</h2>
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <p className="font-bold text-green-800 break-all">{expectedRedirect}</p>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Copy the green URL above and paste it into Google Cloud Console {">"} Credentials {">"} Authorized Redirect URIs.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-purple-600 mb-2">3. Session State</h2>
        <pre className="bg-stone-100 p-4 rounded border">
          {JSON.stringify(session, null, 2)}
        </pre>
      </section>

      <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        <h3 className="font-bold mb-1">Troubleshooting Tip:</h3>
        <p>If VERCEL_URL is MISSING, ensure "Automatically expose System Environment Variables" is checked in Vercel {">"} Settings {">"} Environment Variables.</p>
      </div>
    </div>
  );
}
