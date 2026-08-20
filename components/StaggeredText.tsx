'use client';

import React from 'react';

interface StaggeredTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

/**
 * StaggeredText Component (Inspired by creative developer kinetics)
 * Splits text into individual characters with dynamic CSS `--stagger` variables.
 * On hover or entrance, performs a smooth 3D character roll reveal.
 */
export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  return (
    <Component className={`stagger-group inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="stagger-char-wrap inline-block overflow-hidden align-top"
          style={{ ['--stagger' as any]: index }}
        >
          <span
            className="stagger-char inline-block"
            data-char={char === ' ' ? '\u00A0' : char}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </Component>
  );
};
