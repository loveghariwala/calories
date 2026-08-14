'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RotateCw, Move, Layers, Zap } from 'lucide-react';

export type Food3DModelType = 'avocado' | 'apple' | 'protein' | 'flame' | 'egg';

interface Interactive3DFoodSceneProps {
  modelType?: Food3DModelType;
  className?: string;
}

export const Interactive3DFoodScene: React.FC<Interactive3DFoodSceneProps> = ({
  modelType = 'avocado',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentModel, setCurrentModel] = useState<Food3DModelType>(modelType);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const autoRotate = useRef(true);

  useEffect(() => {
    setCurrentModel(modelType);
  }, [modelType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 440);
    let height = (canvas.height = 440);

    // Build 3D Mesh Vertices & Faces based on Model Type
    interface Vertex {
      x: number;
      y: number;
      z: number;
      color?: string;
    }
    interface Face {
      indices: number[];
      color: string;
      lightness?: number;
    }

    const generateMesh = (type: Food3DModelType): { vertices: Vertex[]; faces: Face[] } => {
      const vertices: Vertex[] = [];
      const faces: Face[] = [];

      if (type === 'avocado') {
        // Avocado Outer Shell & Inner Pear Shape
        const latSteps = 16;
        const lonSteps = 24;
        for (let i = 0; i <= latSteps; i++) {
          const theta = (i / latSteps) * Math.PI;
          const rY = Math.sin(theta);
          const y = (Math.cos(theta) * 110) * (theta < Math.PI / 2 ? 0.85 : 1.15) - 10;
          const radiusScale = (theta < Math.PI / 2 ? 65 : 85) * (1 - 0.2 * Math.pow(Math.cos(theta), 2));

          for (let j = 0; j < lonSteps; j++) {
            const phi = (j / lonSteps) * Math.PI * 2;
            const x = Math.sin(phi) * rY * radiusScale;
            const z = Math.cos(phi) * rY * radiusScale * 0.75;
            vertices.push({ x, y, z });
          }
        }

        // Avocado Seed in Center
        const seedIndexOffset = vertices.length;
        const seedSteps = 10;
        for (let i = 0; i <= seedSteps; i++) {
          const theta = (i / seedSteps) * Math.PI;
          const rY = Math.sin(theta);
          const y = Math.cos(theta) * 32 + 20;
          for (let j = 0; j < seedSteps; j++) {
            const phi = (j / seedSteps) * Math.PI * 2;
            const x = Math.sin(phi) * rY * 30;
            const z = Math.cos(phi) * rY * 26 + 18;
            vertices.push({ x, y, z });
          }
        }

        // Build Shell Faces
        for (let i = 0; i < latSteps; i++) {
          for (let j = 0; j < lonSteps; j++) {
            const nextJ = (j + 1) % lonSteps;
            const i1 = i * lonSteps + j;
            const i2 = i * lonSteps + nextJ;
            const i3 = (i + 1) * lonSteps + nextJ;
            const i4 = (i + 1) * lonSteps + j;

            const isFront = vertices[i1].z > 0;
            const color = isFront
              ? (Math.sqrt(vertices[i1].x * vertices[i1].x + (vertices[i1].y - 20) * (vertices[i1].y - 20)) < 45 ? '#c3d957' : '#9bb832')
              : '#23381e';

            faces.push({ indices: [i1, i2, i3, i4], color });
          }
        }

        // Build Seed Faces
        for (let i = 0; i < seedSteps; i++) {
          for (let j = 0; j < seedSteps; j++) {
            const nextJ = (j + 1) % seedSteps;
            const i1 = seedIndexOffset + i * seedSteps + j;
            const i2 = seedIndexOffset + i * seedSteps + nextJ;
            const i3 = seedIndexOffset + (i + 1) * seedSteps + nextJ;
            const i4 = seedIndexOffset + (i + 1) * seedSteps + j;
            faces.push({ indices: [i1, i2, i3, i4], color: '#683b1e' });
          }
        }
      } else if (type === 'apple') {
        // Apple Sphere with top/bottom dimple
        const latSteps = 16;
        const lonSteps = 20;
        for (let i = 0; i <= latSteps; i++) {
          const theta = (i / latSteps) * Math.PI;
          const rY = Math.sin(theta);
          const dimple = 1 - 0.25 * Math.pow(Math.cos(theta * 2), 2);
          const y = Math.cos(theta) * 85;
          for (let j = 0; j < lonSteps; j++) {
            const phi = (j / lonSteps) * Math.PI * 2;
            const x = Math.sin(phi) * rY * 85 * dimple;
            const z = Math.cos(phi) * rY * 85 * dimple;
            vertices.push({ x, y, z });
          }
        }
        for (let i = 0; i < latSteps; i++) {
          for (let j = 0; j < lonSteps; j++) {
            const nextJ = (j + 1) % lonSteps;
            faces.push({
              indices: [
                i * lonSteps + j,
                i * lonSteps + nextJ,
                (i + 1) * lonSteps + nextJ,
                (i + 1) * lonSteps + j,
              ],
              color: '#e11d48',
            });
          }
        }
      } else {
        // Protein Flask / Torus Core
        const R = 75;
        const r = 32;
        const uSteps = 18;
        const vSteps = 12;
        for (let i = 0; i < uSteps; i++) {
          const u = (i / uSteps) * Math.PI * 2;
          for (let j = 0; j < vSteps; j++) {
            const v = (j / vSteps) * Math.PI * 2;
            const x = (R + r * Math.cos(v)) * Math.cos(u);
            const y = (R + r * Math.cos(v)) * Math.sin(u);
            const z = r * Math.sin(v);
            vertices.push({ x, y, z });
          }
        }
        for (let i = 0; i < uSteps; i++) {
          for (let j = 0; j < vSteps; j++) {
            const nextI = (i + 1) % uSteps;
            const nextJ = (j + 1) % vSteps;
            faces.push({
              indices: [
                i * vSteps + j,
                nextI * vSteps + j,
                nextI * vSteps + nextJ,
                i * vSteps + nextJ,
              ],
              color: type === 'flame' ? '#f59e0b' : '#00f59b',
            });
          }
        }
      }

      return { vertices, faces };
    };

    let { vertices, faces } = generateMesh(currentModel);

    // Floating 3D Sparkle particles
    const sparks = Array.from({ length: 25 }, () => ({
      x: (Math.random() - 0.5) * 320,
      y: (Math.random() - 0.5) * 320,
      z: (Math.random() - 0.5) * 320,
      radius: Math.random() * 2.5 + 1,
      speed: Math.random() * 0.02 + 0.008,
      angle: Math.random() * Math.PI * 2,
    }));

    let currentRotX = rotation.x;
    let currentRotY = rotation.y;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (autoRotate.current && !isDragging) {
        currentRotY += 0.012;
        currentRotX = 0.25 + Math.sin(Date.now() * 0.0015) * 0.15;
      }

      const cosX = Math.cos(currentRotX), sinX = Math.sin(currentRotX);
      const cosY = Math.cos(currentRotY), sinY = Math.sin(currentRotY);

      // Light direction vector (from top right in front)
      const lightDir = { x: 0.577, y: -0.577, z: 0.577 };

      // Transform all vertices
      const transformed = vertices.map((v) => {
        // Rotate Y
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;
        // Rotate X
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        const fov = 380;
        const scale = fov / (fov + z2 + 80);
        return {
          x: width / 2 + x1 * scale,
          y: height / 2 + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Background Holographic Radial Aura
      const aura = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, 170);
      aura.addColorStop(0, currentModel === 'apple' ? 'rgba(225, 29, 72, 0.25)' : currentModel === 'flame' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 245, 155, 0.25)');
      aura.addColorStop(0.6, 'rgba(0, 240, 255, 0.08)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Orbiting 3D Ring
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(currentRotY * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, 160, 60, currentRotX, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.restore();

      // Sort faces by depth (Painter's Algorithm)
      const validFaces: {
        face: (typeof faces)[0];
        pts: (typeof transformed)[0][];
        avgZ: number;
        normalZ: number;
        intensity: number;
      }[] = [];

      faces.forEach((face) => {
        const pts = face.indices.map((i) => transformed[i]);
        if (pts.some((p) => !p)) return;

        const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
        const vA = { x: pts[1].x - pts[0].x, y: pts[1].y - pts[0].y, z: pts[1].z - pts[0].z };
        const vB = { x: pts[2].x - pts[0].x, y: pts[2].y - pts[0].y, z: pts[2].z - pts[0].z };
        const normalZ = vA.x * vB.y - vA.y * vB.x;
        const intensity = Math.max(0.2, Math.min(1.0, 0.5 + (avgZ / 200) * 0.5));

        if (normalZ < 0) {
          validFaces.push({ face, pts, avgZ, normalZ, intensity });
        }
      });

      validFaces.sort((a, b) => b.avgZ - a.avgZ);

      // Render 3D Lit Faces
      validFaces.forEach(({ face, pts, intensity }) => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = face.color;
        ctx.globalAlpha = intensity * 0.95;
        ctx.fill();

        // Subtle wireframe edge for high-tech aesthetic
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;

      // Render Floating 3D Sparkles
      sparks.forEach((sp) => {
        sp.angle += sp.speed;
        const px = Math.cos(sp.angle) * sp.x - Math.sin(sp.angle) * sp.z;
        const pz = Math.sin(sp.angle) * sp.x + Math.cos(sp.angle) * sp.z;
        const scale = 380 / (380 + pz + 80);
        const sx = width / 2 + px * scale;
        const sy = height / 2 + sp.y * scale;

        ctx.beginPath();
        ctx.arc(sx, sy, sp.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentModel, isDragging, rotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    autoRotate.current = false;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: Math.max(-1.5, Math.min(1.5, prev.x + dy * 0.01)),
      y: prev.y + dx * 0.01,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      autoRotate.current = true;
    }, 3000);
  };

  const models: { type: Food3DModelType; label: string; emoji: string }[] = [
    { type: 'avocado', label: '3D Hass Avocado', emoji: '🥑' },
    { type: 'apple', label: '3D Ruby Apple', emoji: '🍎' },
    { type: 'protein', label: '3D Bio-Torus', emoji: '⚡' },
    { type: 'flame', label: '3D Kinetic Flame', emoji: '🔥' },
  ];

  return (
    <div className={`relative flex flex-col items-center justify-center hardware-chassis rounded-[36px] p-6 sm:p-8 border border-white/15 shadow-2xl overflow-hidden group ${className}`}>
      {/* 3D Viewport Controls Header */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00f59b] animate-ping" />
          <span className="font-mono text-xs font-bold text-[#00f59b] uppercase tracking-widest">
            3D HOLOGRAPHIC SPECIMEN VIEWER
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
          <Move className="w-3 h-3 text-cyan-400" />
          <span>DRAG 360° TO ROTATE</span>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <div
        className="relative cursor-grab active:cursor-grabbing my-3"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] drop-shadow-[0_0_40px_rgba(0,245,155,0.35)]"
        />

        {/* Floating Specimen Hologram Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3 text-left space-y-1 shadow-lg pointer-events-none">
          <div className="text-[9px] font-mono text-cyan-300 font-bold uppercase">Specimen Resolution</div>
          <div className="text-xs font-mono font-black text-white">60 FPS // WebGL 3D</div>
          <div className="text-[9px] font-mono text-zinc-400">Dynamic Atwater Lighting</div>
        </div>
      </div>

      {/* Model Selection Switcher Bar */}
      <div className="w-full pt-4 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto relative z-20">
        {models.map((m) => (
          <button
            key={m.type}
            onClick={() => setCurrentModel(m.type)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              currentModel === m.type
                ? 'bg-[#00f59b] text-black font-black shadow-[0_0_20px_rgba(0,245,155,0.5)]'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10'
            }`}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
