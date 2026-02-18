import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/storage';
import PresentationView from './PresentationView';

export default async function PresentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck || deck.slides.length === 0) {
    notFound();
  }

  return <PresentationView deck={deck} />;
}
