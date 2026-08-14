'use client';

import React, { useEffect, useState } from 'react';
import { Food3DAsset } from './Food3DAsset';

interface FloatingObjectProps {
  name: string;
  type: string;
  size?: number;
  className?: string;
  glowColor?: string;
  animationType?: 'drift-lr' | 'drift-rl' | 'updown';
  delay?: number;
}

const Floating3DItem: React.FC<FloatingObjectProps> = ({
  name,
  type,
  size = 78,
  className = '',
  glowColor = 'rgba(196, 85, 45, 0.18)',
  animationType = 'drift-lr',
  delay = 0,
}) => {
  const animClass =
    animationType === 'drift-lr'
      ? 'animate-drift-lr'
      : animationType === 'drift-rl'
      ? 'animate-drift-rl'
      : 'animate-updown-bob';

  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`relative inline-flex flex-col items-center pointer-events-auto cursor-pointer group ${animClass} ${className}`}
    >
      {/* Ambient Motion Trail Glow */}
      <div
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
        className="absolute -inset-4 rounded-full filter blur-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
      />

      {/* 3D Model with Realistic Lighting */}
      <div className="relative z-10 transform-gpu group-hover:scale-120 group-hover:rotate-6 transition-transform duration-300">
        <Food3DAsset name={name} type={type} size={size} />
      </div>

      {/* Dynamic Ground / Backdrop Blur Shadow */}
      <div
        style={{ width: `${size * 0.7}px`, height: '8px' }}
        className="bg-black/25 rounded-full filter blur-xs mt-1.5 animate-shadow-pulse pointer-events-none"
      />
    </div>
  );
};

export const Floating3DHeroDecor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 28;
      const y = (e.clientY / window.innerHeight - 0.5) * 28;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden xl:block">
      {/* 1. HERO REGION: Avocado (Left) vs Ribeye Steak (Right) */}
      <div
        style={{
          transform: `translate(${mousePos.x * 1.3}px, ${mousePos.y * 1.3}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-24 left-3 2xl:left-12"
      >
        <Floating3DItem
          name="Avocado"
          type="avocado"
          size={84}
          glowColor="rgba(117, 166, 50, 0.25)"
          animationType="drift-lr"
          delay={0}
        />
      </div>

      <div
        style={{
          transform: `translate(${-mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-28 right-3 2xl:right-12"
      >
        <Floating3DItem
          name="Ribeye Steak"
          type="steak"
          size={88}
          glowColor="rgba(217, 75, 61, 0.25)"
          animationType="drift-rl"
          delay={1.5}
        />
      </div>

      {/* 2. CATEGORY DIRECTORY REGION: Broccoli Tree (Left) vs Cheeseburger (Right) */}
      <div
        style={{
          transform: `translate(${mousePos.x * 0.9}px, ${-mousePos.y * 0.9}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[34%] left-2 2xl:left-10"
      >
        <Floating3DItem
          name="Broccoli"
          type="broccoli"
          size={82}
          glowColor="rgba(80, 153, 36, 0.25)"
          animationType="updown"
          delay={0.8}
        />
      </div>

      <div
        style={{
          transform: `translate(${-mousePos.x * 1.1}px, ${-mousePos.y * 1.1}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[36%] right-2 2xl:right-10"
      >
        <Floating3DItem
          name="Cheeseburger"
          type="burger"
          size={86}
          glowColor="rgba(217, 138, 54, 0.25)"
          animationType="drift-lr"
          delay={2.2}
        />
      </div>

      {/* 3. HIGH PROTEIN REGION: Chicken Cutlet (Left) vs Salmon Fillet (Right) */}
      <div
        style={{
          transform: `translate(${mousePos.x * 1.1}px, ${mousePos.y * 1.1}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[55%] left-3 2xl:left-12"
      >
        <Floating3DItem
          name="Chicken Cutlet"
          type="chicken"
          size={80}
          glowColor="rgba(222, 158, 82, 0.25)"
          animationType="drift-rl"
          delay={3}
        />
      </div>

      <div
        style={{
          transform: `translate(${-mousePos.x * 0.9}px, ${mousePos.y * 0.9}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[58%] right-3 2xl:right-12"
      >
        <Floating3DItem
          name="Atlantic Salmon"
          type="salmon"
          size={82}
          glowColor="rgba(245, 90, 56, 0.25)"
          animationType="updown"
          delay={1.2}
        />
      </div>

      {/* 4. CIRCADIAN TIMELINE & BREAKFAST REGION: Sunny Egg (Left) vs Espresso (Right) */}
      <div
        style={{
          transform: `translate(${mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[75%] left-2 2xl:left-10"
      >
        <Floating3DItem
          name="Sunny Egg"
          type="egg"
          size={78}
          glowColor="rgba(250, 157, 27, 0.25)"
          animationType="drift-lr"
          delay={2.5}
        />
      </div>

      <div
        style={{
          transform: `translate(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[77%] right-2 2xl:right-10"
      >
        <Floating3DItem
          name="Espresso Coffee"
          type="coffee"
          size={80}
          glowColor="rgba(189, 133, 80, 0.25)"
          animationType="drift-rl"
          delay={0.5}
        />
      </div>

      {/* 5. COMPARISON ARENA REGION: Strawberry (Left) vs Banana (Right) */}
      <div
        style={{
          transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[90%] left-4 2xl:left-14"
      >
        <Floating3DItem
          name="Fresh Strawberry"
          type="strawberry"
          size={76}
          glowColor="rgba(214, 24, 24, 0.25)"
          animationType="updown"
          delay={1.8}
        />
      </div>

      <div
        style={{
          transform: `translate(${-mousePos.x * 0.7}px, ${mousePos.y * 0.7}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[91%] right-4 2xl:right-14"
      >
        <Floating3DItem
          name="Fresh Banana"
          type="banana"
          size={78}
          glowColor="rgba(255, 222, 23, 0.25)"
          animationType="drift-lr"
          delay={3.5}
        />
      </div>
    </div>
  );
};
