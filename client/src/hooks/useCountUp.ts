import { useEffect, useState } from 'react';

/**
 * Smooth count-up animation hook for monetary figures and stats.
 * Automatically respects prefers-reduced-motion.
 */
export function useCountUp(targetValue: number, duration = 800): number {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    // If reduced motion is preferred or duration is 0, jump directly to target
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCurrentValue(targetValue);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const startValue = 0;
    const diff = targetValue - startValue;

    if (diff === 0) {
      setCurrentValue(targetValue);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic formula for snappy start and gentle settle
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + diff * easeOut);

      setCurrentValue(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
}
