import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/storage';
import DeckPresenter from './DeckPresenter';

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck || deck.slides.length === 0) {
    notFound();
  }

  return <DeckPresenter deck={deck} />;
}
