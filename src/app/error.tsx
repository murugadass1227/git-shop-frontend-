'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isBackend = error.message?.includes('Backend unavailable') || error.message?.includes('Internal Server Error') || error.message?.includes('Request failed');

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-3 sm:px-4 py-8">
      <h1 className="text-lg sm:text-xl font-bold text-slate-800 text-center">Something went wrong</h1>
      <p className="mt-2 max-w-md text-center text-slate-600 text-sm sm:text-base">
        {isBackend
          ? 'The server is temporarily unavailable. Please check that the backend is running on port 3000 and try again.'
          : error.message || 'An unexpected error occurred.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-700 text-sm sm:text-base min-h-[44px] touch-manipulation"
        >
          Try again
        </button>
        <Link href="/" className="rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 text-sm sm:text-base min-h-[44px] flex items-center justify-center touch-manipulation">
          Go home
        </Link>
      </div>
    </div>
  );
}
