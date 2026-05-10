'use client';

import { useRouter } from 'next/navigation';
import { Shell } from './Shell';
import { Results } from './Results';
import type { Result } from '@/lib/schemas';

export function ResultsView({ result }: { result: Result }) {
  const router = useRouter();
  const goHome = () => router.push('/');
  return (
    <Shell screen="results" onHome={goHome}>
      <Results result={result} onHome={goHome} />
    </Shell>
  );
}
