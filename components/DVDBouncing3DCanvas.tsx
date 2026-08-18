'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Food3DAsset } from './Food3DAsset';

export interface DVDItemConfig {
  name: string;
  type: string;
  size?: number;
  glowColor?: string;
  initialVx?: number;
  initialVy?: number;
}

interface DVDBouncing3DCanvasProps {
  items: DVDItemConfig[];
  speedMultiplier?: number;
  className?: string;
}

interface ParticleSparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

interface BouncingObjectState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  altitude: number;
  scaleX: number;
  scaleY: number;
  glowIntensity: number;
}

export const DVDBouncing3DCanvas: React.FC<DVDBouncing3DCanvasProps> = ({
  items,
  speedMultiplier = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<BouncingObjectState[]>([]);
  const [particles, setParticles] = useState<ParticleSparkle[]>([]);

  const stateRef = useRef<BouncingObjectState[]>([]);
  const particlesRef = useRef<ParticleSparkle[]>([]);
  const mousePosRef = useRef<{ x: number; y: number; isInside: boolean }>({
    x: -9999,
    y: -9999,
    isInside: false,
  });
  const containerDimensionsRef = useRef<{ w: number; h: number }>({ w: 1200, h: 2800 });
  const animFrameRef = useRef<number | null>(null);

  // Initialize objects across the full height of the page
  useEffect(() => {
    if (!containerRef.current) return;

    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const parentHeight = containerRef.current.parentElement?.scrollHeight || rect.height;
      const w = Math.max(320, rect.width || window.innerWidth);
      const h = Math.max(1200, parentHeight || rect.height || 3000);
      containerDimensionsRef.current = { w, h };
    };

    updateBounds();
    const { w, h } = containerDimensionsRef.current;
    const isMobile = window.innerWidth < 768;

    // Distribute the 8 objects across the full scrollable page height
    const totalItems = items.length;
    const verticalSlot = h / Math.max(1, totalItems);

    const initialStates: BouncingObjectState[] = items.map((item, idx) => {
      const baseSize = item.size || 66;
      const size = isMobile ? Math.round(baseSize * 0.75) : baseSize;

      const x = 30 + (idx % 2 === 0 ? Math.random() * (w * 0.35) : w * 0.52 + Math.random() * (w * 0.35));
      const y = Math.max(50, Math.min(h - size - 50, idx * verticalSlot + (Math.random() * 0.4 + 0.1) * verticalSlot));

      const vxDir = idx % 2 === 0 ? 1.0 : -1.0;
      const vyDir = idx % 3 === 0 ? 0.9 : -0.9;
      const baseVx = (item.initialVx || vxDir * (1.1 + (idx % 3) * 0.2)) * speedMultiplier;
      const baseVy = (item.initialVy || vyDir * (0.9 + (idx % 2) * 0.25)) * speedMultiplier;

      return {
        x: Math.max(10, Math.min(w - size - 10, x)),
        y: Math.max(10, Math.min(h - size - 10, y)),
        vx: baseVx,
        vy: baseVy,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 1.2,
        size,
        altitude: 10,
        scaleX: 1,
        scaleY: 1,
        glowIntensity: 0.5,
      };
    });

    stateRef.current = initialStates;
    setObjects([...initialStates]);

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });
    resizeObserver.observe(containerRef.current);
    if (containerRef.current.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    let lastTime = performance.now();
    let clock = 0;

    const updatePhysics = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.66, 2.0);
      lastTime = now;
      clock += 0.04 * delta;

      const { w: containerW, h: containerH } = containerDimensionsRef.current;

      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        // Exact mouse position relative to container
        const mx = mousePosRef.current.x - bounds.left;
        const my = mousePosRef.current.y - bounds.top;
        const mouseActive = mousePosRef.current.isInside;

        stateRef.current.forEach((obj, i) => {
          const centerX = obj.x + obj.size / 2;
          const centerY = obj.y + obj.size / 2;

          const minSpeed = 0.8 * speedMultiplier;
          const baseSpeed = 1.3 * speedMultiplier;

          // 1. Continuous Magnetic Cursor Throwback Repulsion (Radius = 150px)
          if (mouseActive) {
            const dx = centerX - mx;
            const dy = centerY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 150;

            if (dist < repelRadius && dist > 0.1) {
              const force = (1 - dist / repelRadius) * 3.4;
              const angle = Math.atan2(dy, dx);

              // Throwback velocity kick
              obj.vx += Math.cos(angle) * force * delta;
              obj.vy += Math.sin(angle) * force * delta;
              obj.vRot += (Math.cos(angle) > 0 ? 1 : -1) * force * 2.0 * delta;
              obj.glowIntensity = Math.min(2.0, obj.glowIntensity + 0.2);
              obj.scaleX = 1.25;
              obj.scaleY = 0.85;
            }
          }

          // 2. Elastic Spring Decay for Scale Squish
          obj.scaleX += (1 - obj.scaleX) * 0.12 * delta;
          obj.scaleY += (1 - obj.scaleY) * 0.12 * delta;
          obj.glowIntensity += (0.5 - obj.glowIntensity) * 0.08 * delta;

          // 3. Inertial Drag (smooth deceleration towards base speed)
          const currentSpeed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
          if (currentSpeed > baseSpeed) {
            obj.vx *= Math.pow(0.97, delta);
            obj.vy *= Math.pow(0.97, delta);
          } else if (currentSpeed < minSpeed && currentSpeed > 0.01) {
            obj.vx *= 1.03;
            obj.vy *= 1.03;
          }

          // 4. Angular Drag
          obj.vRot *= Math.pow(0.97, delta);
          if (Math.abs(obj.vRot) < 0.2) {
            obj.vRot = obj.vx > 0 ? 0.4 : -0.4;
          }

          // Update position & rotation
          obj.x += obj.vx * delta;
          obj.y += obj.vy * delta;
          obj.rotation += obj.vRot * delta;
          obj.altitude = Math.sin(clock + i * 1.4) * 8 + 12;

          // 5. Full-Page Wall Collisions with Elastic Impact
          // Left Wall
          if (obj.x <= 0) {
            obj.x = 0;
            obj.vx = Math.abs(obj.vx) * 0.95;
            obj.scaleX = 0.82;
            obj.scaleY = 1.22;
            obj.vRot = (Math.random() - 0.5) * 3;
          }
          // Right Wall
          else if (obj.x + obj.size >= containerW) {
            obj.x = containerW - obj.size;
            obj.vx = -Math.abs(obj.vx) * 0.95;
            obj.scaleX = 0.82;
            obj.scaleY = 1.22;
            obj.vRot = (Math.random() - 0.5) * 3;
          }

          // Top Wall
          if (obj.y <= 0) {
            obj.y = 0;
            obj.vy = Math.abs(obj.vy) * 0.95;
            obj.scaleX = 1.22;
            obj.scaleY = 0.82;
            obj.vRot = (Math.random() - 0.5) * 3;
          }
          // Bottom Wall
          else if (obj.y + obj.size >= containerH) {
            obj.y = containerH - obj.size;
            obj.vy = -Math.abs(obj.vy) * 0.95;
            obj.scaleX = 1.22;
            obj.scaleY = 0.82;
            obj.vRot = (Math.random() - 0.5) * 3;
          }
        });

        // 6. Update Particles Physics
        if (particlesRef.current.length > 0) {
          particlesRef.current.forEach((p) => {
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.opacity -= 0.035 * delta;
            p.size = Math.max(1, p.size - 0.12 * delta);
          });
          particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);
          setParticles([...particlesRef.current]);
        }

        setObjects([...stateRef.current]);
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [items, speedMultiplier]);

  // Global mouse tracking with exact clientX / clientY
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
        isInside: true,
      };
    };

    const handleGlobalMouseLeave = () => {
      mousePosRef.current.isInside = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, []);

  // Direct proximity throwback fling when cursor moves over a shape
  const handleDirectHoverThrowback = useCallback((e: React.MouseEvent, index: number) => {
    if (!stateRef.current[index] || !containerRef.current) return;
    const obj = stateRef.current[index];
    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const centerX = obj.x + obj.size / 2;
    const centerY = obj.y + obj.size / 2;
    const angle = Math.atan2(centerY - cursorY, centerX - cursorX);

    // Instant direct throwback kick
    const kick = 4.2;
    obj.vx = Math.cos(angle) * kick + (obj.vx > 0 ? 1 : -1) * 0.5;
    obj.vy = Math.sin(angle) * kick;
    obj.vRot += (Math.random() > 0.5 ? 1 : -1) * 4;
    obj.scaleX = 1.28;
    obj.scaleY = 0.82;
    obj.glowIntensity = 1.8;
  }, []);

  // Click Blast Impulse + Particle Glow Burst
  const handleClickFlick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!stateRef.current[index] || !containerRef.current) return;
    const obj = stateRef.current[index];
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = obj.x + obj.size / 2;
    const centerY = obj.y + obj.size / 2;
    const angle = Math.atan2(centerY - clickY, centerX - clickX);

    // Explosive impulse
    const impulse = 6.2;
    obj.vx = Math.cos(angle) * impulse;
    obj.vy = Math.sin(angle) * impulse;
    obj.vRot = (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 7);
    obj.scaleX = 1.35;
    obj.scaleY = 0.78;
    obj.glowIntensity = 2.4;

    // Spawn 8 colorful glow particles
    const newParticles: ParticleSparkle[] = [];
    const colors = ['#C4552D', '#3B5842', '#C9822B', '#FFAA00', '#FFFFFF'];
    for (let i = 0; i < 8; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pSpeed = 1.8 + Math.random() * 4.0;
      newParticles.push({
        id: Date.now() + Math.random(),
        x: centerX,
        y: centerY,
        vx: Math.cos(pAngle) * pSpeed,
        vy: Math.sin(pAngle) * pSpeed,
        color: colors[i % colors.length],
        size: 4 + Math.random() * 4,
        opacity: 1,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
    setParticles([...particlesRef.current]);
  }, []);

  const renderDynamicShapeShadow = (type: string, size: number, rot: number, alt: number) => {
    const norm = type.toLowerCase();
    const rad = (rot * Math.PI) / 180;

    const heightFactor = Math.min(1.4, Math.max(0.6, 1 + alt / 35));
    const blurRadius = Math.round(3 + alt * 0.4);
    const shadowOpacity = Math.max(0.12, 0.28 - alt * 0.008);

    const skewDeg = Math.sin(rad) * 16;
    const scaleX = 1 + Math.cos(rad) * 0.15;
    const scaleY = 0.55 + Math.sin(rad * 2) * 0.1;

    let borderRadius = '50%';
    let width = size * 0.75 * heightFactor;
    let height = size * 0.35 * heightFactor;

    if (norm.includes('banana') || norm.includes('chicken')) {
      borderRadius = '60% 40% 70% 30% / 50% 60% 40% 50%';
      width = size * 0.9 * heightFactor;
      height = size * 0.28 * heightFactor;
    } else if (norm.includes('avocado') || norm.includes('strawberry')) {
      borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
      width = size * 0.7 * heightFactor;
      height = size * 0.42 * heightFactor;
    } else if (norm.includes('steak') || norm.includes('meat') || norm.includes('salmon')) {
      borderRadius = '40% 60% 50% 50% / 45% 55% 45% 55%';
      width = size * 0.85 * heightFactor;
      height = size * 0.38 * heightFactor;
    } else if (norm.includes('bread') || norm.includes('cheese') || norm.includes('milk')) {
      borderRadius = '24% 24% 30% 30%';
      width = size * 0.8 * heightFactor;
      height = size * 0.4 * heightFactor;
    }

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius,
          background: 'rgba(24, 21, 19, 0.9)',
          opacity: shadowOpacity,
          filter: `blur(${blurRadius}px)`,
          transform: `rotate(${rot * 0.35}deg) skewX(${skewDeg}deg) scale(${scaleX}, ${scaleY})`,
          transition: 'transform 0.05s linear',
        }}
        className="pointer-events-none mx-auto"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-30 ${className}`}
      style={{ minHeight: '100%' }}
    >
      {/* Particle Sparkle Bursts */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 8px ${p.color}`,
          }}
          className="absolute rounded-full pointer-events-none filter blur-[0.5px]"
        />
      ))}

      {/* Floating 3D Food Objects (Floating upon components with active throwback physics) */}
      {objects.map((obj, idx) => {
        const item = items[idx];
        if (!item) return null;

        const glow = item.glowColor || 'rgba(196, 85, 45, 0.25)';

        return (
          <div
            key={`${item.name}-${idx}`}
            onClick={(e) => handleClickFlick(e, idx)}
            onMouseMove={(e) => handleDirectHoverThrowback(e, idx)}
            style={{
              transform: `translate3d(${obj.x}px, ${obj.y}px, 0)`,
              width: `${obj.size}px`,
              height: `${obj.size + 24}px`,
              willChange: 'transform',
            }}
            className="absolute top-0 left-0 pointer-events-auto cursor-pointer group flex flex-col items-center justify-between transition-transform duration-75 ease-linear drop-shadow-xl"
            title={`Click to blast or move cursor close to push ${item.name}!`}
          >
            {/* 3D Object with Altitude, Rotation and Squish */}
            <div
              style={{
                transform: `translateY(${-obj.altitude}px) rotate(${obj.rotation}deg) scale(${obj.scaleX}, ${obj.scaleY})`,
                width: `${obj.size}px`,
                height: `${obj.size}px`,
              }}
              className="relative transition-transform duration-75 ease-linear"
            >
              {/* Dynamic Aura Glow */}
              <div
                style={{
                  background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                  opacity: obj.glowIntensity,
                }}
                className="absolute -inset-5 rounded-full filter blur-lg pointer-events-none transition-opacity duration-150"
              />

              {/* 3D Rendered Asset */}
              <div className="relative z-10 w-full h-full transform-gpu group-hover:scale-115 active:scale-90 transition-transform duration-150 filter drop-shadow-md">
                <Food3DAsset name={item.name} type={item.type} size={obj.size} />
              </div>
            </div>

            {/* Shape-Aware Ground Projection Shadow */}
            <div className="w-full flex items-center justify-center -mt-2">
              {renderDynamicShapeShadow(item.type, obj.size, obj.rotation, obj.altitude)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
