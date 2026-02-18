'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlideRenderer from '@/components/SlideRenderer';
import SlideNavigation from '@/components/SlideNavigation';
import type { Deck } from '@/lib/types';

interface DeckPresenterProps {
  deck: Deck;
}

export default function DeckPresenter({ deck }: DeckPresenterProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < deck.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, deck.slides.length - 1)));
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export/${deck.id}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export deck');
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: deck.id }),
      });

      if (!response.ok) throw new Error('Failed to create share link');

      const { token } = await response.json();
      const shareUrl = `${window.location.origin}/share/${token}`;

      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to create share link');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white font-light transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-light text-white tracking-tight">{deck.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/deck/${deck.id}/edit`)}
              className="px-4 py-2 text-sm bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => router.push(`/deck/${deck.id}/review`)}
              className="px-4 py-2 text-sm bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
            >
              Review
            </button>
            <button
              onClick={() => router.push(`/deck/${deck.id}/settings`)}
              className="px-4 py-2 text-sm bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
            >
              Settings
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
            <button
              onClick={handleShare}
              className="px-4 py-2 text-sm bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
            >
              Share
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
            >
              Export
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
            <button
              onClick={() => window.open(`/present/${deck.id}`, '_blank')}
              className="px-4 py-2 text-sm bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all"
            >
              Presentation Mode
            </button>
          </div>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl">
          <SlideRenderer
            html={deck.slides[currentSlide].html}
            config={deck.config}
            slideIndex={currentSlide}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-8 flex justify-center">
        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={deck.slides.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSlideChange={handleSlideChange}
        />
      </div>
    </div>
  );
}
