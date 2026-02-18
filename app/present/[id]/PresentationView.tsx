'use client';

import { useState, useEffect } from 'react';
import type { Deck } from '@/lib/types';

interface PresentationViewProps {
  deck: Deck;
}

export default function PresentationView({ deck }: PresentationViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showControls, setShowControls] = useState(false);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          window.close();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(deck.slides.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, deck.slides.length]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Inject theme styles
  const { theme } = deck.config;
  const themeStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: ${theme.fontFamily};
    }

    .slide, section.slide, section[class*="slide"] {
      width: 100vw !important;
      height: 100vh !important;
      max-width: 100vw !important;
      max-height: 100vh !important;
      position: relative !important;
      overflow: hidden !important;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />

      {/* Render current slide */}
      <div
        dangerouslySetInnerHTML={{ __html: deck.slides[currentSlide].html }}
      />

      {/* Slide counter - appears on hover */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '300',
          backdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s',
          opacity: showControls ? 1 : 0,
          zIndex: 9999,
        }}
      >
        {currentSlide + 1} / {deck.slides.length}
      </div>

      {/* Exit hint - appears on hover */}
      <div
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '300',
          backdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s',
          opacity: showControls ? 1 : 0,
          zIndex: 9999,
        }}
      >
        Press ESC to exit
      </div>

      {/* Navigation hints - appears on hover */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '300',
          backdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s',
          opacity: showControls ? 1 : 0,
          zIndex: 9999,
        }}
      >
        ← → Space to navigate
      </div>
    </>
  );
}
