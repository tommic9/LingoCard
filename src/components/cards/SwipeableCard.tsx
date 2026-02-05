/**
 * SwipeableCard - Card wrapper that detects swipe gestures
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

const SWIPE_THRESHOLD = 50;

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  onSwipeProgress,
}: SwipeableCardProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setTouchStart(e.touches[0].clientX);
    setTouchCurrent(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || touchStart === null) return;
    const current = e.touches[0].clientX;
    setTouchCurrent(current);

    const diff = current - touchStart;
    const direction = diff > 0 ? 'right' : 'left';
    const progress = Math.abs(diff) / SWIPE_THRESHOLD;

    onSwipeProgress?.(direction, Math.min(progress, 1));
  };

  const handleTouchEnd = () => {
    if (disabled || touchStart === null || touchCurrent === null) return;

    const diff = touchCurrent - touchStart;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    setTouchStart(null);
    setTouchCurrent(null);
    onSwipeProgress?.(null, 0);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="select-none"
    >
      {children}
    </div>
  );
}
