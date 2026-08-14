'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Food3DAsset } from './Food3DAsset';

interface DVDItemConfig {
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
  const animFrameRef = useRef<number | null>(null);

  // Initialize objects
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width || 800;
    const h = rect.height || 400;
    const isMobile = window.innerWidth < 768;

    const initialStates: BouncingObjectState[] = items.map((item, idx) => {
      const baseSize = item.size || 60;
      const size = isMobile ? Math.round(baseSize * 0.75) : baseSize;
      
      const quadX = (idx % 2) * (w / 2) + Math.random() * (w / 3);
      const quadY = Math.floor(idx / 2) * (h / 2) + Math.random() * (h / 3);

      const baseVx = (item.initialVx || (idx % 2 === 0 ? 1.0 : -1.0)) * speedMultiplier;
      const baseVy = (item.initialVy || (idx < 2 ? 0.9 : -0.9)) * speedMultiplier;

      return {
        x: Math.max(10, Math.min(w - size - 10, quadX)),
        y: Math.max(10, Math.min(h - size - 10, quadY)),
        vx: baseVx,
        vy: baseVy,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 1.2,
        size,
        altitude: 8,
        scaleX: 1,
        scaleY: 1,
        glowIntensity: 0.5,
      };
    });

    stateRef.current = initialStates;
    setObjects([...initialStates]);

    let lastTime = performance.now();
    let clock = 0;

    const updatePhysics = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.66, 2.0);
      lastTime = now;
      clock += 0.04 * delta;

      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const containerW = bounds.width;
        const containerH = bounds.height;
        const mx = mousePosRef.current.x - bounds.left;
        const my = mousePosRef.current.y - bounds.top;
        const mouseActive = mousePosRef.current.isInside;

        stateRef.current.forEach((obj, i) => {
          // Center of the 3D object
          const centerX = obj.x + obj.size / 2;
          const centerY = obj.y + obj.size / 2;

          // 1. Natural Floating Base Speeds
          const minSpeed = 0.8 * speedMultiplier;
          const baseSpeed = 1.2 * speedMultiplier;

          // 2. Smooth Continuous Magnetic Cursor Repulsion (Radius = 140px)
          if (mouseActive) {
            const dx = centerX - mx;
            const dy = centerY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 135;

            if (dist < repelRadius && dist > 1) {
              const force = (1 - dist / repelRadius) * 2.8;
              const angle = Math.atan2(dy, dx);
              
              // Apply smooth push vector
              obj.vx += Math.cos(angle) * force * delta;
              obj.vy += Math.sin(angle) * force * delta;
              obj.vRot += (Math.cos(angle) > 0 ? 1 : -1) * force * 1.8 * delta;
              obj.glowIntensity = Math.min(1.5, obj.glowIntensity + 0.15);
              obj.scaleX = 1.15;
              obj.scaleY = 0.9;
            }
          }

          // 3. Elastic Spring Decay for Scale Squish
          obj.scaleX += (1 - obj.scaleX) * 0.12 * delta;
          obj.scaleY += (1 - obj.scaleY) * 0.12 * delta;
          obj.glowIntensity += (0.5 - obj.glowIntensity) * 0.08 * delta;

          // 4. Inertial Drag (smooth deceleration towards base speed)
          const currentSpeed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
          if (currentSpeed > baseSpeed) {
            obj.vx *= Math.pow(0.96, delta);
            obj.vy *= Math.pow(0.96, delta);
          } else if (currentSpeed < minSpeed && currentSpeed > 0.01) {
            obj.vx *= 1.04;
            obj.vy *= 1.04;
          }

          // 5. Angular Drag
          obj.vRot *= Math.pow(0.97, delta);
          if (Math.abs(obj.vRot) < 0.2) {
            obj.vRot = (obj.vx > 0 ? 0.4 : -0.4);
          }

          // Update position & rotation
          obj.x += obj.vx * delta;
          obj.y += obj.vy * delta;
          obj.rotation += obj.vRot * delta;
          obj.altitude = Math.sin(clock + i * 1.5) * 6 + 10;

          // 6. Wall Collisions with Elastic Impact
          // Left Wall
          if (obj.x <= 0) {
            obj.x = 0;
            obj.vx = Math.abs(obj.vx) * 0.95;
            obj.scaleX = 0.85;
            obj.scaleY = 1.2;
            obj.vRot = (Math.random() - 0.5) * 3;
          }
          // Right Wall
          else if (obj.x + obj.size >= containerW) {
            obj.x = containerW - obj.size;
            obj.vx = -Math.abs(obj.vx) * 0.95;
            obj.scaleX = 0.85;
            obj.scaleY = 1.2;
            obj.vRot = (Math.random() - 0.5) * 3;
          }

          // Top Wall
          if (obj.y <= 0) {
            obj.y = 0;
            obj.vy = Math.abs(obj.vy) * 0.95;
            obj.scaleX = 1.2;
            obj.scaleY = 0.85;
            obj.vRot = (Math.random() - 0.5) * 3;
          }
          // Bottom Wall
          else if (obj.y + obj.size >= containerH) {
            obj.y = containerH - obj.size;
            obj.vy = -Math.abs(obj.vy) * 0.95;
            obj.scaleX = 1.2;
            obj.scaleY = 0.85;
            obj.vRot = (Math.random() - 0.5) * 3;
          }
        });

        // 7. Update Particles Physics
        if (particlesRef.current.length > 0) {
          particlesRef.current.forEach((p) => {
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.opacity -= 0.035 * delta;
            p.size = Math.max(1, p.size - 0.1 * delta);
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
    };
  }, [items, speedMultiplier]);

  // Listen to window mouse movement so cursor repulsion tracks smoothly everywhere
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

  // Click Blast Impulse + Particle Glow Burst
  const handleClickFlick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!stateRef.current[index] || !containerRef.current) return;
    const obj = stateRef.current[index];
    const item = items[index];
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = obj.x + obj.size / 2;
    const centerY = obj.y + obj.size / 2;
    const angle = Math.atan2(centerY - clickY, centerX - clickX);

    // Explosive impulse
    const impulse = 5.5;
    obj.vx = Math.cos(angle) * impulse;
    obj.vy = Math.sin(angle) * impulse;
    obj.vRot = (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 6);
    obj.scaleX = 1.35;
    obj.scaleY = 0.8;
    obj.glowIntensity = 2.0;

    // Spawn 8 colorful glow particles
    const newParticles: ParticleSparkle[] = [];
    const colors = ['#C4552D', '#3B5842', '#C9822B', '#FFAA00', '#FFFFFF'];
    for (let i = 0; i < 8; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pSpeed = 1.5 + Math.random() * 3.5;
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
  }, [items]);

  // Render geometry-specific shadow projection
  const renderDynamicShapeShadow = (type: string, size: number, rot: number, alt: number) => {
    const norm = type.toLowerCase();
    const rad = (rot * Math.PI) / 180;
    
    const heightFactor = Math.min(1.4, Math.max(0.6, 1 + alt / 35));
    const blurRadius = Math.round(3 + alt * 0.4);
    const shadowOpacity = Math.max(0.12, 0.30 - alt * 0.008);

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
    } else if (norm.includes('steak') || norm.includes('meat')) {
      borderRadius = '40% 60% 50% 50% / 45% 55% 45% 55%';
      width = size * 0.85 * heightFactor;
      height = size * 0.38 * heightFactor;
    } else if (norm.includes('bread') || norm.includes('chocolate') || norm.includes('cheese')) {
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
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-20 ${className}`}
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

      {/* Floating 3D Food Objects */}
      {objects.map((obj, idx) => {
        const item = items[idx];
        if (!item) return null;

        const glow = item.glowColor || 'rgba(196, 85, 45, 0.25)';

        return (
          <div
            key={`${item.name}-${idx}`}
            onClick={(e) => handleClickFlick(e, idx)}
            style={{
              transform: `translate3d(${obj.x}px, ${obj.y}px, 0)`,
              width: `${obj.size}px`,
              height: `${obj.size + 24}px`,
              willChange: 'transform',
            }}
            className="absolute top-0 left-0 pointer-events-auto cursor-pointer group flex flex-col items-center justify-between transition-transform duration-75 ease-linear"
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
                className="absolute -inset-4 rounded-full filter blur-md pointer-events-none transition-opacity duration-150"
              />

              {/* 3D Rendered Asset */}
              <div className="relative z-10 w-full h-full transform-gpu group-hover:scale-115 active:scale-90 transition-transform duration-150">
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
