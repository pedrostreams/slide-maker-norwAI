'use client';

import { useState } from 'react';
import SlideRenderer from '@/components/SlideRenderer';
import SlideNavigation from '@/components/SlideNavigation';
import type { Deck } from '@/lib/types';

interface SharePresenterProps {
  deck: Deck;
}

export default function SharePresenter({ deck }: SharePresenterProps) {
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header - read-only indicator */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-light text-white tracking-tight">{deck.title}</h1>
            <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-light rounded-full border border-white/20">
              Shared Preview
            </span>
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
