import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presentation',
};

export default function PresentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
