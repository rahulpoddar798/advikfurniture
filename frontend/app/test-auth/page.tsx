'use client';

import { useSession } from 'next-auth/react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="pt-40 p-10 space-y-4 dark:text-white">
      <h1 className="text-2xl font-bold">Auth Debug Page</h1>
      <p>Status: <span className="font-mono bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">{status}</span></p>
      <pre className="bg-stone-100 dark:bg-stone-800 p-4 rounded-xl overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="pt-10">
        <a href="/" className="text-blue-500 underline">Go Home</a>
      </div>
    </div>
  );
}
