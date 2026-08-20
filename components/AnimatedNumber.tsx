'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // in milliseconds
  formatter?: (val: number) => string;
  className?: string;
}

/**
 * AnimatedNumber Component
 * Smoothly interpolates numeric values via requestAnimationFrame and cubic ease-out.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 600,
  formatter = (v) => Math.round(v).toLocaleString(),
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const startValRef = useRef<number>(value);
  const targetValRef = useRef<number>(value);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startValRef.current = displayValue;
    targetValRef.current = value;
    startTimeRef.current = null;

    const easeOutCubic = (t: number): number => --t * t * t + 1;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutCubic(progress);

      const current =
        startValRef.current + (targetValRef.current - startValRef.current) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValRef.current);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <span className={`inline-block tabular-nums transition-colors ${className}`}>{formatter(displayValue)}</span>;
};
