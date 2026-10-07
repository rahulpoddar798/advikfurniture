'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { importSampleCatalog } from '@/app/actions/admin/sample-catalog';

export default function SampleCatalogImport() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <p className="text-sm text-stone-600 dark:text-stone-300">
        Add 60 published sample listings: 10 in each category. Existing products stay intact.
        Prices, materials and dimensions are examples. Stock starts at zero, and each listing is labeled Sample.
        Review and replace these details before offering any item for sale.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => {
          setMessage('');
          try {
            const result = await importSampleCatalog();
            setFailed(Boolean(result.error));
            setMessage(result.error || `Import complete: ${result.created} products added, ${result.skipped} existing sample products skipped.`);
          } catch {
            setFailed(true);
            setMessage('Connection interrupted. Retry safely; existing products will be skipped.');
          }
        })}
        className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-stone-900"
      >
        {pending ? 'Adding sample products…' : 'Add 60 sample products'}
      </button>
      {message && (
        <p role={failed ? 'alert' : 'status'} className={failed ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'}>{message}</p>
      )}
      <div className="flex flex-wrap gap-5 text-sm underline">
        <Link href="/collections">View public collection</Link>
        <Link href="/admin/products">Manage products</Link>
      </div>
    </div>
  );
}
