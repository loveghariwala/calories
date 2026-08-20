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
  showCenterText?: boolean;
}

export const MacroOrbital3D: React.FC<MacroOrbital3DProps> = ({
  calories,
  protein,
  carbs,
  fat,
  fiber = 0,
  size = 140,
  interactive = true,
  showCenterText = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
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

      angle += isHovered ? 0.02 : 0.01;

      // 1. Ambient Glow Core
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        size * 0.05,
        centerX,
        centerY,
        size * 0.45
      );
      coreGradient.addColorStop(0, 'rgba(196, 85, 45, 0.15)');
      coreGradient.addColorStop(0.5, 'rgba(201, 130, 43, 0.06)');
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
        ctx.translate(centerX + mouseRef.current.x * (size * 0.05), centerY + mouseRef.current.y * (size * 0.05));
        ctx.rotate(tiltAngle);

        // Orbit Ellipse background path
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(234, 227, 217, 0.7)';
        ctx.lineWidth = Math.max(1, lineWidth * 0.4);
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active Macro Arc
        const startAngle = angle * rotationOffset;
        const arcLength = Math.max(0.35, activeRatio * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, startAngle, startAngle + arcLength);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glowing 3D Particle on Head
        const headAngle = startAngle + arcLength;
        const particleX = Math.cos(headAngle) * radiusX;
        const particleY = Math.sin(headAngle) * radiusY;

        ctx.beginPath();
        ctx.arc(particleX, particleY, Math.max(2.5, size * 0.025), 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(particleX, particleY, Math.max(1.5, size * 0.015), 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        ctx.restore();
      };

      // Outer Orbit: Protein (Forest Olive Glow)
      drawOrbitRing(
        size * 0.38,
        size * 0.16,
        -Math.PI / 6 + mouseRef.current.y * 0.15,
        1.1,
        '#3B5842',
        Math.max(2, size * 0.02),
        pRatio,
        '#527A5C'
      );

      // Middle Orbit: Carbohydrates (Warm Gold Sunburst)
      drawOrbitRing(
        size * 0.30,
        size * 0.13,
        Math.PI / 4 + mouseRef.current.x * 0.15,
        -1.3,
        '#C9822B',
        Math.max(1.8, size * 0.018),
        cRatio,
        '#E59E44'
      );

      // Inner Orbit: Dietary Lipids (Terracotta Core)
      drawOrbitRing(
        size * 0.22,
        size * 0.10,
        -Math.PI / 3 + mouseRef.current.y * 0.12,
        1.5,
        '#C4552D',
        Math.max(1.6, size * 0.016),
        fRatio,
        '#E06B42'
      );

      // Center Core Sphere
      ctx.save();
      ctx.translate(centerX + mouseRef.current.x * (size * 0.03), centerY + mouseRef.current.y * (size * 0.03));

      const sphereRadius = Math.max(8, size * 0.08);
      const sphereGrad = ctx.createRadialGradient(-sphereRadius * 0.3, -sphereRadius * 0.3, 1, 0, 0, sphereRadius);
      sphereGrad.addColorStop(0, '#FFFFFF');
      sphereGrad.addColorStop(0.3, '#FAF8F5');
      sphereGrad.addColorStop(0.8, '#EAE3D9');
      sphereGrad.addColorStop(1, '#D4C8BA');

      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.shadowColor = 'rgba(196, 85, 45, 0.2)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pulsing Center Ring
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius + 3 + Math.sin(angle * 3) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196, 85, 45, 0.35)';
      ctx.lineWidth = 1;
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

      {showCenterText && (
        <div className="absolute flex flex-col items-center justify-center pointer-events-none transform-gpu transition-transform duration-200 group-hover:scale-110">
          <span className="text-sm sm:text-base font-serif font-bold text-[#181513] leading-none">
            {calories}
          </span>
          <span className="text-[8px] font-sans font-bold tracking-widest uppercase text-[#C4552D] mt-0.5">
            kcal
          </span>
        </div>
      )}
    </div>
  );
};
