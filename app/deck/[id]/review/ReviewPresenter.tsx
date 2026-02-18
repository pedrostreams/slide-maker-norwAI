'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlideRenderer from '@/components/SlideRenderer';
import CommentOverlay from '@/components/CommentOverlay';
import SlideNavigation from '@/components/SlideNavigation';
import type { Deck, Comment } from '@/lib/types';

interface ReviewPresenterProps {
  deck: Deck;
}

export default function ReviewPresenter({ deck: initialDeck }: ReviewPresenterProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comments, setComments] = useState<Comment[]>(initialDeck.comments);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < initialDeck.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, initialDeck.slides.length - 1)));
  };

  const handleAddComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'author'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      author: 'Reviewer',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/comments/${initialDeck.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        setComments([...comments, newComment]);
      }
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  };

  const handleToggleResolved = async (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const updatedComment = { ...comment, resolved: !comment.resolved };

    try {
      const response = await fetch(`/api/comments/${initialDeck.id}/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: updatedComment.resolved }),
      });

      if (response.ok) {
        setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)));
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCommentClick = (comment: Comment) => {
    // Navigate to the comment's slide if not already there
    if (comment.slideIndex !== currentSlide) {
      setCurrentSlide(comment.slideIndex);
    }

    // Wait for slide to render, then highlight the element
    setTimeout(() => {
      try {
        // Try to find element by selector
        const element = document.querySelector(comment.selector);
        if (element && element instanceof HTMLElement) {
          // Scroll element into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Add highlight effect
          element.style.outline = '3px solid #3B82F6';
          element.style.outlineOffset = '4px';
          element.style.transition = 'outline 0.3s ease';

          // Add a pulsing animation
          element.style.animation = 'pulse 2s ease-in-out';

          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.style.outline = '';
            element.style.outlineOffset = '';
            element.style.animation = '';
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to highlight element:', error);
      }
    }, comment.slideIndex !== currentSlide ? 300 : 0);
  };

  const currentSlideComments = comments.filter((c) => c.slideIndex === currentSlide);
  const filteredComments =
    filter === 'all'
      ? currentSlideComments
      : currentSlideComments.filter((c) => (filter === 'resolved' ? c.resolved : !c.resolved));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% {
            outline-color: #3B82F6;
            outline-width: 3px;
          }
          50% {
            outline-color: #60A5FA;
            outline-width: 5px;
          }
        }
      `}} />
      <div className="min-h-screen bg-gray-900 flex">
        {/* Main Slide Area */}
        <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push(`/deck/${initialDeck.id}`)}
                className="text-gray-400 hover:text-white font-light transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-lg font-light text-white tracking-tight">
                {initialDeck.title}
              </h1>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-light rounded-full border border-purple-500/30">
                Review Mode
              </span>
            </div>
          </div>
        </div>

        {/* Slide with Overlay */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-6xl relative">
            <SlideRenderer
              html={initialDeck.slides[currentSlide].html}
              config={initialDeck.config}
              slideIndex={currentSlide}
            />
            <CommentOverlay
              comments={currentSlideComments}
              onAddComment={handleAddComment}
              slideIndex={currentSlide}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-8 flex justify-center">
          <SlideNavigation
            currentSlide={currentSlide}
            totalSlides={initialDeck.slides.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSlideChange={handleSlideChange}
          />
        </div>
      </div>

      {/* Comments Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({currentSlideComments.length})
            </button>
            <button
              onClick={() => setFilter('unresolved')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                filter === 'unresolved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Open ({currentSlideComments.filter((c) => !c.resolved).length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                filter === 'resolved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolved ({currentSlideComments.filter((c) => c.resolved).length})
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-light">
                {filter === 'all'
                  ? 'No comments on this slide'
                  : filter === 'unresolved'
                  ? 'No open comments'
                  : 'No resolved comments'}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-light">
                Click on any element to add a comment
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                onClick={() => handleCommentClick(comment)}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                  comment.resolved
                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 font-light">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleResolved(comment.id);
                    }}
                    className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                      comment.resolved
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {comment.resolved ? 'Resolved' : 'Resolve'}
                  </button>
                </div>
                <p className="text-sm text-gray-900 font-light">{comment.text}</p>
                <p className="text-xs text-gray-400 mt-2 font-light">
                  Click to view on slide {comment.slideIndex + 1}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </>
  );
}
