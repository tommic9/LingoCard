/**
 * Flashcard component with flip animation
 */

import { useState } from 'react';
import type { Card } from '../../types';

interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  showExample?: boolean;
}

export function Flashcard({ card, isFlipped, onFlip, showExample = true }: FlashcardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        className={`relative w-full h-80 md:h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-4 border-primary-500 p-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Question
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
              {card.front}
            </div>
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Tap to reveal
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl shadow-xl border-4 border-primary-400 p-8">
            <div className="text-sm text-primary-100 uppercase tracking-wide mb-4">
              Answer
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
              {card.back}
            </div>
            {showExample && card.example && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-xs text-primary-100 uppercase tracking-wide mb-2">
                  Example
                </div>
                <div className="text-sm text-white italic">
                  "{card.example}"
                </div>
              </div>
            )}
            <div className="mt-8 text-sm text-primary-100">
              Tap to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
