'use client';

import React, { useRef, useState } from 'react';

interface NextGenCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const NextGenCard: React.FC<NextGenCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(0, 245, 155, 0.3)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setCoords({ x, y, rotateX, rotateY });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCoords({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
      }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Interactive Light Sheen Reflection */}
      {isHovered && (
        <div
          className="absolute pointer-events-none -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-20 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
};
