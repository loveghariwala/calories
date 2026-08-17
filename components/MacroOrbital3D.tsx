'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MacroOrbital3DProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  size?: number;
  interactive?: boolean;
}

export const MacroOrbital3D: React.FC<MacroOrbital3DProps> = ({
  calories,
  protein,
  carbs,
  fat,
  fiber = 0,
  size = 280,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 15, y: 25 });
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Scale canvas for retina display
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const totalMacroGrams = protein + carbs + fat || 1;
    const pRatio = protein / totalMacroGrams;
    const cRatio = carbs / totalMacroGrams;
    const fRatio = fat / totalMacroGrams;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const centerX = size / 2;
      const centerY = size / 2;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      angle += isHovered ? 0.025 : 0.012;

      // 1. Ambient Glow Core
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        size * 0.42
      );
      coreGradient.addColorStop(0, 'rgba(196, 85, 45, 0.18)');
      coreGradient.addColorStop(0.5, 'rgba(201, 130, 43, 0.08)');
      coreGradient.addColorStop(1, 'rgba(250, 248, 245, 0)');
      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, size, size);

      // Helper function to draw 3D Orbiting Ring
      const drawOrbitRing = (
        radiusX: number,
        radiusY: number,
        tiltAngle: number,
        rotationOffset: number,
        color: string,
        lineWidth: number,
        activeRatio: number,
        particleColor: string
      ) => {
        ctx.save();
        ctx.translate(centerX + mouseRef.current.x * 12, centerY + mouseRef.current.y * 12);
        ctx.rotate(tiltAngle);

        // Orbit Ellipse path
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(234, 227, 217, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active Macro Arc
        const startAngle = angle * rotationOffset;
        const arcLength = Math.max(0.4, activeRatio * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, startAngle, startAngle + arcLength);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glowing 3D Particle on Head
        const headAngle = startAngle + arcLength;
        const particleX = Math.cos(headAngle) * radiusX;
        const particleY = Math.sin(headAngle) * radiusY;

        ctx.beginPath();
        ctx.arc(particleX, particleY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(particleX, particleY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        ctx.restore();
      };

      // Outer Orbit: Protein (Forest Olive Glow)
      drawOrbitRing(
        size * 0.4,
        size * 0.16,
        -Math.PI / 6 + mouseRef.current.y * 0.2,
        1.1,
        '#3B5842',
        3.5,
        pRatio,
        '#527A5C'
      );

      // Middle Orbit: Carbohydrates (Warm Gold Sunburst)
      drawOrbitRing(
        size * 0.32,
        size * 0.14,
        Math.PI / 4 + mouseRef.current.x * 0.2,
        -1.3,
        '#C9822B',
        3,
        cRatio,
        '#E59E44'
      );

      // Inner Orbit: Dietary Lipids (Terracotta Core)
      drawOrbitRing(
        size * 0.24,
        size * 0.11,
        -Math.PI / 3 + mouseRef.current.y * 0.15,
        1.5,
        '#C4552D',
        2.5,
        fRatio,
        '#E06B42'
      );

      // Center Metabolic Nexus Sphere
      ctx.save();
      ctx.translate(centerX + mouseRef.current.x * 8, centerY + mouseRef.current.y * 8);

      const sphereGrad = ctx.createRadialGradient(-6, -6, 2, 0, 0, 24);
      sphereGrad.addColorStop(0, '#FFFFFF');
      sphereGrad.addColorStop(0.3, '#FAF8F5');
      sphereGrad.addColorStop(0.8, '#EAE3D9');
      sphereGrad.addColorStop(1, '#D4C8BA');

      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.shadowColor = 'rgba(196, 85, 45, 0.25)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Pulsing Center Ring
      ctx.beginPath();
      ctx.arc(0, 0, 26 + Math.sin(angle * 3) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196, 85, 45, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [calories, protein, carbs, fat, fiber, size, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current.targetX = nx * 2;
    mouseRef.current.targetY = ny * 2;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    setIsHovered(false);
  };

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-pointer group"
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="transform-gpu transition-transform duration-300 group-hover:scale-105"
      />

      {/* Floating Center Calorie Badge */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none transform-gpu transition-transform duration-200 group-hover:scale-110">
        <span className="text-xl sm:text-2xl font-serif font-bold text-[#181513] leading-none drop-shadow-xs">
          {calories}
        </span>
        <span className="text-[9px] font-sans font-bold tracking-widest uppercase text-[#C4552D] mt-0.5">
          kcal
        </span>
      </div>
    </div>
  );
};
