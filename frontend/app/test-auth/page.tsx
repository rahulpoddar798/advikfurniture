import { auth } from "@/auth";

export default async function DebugAuthPage() {
  const session = await auth();
  
  const envStatus = {
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  };

  return (
    <div className="p-10 font-mono">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Tool</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Variable Status (Present?)</h2>
        <pre>{JSON.stringify(envStatus, null, 2)}</pre>
        <p className="mt-2 text-sm text-gray-600">
          * If any of these are "false", the Auth will fail in production.
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Session Status</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      
      <div className="mt-10 p-4 border rounded border-red-200 bg-red-50">
        <h2 className="text-red-700 font-bold">Important Instructions:</h2>
        <ol className="list-decimal ml-5 mt-2 space-y-2">
          <li>Go to <b>Vercel Dashboard</b> &gt; <b>Settings</b> &gt; <b>Environment Variables</b>.</li>
          <li>If the list is empty, click <b>"Add New"</b>.</li>
          <li>Enter the key names exactly as shown above.</li>
          <li>After adding, you <b>must</b> create a new Deployment for them to take effect.</li>
        </ol>
      </div>
    </div>
  );
}
