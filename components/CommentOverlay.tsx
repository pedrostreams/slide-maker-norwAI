'use client';

import { useState, useRef, useEffect } from 'react';
import type { Comment } from '@/lib/types';

interface CommentOverlayProps {
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'author'>) => void;
  slideIndex: number;
}

export default function CommentOverlay({
  comments,
  onAddComment,
  slideIndex,
}: CommentOverlayProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [commentDialogPos, setCommentDialogPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [commentText, setCommentText] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (commentDialogPos) return; // Don't highlight while dialog is open

    // Temporarily disable pointer events on overlay to find element underneath
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'none';
    }

    const target = document.elementFromPoint(e.clientX, e.clientY);

    // Re-enable pointer events
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'auto';
    }

    if (target && target !== overlayRef.current && !overlayRef.current?.contains(target)) {
      // Make sure we're not hovering over comment pins or dialogs
      const isCommentElement = target.closest('[data-comment-element]');
      if (!isCommentElement) {
        setHoveredElement(target as HTMLElement);
      }
    } else {
      setHoveredElement(null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (commentDialogPos) return; // Dialog already open

    // Temporarily disable pointer events on overlay to find element underneath
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'none';
    }

    const target = document.elementFromPoint(e.clientX, e.clientY);

    // Re-enable pointer events
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'auto';
    }

    if (target && target !== overlayRef.current) {
      // Make sure we're not clicking on comment pins or dialogs
      const isCommentElement = target.closest('[data-comment-element]');
      if (!isCommentElement) {
        const rect = target.getBoundingClientRect();
        const overlayRect = overlayRef.current?.getBoundingClientRect();

        if (overlayRect) {
          setCommentDialogPos({
            x: rect.left - overlayRect.left + rect.width / 2,
            y: rect.top - overlayRect.top,
          });
        }
      }
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !hoveredElement) return;

    const rect = hoveredElement.getBoundingClientRect();
    const overlayRect = overlayRef.current?.getBoundingClientRect();

    if (overlayRect) {
      const selector = generateSelector(hoveredElement);

      onAddComment({
        slideIndex,
        selector,
        position: {
          x: rect.left - overlayRect.left + rect.width / 2,
          y: rect.top - overlayRect.top,
        },
        text: commentText,
        resolved: false,
      });
    }

    setCommentText('');
    setCommentDialogPos(null);
    setHoveredElement(null);
  };

  const handleCancel = () => {
    setCommentText('');
    setCommentDialogPos(null);
    setHoveredElement(null);
  };

  // Generate a simple CSS selector for the element
  const generateSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    // Use getAttribute to handle SVG elements where className is SVGAnimatedString
    const classAttr = element.getAttribute('class');
    if (classAttr) {
      const classes = classAttr.split(' ').filter(Boolean);
      if (classes.length > 0) return `.${classes.join('.')}`;
    }
    return element.tagName.toLowerCase();
  };

  // Update highlight when hovered element changes
  useEffect(() => {
    if (hoveredElement && !commentDialogPos) {
      hoveredElement.style.outline = '2px solid #3B82F6';
      hoveredElement.style.outlineOffset = '2px';

      return () => {
        hoveredElement.style.outline = '';
        hoveredElement.style.outlineOffset = '';
      };
    }
  }, [hoveredElement, commentDialogPos]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ cursor: commentDialogPos ? 'default' : 'crosshair' }}
      />

      {/* Comment Pins */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          data-comment-element
          className={`absolute z-20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            comment.resolved
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white hover:scale-110'
          }`}
          style={{
            left: `${comment.position.x}px`,
            top: `${comment.position.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
          title={comment.text}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ))}

      {/* Comment Dialog */}
      {commentDialogPos && (
        <div
          data-comment-element
          className="absolute z-30 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4"
          style={{
            left: `${commentDialogPos.x}px`,
            top: `${commentDialogPos.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-16px',
          }}
        >
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Add Comment
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What needs to be changed?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-light text-sm"
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmitComment();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Add Comment
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-light">
            Press Cmd/Ctrl + Enter to save
          </p>
        </div>
      )}
    </>
  );
}
