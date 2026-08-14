'use client';

import React, { useEffect, useState } from 'react';

export const InteractiveBackdrop: React.FC = () => {
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Interactive Cursor Spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 transition-all duration-75"
        style={{
          left: `${mouse.x - 300}px`,
          top: `${mouse.y - 300}px`,
          background: 'radial-gradient(circle, #00f59b 0%, #00f0ff 40%, transparent 70%)',
        }}
      />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
    </div>
  );
};
