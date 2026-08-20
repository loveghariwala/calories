'use client';

import React from 'react';

interface ElasticTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

/**
 * ElasticText Component
 * Splits characters with index & count CSS variables to create
 * an interactive spring bounce effect upon hover.
 */
export const ElasticText: React.FC<ElasticTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  const chars = text.split('');
  return (
    <Component className={`elastic-text-wrap inline-block ${className}`}>
      <span className="elastic-text inline-block">
        {chars.map((char, index) => (
          <span
            key={index}
            className="elastic-char inline-block transition-transform duration-300 hover:-translate-y-1 hover:scale-110"
            style={{
              ['--idx' as any]: index,
              ['--cnt' as any]: chars.length,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </Component>
  );
};
