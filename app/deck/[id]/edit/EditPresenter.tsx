'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlideRenderer from '@/components/SlideRenderer';
import PromptInput from '@/components/PromptInput';
import type { Deck } from '@/lib/types';

interface EditPresenterProps {
  deck: Deck;
}

export default function EditPresenter({ deck }: EditPresenterProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modifiedHtml, setModifiedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleModify = async (prompt: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          deckId: deck.id,
          mode: 'modify',
          currentHtml: deck.slides[currentSlide].html,
          slideIndex: currentSlide,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to modify slide');
      }

      const { slides } = await response.json();
      setModifiedHtml(slides[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    // Refresh the page to show updated slide
    router.refresh();
    setModifiedHtml(null);
  };

  const handleDiscard = () => {
    setModifiedHtml(null);
  };

  const currentHtml = modifiedHtml || deck.slides[currentSlide].html;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push(`/deck/${deck.id}`)}
              className="text-gray-600 hover:text-gray-900 font-light mb-4 transition-colors"
            >
              ← Back to Presentation
            </button>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Edit Slides
            </h1>
            <p className="text-gray-600 font-light mt-1">
              {deck.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Slide List */}
          <div className="col-span-3">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Slides</h2>
            <div className="space-y-2">
              {deck.slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setModifiedHtml(null);
                    setError('');
                  }}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    index === currentSlide
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    Slide {index + 1}
                  </div>
                  {modifiedHtml && index === currentSlide && (
                    <div className="text-xs text-blue-600 mt-1">Modified (not saved)</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {/* Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">
                  Preview {modifiedHtml && '(Modified)'}
                </h2>
                {modifiedHtml && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleApply}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-all"
                    >
                      Apply Changes
                    </button>
                    <button
                      onClick={handleDiscard}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <SlideRenderer
                  html={currentHtml}
                  config={deck.config}
                  slideIndex={currentSlide}
                />
              </div>
            </div>

            {/* Edit Prompt */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Describe Changes
              </h2>
              <PromptInput
                onSubmit={handleModify}
                loading={loading}
                placeholder="Describe what you want to change. For example: 'Make the title larger and change the color to blue' or 'Add a bullet point about cost savings'"
                buttonText={modifiedHtml ? 'Modify Again' : 'Modify Slide'}
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800 font-light">{error}</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Editing Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600 font-light">
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>Be specific about what you want to change</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>You can modify content, styling, layout, or colors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>Preview changes before applying them</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>You can modify the same slide multiple times</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
