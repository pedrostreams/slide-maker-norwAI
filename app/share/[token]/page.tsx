import { notFound } from 'next/navigation';
import { getDeckByToken, getDeck } from '@/lib/storage';
import SharePresenter from './SharePresenter';

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const deckId = await getDeckByToken(token);

  if (!deckId) {
    notFound();
  }

  const deck = await getDeck(deckId);

  if (!deck || deck.slides.length === 0) {
    notFound();
  }

  return <SharePresenter deck={deck} />;
}
