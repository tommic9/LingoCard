/**
 * Flashcard component with flip animation
 */

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
        className={`relative w-full h-[45vh] min-h-[260px] max-h-[380px] md:h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
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
          <div className="relative flex flex-col items-center justify-center h-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl shadow-2xl border-2 border-primary-400 dark:border-primary-600 p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/30 dark:to-transparent" />
            <div className="relative text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-4 md:mb-6 px-3 py-1.5 md:px-4 md:py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
              Question
            </div>
            <div className="relative text-2xl sm:text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent text-center leading-tight px-4">
              {card.front}
            </div>
            <div className="relative mt-8 md:mt-10 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
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
          <div className="relative flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 rounded-3xl shadow-2xl border-2 border-primary-400 dark:border-primary-500 p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative text-xs font-bold text-primary-100 uppercase tracking-widest mb-4 md:mb-6 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full">
              Answer
            </div>
            <div className="relative text-2xl sm:text-3xl md:text-5xl font-extrabold text-white text-center mb-4 md:mb-6 leading-tight px-4 drop-shadow-lg">
              {card.back}
            </div>
            {showExample && card.example && (
              <div className="relative mt-4 md:mt-6 p-4 md:p-5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-lg">
                <div className="text-sm md:text-base text-white/95 italic leading-relaxed">
                  "{card.example}"
                </div>
              </div>
            )}
            <div className="relative mt-8 md:mt-10 text-sm font-medium text-primary-100 animate-pulse">
              Tap to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
