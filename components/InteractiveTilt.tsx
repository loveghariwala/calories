'use client';

import React, { useRef, useState } from 'react';

interface InteractiveTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  gloss?: boolean;
}

export const InteractiveTilt: React.FC<InteractiveTiltProps> = ({
  children,
  className = '',
  maxTilt = 6,
  scale = 1.015,
  gloss = true,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glossX: 50, glossY: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    const glossX = (x / rect.width) * 100;
    const glossY = (y / rect.height) * 100;

    setTilt({ x: tiltX, y: tiltY, glossX, glossY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glossX: 50, glossY: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
          tilt.opacity > 0 ? scale : 1
        }, ${tilt.opacity > 0 ? scale : 1}, 1)`,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* 3D Specular Gloss Light Reflection Overlay */}
      {gloss && (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(255, 255, 255, ${tilt.opacity}) 0%, transparent 60%)`,
            transition: 'opacity 0.3s ease',
          }}
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-20"
        />
      )}
    </div>
  );
};
