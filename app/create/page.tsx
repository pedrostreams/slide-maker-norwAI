'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from '@/components/PromptInput';

export default function CreateDeckPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (prompt: string) => {
    if (!title.trim()) {
      setError('Please enter a presentation title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create deck
      const createResponse = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create deck');
      }

      const { deckId } = await createResponse.json();

      // Generate slides
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          deckId,
          mode: 'create',
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate slides');
      }

      const { success } = await generateResponse.json();

      if (success) {
        // Redirect to the new deck
        router.push(`/deck/${deckId}`);
      } else {
        throw new Error('Slide generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
            Create New Presentation
          </h1>
          <p className="text-gray-600 font-light">
            Describe your presentation and let AI generate professional slides
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="space-y-8">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Presentation Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q4 Strategy Review"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content Description
              </label>
              <PromptInput
                onSubmit={handleGenerate}
                loading={loading}
                placeholder="Describe the slides you want to create. For example: 'Create 5 slides about digital transformation: title slide, current state, vision, roadmap, and next steps'"
                buttonText="Generate Presentation"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800 font-light">{error}</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Specify the number of slides you need</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Describe the purpose and key message for each slide</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Mention your target audience if relevant</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>Include key data points or frameworks to visualize</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
