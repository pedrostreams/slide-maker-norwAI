import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/storage';
import ReviewPresenter from './ReviewPresenter';

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck || deck.slides.length === 0) {
    notFound();
  }

  return <ReviewPresenter deck={deck} />;
}
