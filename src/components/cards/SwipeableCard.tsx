/**
 * SwipeableCard - Card wrapper that detects swipe gestures with visual feedback
 * - Card animates during drag (translateX + rotate)
 * - Color overlays (red/green) appear during swipe
 * - Fly-out animation on complete swipe
 * - Spring-back animation on cancelled swipe
 */

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
  onSwipeProgress?: (direction: 'left' | 'right' | null, progress: number) => void;
}

const SWIPE_THRESHOLD = 100; // Increased from 50 for better gesture detection
const ROTATION_FACTOR = 0.1; // Rotation angle = dragX * this factor

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  onSwipeProgress,
}: SwipeableCardProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const dragX = touchCurrent && touchStart ? touchCurrent - touchStart : 0;
  const dragProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);
  const rotation = dragX * ROTATION_FACTOR;
  const direction = dragX < 0 ? 'left' : 'right';

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setTouchStart(e.touches[0].clientX);
    setTouchCurrent(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || touchStart === null) return;
    const current = e.touches[0].clientX;
    setTouchCurrent(current);

    const progress = Math.min(Math.abs(current - touchStart) / SWIPE_THRESHOLD, 1);
    onSwipeProgress?.(dragX > 0 ? 'right' : 'left', progress);
  };

  const handleTouchEnd = () => {
    if (disabled || touchStart === null || touchCurrent === null) return;

    const diff = touchCurrent - touchStart;
    const distance = Math.abs(diff);

    if (distance > SWIPE_THRESHOLD) {
      // Complete swipe - trigger rating and fly-out animation
      setIsAnimatingOut(true);
      setIsDragging(false);

      // Give animation time to complete before triggering callback
      setTimeout(() => {
        if (diff > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
        setIsAnimatingOut(false);
        setTouchStart(null);
        setTouchCurrent(null);
      }, 300); // Match animation duration
    } else {
      // Incomplete swipe - spring back
      setIsDragging(false);
      setTouchStart(null);
      setTouchCurrent(null);
      onSwipeProgress?.(null, 0);
    }
  };

  // Calculate transform based on current state
  let transform = 'translateX(0) rotate(0deg)';
  let opacity = 1;

  if (isDragging && dragX !== 0) {
    transform = `translateX(${dragX}px) rotate(${rotation}deg)`;
  } else if (isAnimatingOut) {
    // Fly-out animation
    const flyDistance = dragX > 0 ? 800 : -800;
    transform = `translateX(${flyDistance}px) rotate(${dragX > 0 ? 20 : -20}deg)`;
    opacity = 0;
  }

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Card with animation */}
      <div
        ref={cardRef}
        style={{
          transform,
          opacity,
          transition: isDragging || isAnimatingOut ? 'none' : 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
        }}
      >
        {/* Color overlay during swipe */}
        {isDragging && dragProgress > 0 && (
          <div
            className={`absolute inset-0 rounded-2xl pointer-events-none z-10 flex items-center justify-center transition-opacity ${
              direction === 'left'
                ? 'bg-red-500/20'
                : 'bg-green-500/20'
            }`}
            style={{ opacity: dragProgress }}
          >
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {direction === 'left' ? '❌' : '✓'}
            </div>
          </div>
        )}

        {/* Card content */}
        {children}
      </div>

      {/* Swipe hint text during drag */}
      {isDragging && dragProgress > 0.3 && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 flex items-end justify-center pb-6"
          style={{ opacity: dragProgress }}
        >
          <div className="text-lg font-bold text-white drop-shadow-lg">
            {direction === 'left' ? "Don't Know" : 'Know'}
          </div>
        </div>
      )}
    </div>
  );
}
