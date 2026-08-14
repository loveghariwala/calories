'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Zap, Flame, ShieldCheck, Activity, Sparkles, Dumbbell, Timer } from 'lucide-react';

export const Hero3DLeftObject: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="hidden xl:block absolute left-2 2xl:left-8 top-1/2 -translate-y-1/2 w-72 2xl:w-80 pointer-events-auto z-20"
      style={{
        transform: `perspective(1000px) rotateY(${mousePos.x * 0.8}deg) rotateX(${-mousePos.y * 0.8}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.1, 1, 0.1, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Floating Container */}
      <div className="relative flex flex-col items-center justify-center p-6 hardware-chassis rounded-[32px] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] group">
        {/* Background Aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-[36px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        {/* 3D Rotating Gyroscope Rings */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          {/* Outer Ring 1 */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin"
            style={{ animationDuration: '18s' }}
          />

          {/* Middle Ring 2 */}
          <div
            className="absolute inset-3 rounded-full border-2 border-emerald-400/50"
            style={{
              transform: `rotateX(60deg) rotateY(${hovered ? 45 : 20}deg)`,
              animation: 'spin 12s linear infinite reverse',
            }}
          />

          {/* Inner Ring 3 with Glowing Nodes */}
          <div
            className="absolute inset-6 rounded-full border border-cyan-300/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            style={{
              transform: 'rotateY(60deg)',
              animation: 'spin 8s linear infinite',
            }}
          />

          {/* Glowing Center Core */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-[#00f59b] p-[2px] shadow-[0_0_35px_rgba(0,240,255,0.6)] animate-pulse">
            <div className="w-full h-full bg-[#050b14] rounded-[14px] flex flex-col items-center justify-center text-center p-1">
              <span className="text-2xl animate-bounce">🍗</span>
              <span className="text-[9px] font-mono font-black text-cyan-300 uppercase tracking-tight">
                PROTEIN
              </span>
            </div>
          </div>

          {/* Orbiting Satellite Particle 1 */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00f59b] shadow-[0_0_12px_#00f59b] flex items-center justify-center animate-pulse"
          >
            <span className="text-[8px] text-black font-bold">P</span>
          </div>

          {/* Orbiting Satellite Particle 2 */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] flex items-center justify-center"
          >
            <span className="text-[8px] text-black font-bold">B</span>
          </div>
        </div>

        {/* Floating Telemetry Chips */}
        <div className="w-full space-y-2 mt-4 text-left">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/50 border border-cyan-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white">Leucine Synthesis</span>
            </div>
            <span className="text-xs font-mono font-black text-[#00f59b]">+3.2g / 100g</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/50 border border-cyan-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white">Bio-Availability</span>
            </div>
            <span className="text-xs font-mono font-black text-cyan-300">98.8% DIAAS</span>
          </div>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">
            [ BIO-MOLECULAR CORE // ACTIVE ]
          </span>
        </div>
      </div>
    </div>
  );
};

export const Hero3DRightObject: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="hidden xl:block absolute right-2 2xl:right-8 top-1/2 -translate-y-1/2 w-72 2xl:w-80 pointer-events-auto z-20"
      style={{
        transform: `perspective(1000px) rotateY(${mousePos.x * 0.8}deg) rotateX(${-mousePos.y * 0.8}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.1, 1, 0.1, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Floating Container */}
      <div className="relative flex flex-col items-center justify-center p-6 hardware-chassis rounded-[32px] border border-rose-500/30 shadow-[0_0_50px_rgba(255,45,85,0.15)] group">
        {/* Background Aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        {/* 3D Rotating Gyroscope Rings */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          {/* Outer Ring 1 */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-rose-400/40"
            style={{ animation: 'spin 16s linear infinite' }}
          />

          {/* Middle Ring 2 */}
          <div
            className="absolute inset-3 rounded-full border-2 border-amber-400/50"
            style={{
              transform: `rotateX(60deg) rotateY(${hovered ? -45 : -20}deg)`,
              animation: 'spin 10s linear infinite reverse',
            }}
          />

          {/* Inner Ring 3 with Glowing Nodes */}
          <div
            className="absolute inset-6 rounded-full border border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            style={{
              transform: 'rotateY(-60deg)',
              animation: 'spin 7s linear infinite',
            }}
          />

          {/* Glowing Center Core */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-purple-500 p-[2px] shadow-[0_0_35px_rgba(255,45,85,0.6)] animate-pulse">
            <div className="w-full h-full bg-[#12060b] rounded-[14px] flex flex-col items-center justify-center text-center p-1">
              <span className="text-2xl animate-bounce">🥑</span>
              <span className="text-[9px] font-mono font-black text-rose-300 uppercase tracking-tight">
                ENERGY
              </span>
            </div>
          </div>

          {/* Orbiting Satellite Particle 1 */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ffb800] shadow-[0_0_12px_#ffb800] flex items-center justify-center animate-pulse"
          >
            <span className="text-[8px] text-black font-bold">C</span>
          </div>

          {/* Orbiting Satellite Particle 2 */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ff2d55] shadow-[0_0_12px_#ff2d55] flex items-center justify-center"
          >
            <span className="text-[8px] text-black font-bold">F</span>
          </div>
        </div>

        {/* Floating Telemetry Chips */}
        <div className="w-full space-y-2 mt-4 text-left">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/50 border border-rose-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono font-bold text-white">Daily Calorie Target</span>
            </div>
            <span className="text-xs font-mono font-black text-amber-300">2,000 kcal</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/50 border border-rose-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold text-white">Burn Velocity</span>
            </div>
            <span className="text-xs font-mono font-black text-rose-400">11.5 kcal/m</span>
          </div>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">
            [ KINETIC CALORIE REACTOR // ACTIVE ]
          </span>
        </div>
      </div>
    </div>
  );
};
