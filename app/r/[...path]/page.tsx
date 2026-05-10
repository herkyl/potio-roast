import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadResult } from '@/lib/persist';
import { ResultsView } from '@/components/ResultsView';

// These runs are dynamic — they live in Redis with a TTL.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = {
  params: Promise<{ path: string[] }>;
};

function slugFromParams(path: string[]): string {
  return path.map((s) => s.toLowerCase()).join('/');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path } = await params;
  const slug = slugFromParams(path);
  const result = await loadResult(slug);
  if (!result) return { title: '[roast] · not found' };
  return {
    title: `[roast] ${slug} · ${result.grade} · ${result.score}/100`,
    description: result.summary,
    openGraph: {
      title: `[roast] ${slug}`,
      description: `${result.grade} · ${result.score}/100 · ${result.tier}`,
    },
  };
}

export default async function ResultsPage({ params }: PageProps) {
  const { path } = await params;
  const slug = slugFromParams(path);
  const result = await loadResult(slug);
  if (!result) notFound();
  return <ResultsView result={result} />;
}
