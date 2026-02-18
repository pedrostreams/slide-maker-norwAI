import { listDecksWithPreviews } from '@/lib/storage';
import Dashboard from './Dashboard';

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const decks = await listDecksWithPreviews();

  return <Dashboard decks={decks} />;
}
