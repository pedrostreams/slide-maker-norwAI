'use client';

import { useRouter } from 'next/navigation';
import type { DeckMetadata, ThemeConfig } from '@/lib/types';

interface DeckWithPreview extends DeckMetadata {
  firstSlideHtml?: string;
  config?: ThemeConfig;
}

interface DashboardProps {
  decks: DeckWithPreview[];
}

export default function Dashboard({ decks }: DashboardProps) {
  const router = useRouter();

  const handleDelete = async (deckId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete deck');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete deck');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
            Your Presentations
          </h1>
          <p className="text-gray-600 font-light">
            Manage and create professional slide decks
          </p>
        </div>

        {/* Create new deck button */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/create')}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Presentation
          </button>
        </div>

        {/* Decks grid */}
        {decks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2">
              No presentations yet
            </h3>
            <p className="text-gray-500 mb-8 font-light">
              Create your first AI-powered slide deck
            </p>
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-all"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all overflow-hidden group cursor-pointer"
                onClick={() => router.push(`/deck/${deck.id}`)}
              >
                {/* Slide preview */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
                  {deck.firstSlideHtml && deck.config ? (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        transform: 'scale(0.25)',
                        transformOrigin: 'top left',
                        width: '400%',
                        height: '400%',
                      }}
                    >
                      <style dangerouslySetInnerHTML={{ __html: `
                        .slide-preview-${deck.id} * {
                          font-family: ${deck.config.theme.fontFamily};
                        }
                        .slide-preview-${deck.id} .slide,
                        .slide-preview-${deck.id} section.slide,
                        .slide-preview-${deck.id} section[class*="slide"] {
                          width: 100% !important;
                          height: 100% !important;
                        }
                      `}} />
                      <div
                        className={`slide-preview-${deck.id} w-full h-full`}
                        dangerouslySetInnerHTML={{ __html: deck.firstSlideHtml }}
                      />
                    </div>
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {deck.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-light">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {deck.slideCount} slides
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(deck.updatedAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/deck/${deck.id}/edit`);
                      }}
                      className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(deck.id, deck.title);
                      }}
                      className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
