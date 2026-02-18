import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/storage';
import EditPresenter from './EditPresenter';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck || deck.slides.length === 0) {
    notFound();
  }

  return <EditPresenter deck={deck} />;
}
