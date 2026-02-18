import { listDecksWithPreviews } from '@/lib/storage';
import Dashboard from './Dashboard';

export default async function HomePage() {
  const decks = await listDecksWithPreviews();

  return <Dashboard decks={decks} />;
}
