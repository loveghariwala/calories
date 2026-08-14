'use client';

import React, { useEffect, useRef } from 'react';

export const Hero3DLeftCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 360);
    let height = (canvas.height = 360);

    // 3D Wireframe Icosahedron / Molecule Vertices
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const baseVertices = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ].map(([x, y, z]) => {
      const mag = Math.sqrt(x * x + y * y + z * z);
      return [x / mag * 90, y / mag * 90, z / mag * 90];
    });

    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [1, 9], [1, 8], [1, 7],
      [2, 11], [2, 4], [2, 3], [2, 6], [2, 10],
      [3, 4], [3, 9], [3, 8], [3, 6],
      [4, 5], [4, 9], [4, 11],
      [5, 9],
      [6, 7], [6, 8], [6, 10],
      [7, 8],
      [8, 9],
      [10, 11]
    ];

    // Floating particles around molecule
    const particles = Array.from({ length: 30 }, () => ({
      x: (Math.random() - 0.5) * 260,
      y: (Math.random() - 0.5) * 260,
      z: (Math.random() - 0.5) * 260,
      radius: Math.random() * 2 + 1,
      speed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRotY = (e.clientX - cx) * 0.003;
      targetRotX = -(e.clientY - cy) * 0.003;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotX += (targetRotX - rotX) * 0.05 + 0.005;
      rotY += (targetRotY - rotY) * 0.05 + 0.008;
      rotZ += 0.003;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      // Transform Vertices
      const projected = baseVertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;
        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        // Rotate Z
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        const fov = 350;
        const scale = fov / (fov + z2 + 100);
        return {
          x: width / 2 + x3 * scale,
          y: height / 2 + y3 * scale,
          z: z2,
          scale,
        };
      });

      // Draw Glowing Background Aura
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, 140);
      grad.addColorStop(0, 'rgba(0, 245, 155, 0.25)');
      grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Orbiting Rings
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rotY * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 130, 45, rotX, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      // Draw Edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.15, (avgZ + 100) / 200);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 245, 155, ${alpha * 0.7})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#00f59b';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Glowing Vertices (Protein Nodes)
      projected.forEach((p) => {
        const alpha = Math.max(0.2, (p.z + 100) / 200);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Center Nucleus Pulse
      const pulse = Math.sin(Date.now() * 0.004) * 3;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 14 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 245, 155, 0.9)';
      ctx.shadowColor = '#00f59b';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Floating Micro Particles
      particles.forEach((pt) => {
        pt.angle += pt.speed;
        const px = Math.cos(pt.angle) * pt.x - Math.sin(pt.angle) * pt.z;
        const pz = Math.sin(pt.angle) * pt.x + Math.cos(pt.angle) * pt.z;
        const fov = 350;
        const scale = fov / (fov + pz + 100);
        const screenX = width / 2 + px * scale;
        const screenY = height / 2 + pt.y * scale;

        ctx.beginPath();
        ctx.arc(screenX, screenY, pt.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none group">
      <canvas
        ref={canvasRef}
        className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] 2xl:w-[380px] 2xl:h-[380px] drop-shadow-[0_0_35px_rgba(0,245,155,0.4)]"
      />
      {/* Floating Holographic Caption (No Box, pure typography & glowing line) */}
      <div className="mt-[-20px] flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00f59b] uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f59b] animate-ping" />
          3D PROTEIN MOLECULE
        </span>
        <span className="text-[9px] font-mono text-zinc-400">Leucine Bio-Synthesis</span>
      </div>
    </div>
  );
};

export const Hero3DRightCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 360);
    let height = (canvas.height = 360);

    // 3D Torus Points Generation
    const R = 75; // Major radius
    const r = 32; // Minor radius
    const segmentsU = 20;
    const segmentsV = 12;

    const torusPoints: [number, number, number][] = [];
    for (let i = 0; i < segmentsU; i++) {
      const u = (i / segmentsU) * Math.PI * 2;
      for (let j = 0; j < segmentsV; j++) {
        const v = (j / segmentsV) * Math.PI * 2;
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);
        torusPoints.push([x, y, z]);
      }
    }

    let rotX = 0.5;
    let rotY = 0;
    let rotZ = 0;
    let targetRotX = 0.5;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRotY = (e.clientX - cx) * 0.003;
      targetRotX = -(e.clientY - cy) * 0.003 + 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotX += (targetRotX - rotX) * 0.05 + 0.006;
      rotY += (targetRotY - rotY) * 0.05 + 0.01;
      rotZ += 0.004;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      // Transform Torus Vertices
      const projected = torusPoints.map(([x, y, z]) => {
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        const fov = 350;
        const scale = fov / (fov + z2 + 100);
        return {
          x: width / 2 + x3 * scale,
          y: height / 2 + y3 * scale,
          z: z2,
          scale,
        };
      });

      // Draw Glowing Background Aura
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, 140);
      grad.addColorStop(0, 'rgba(255, 45, 85, 0.25)');
      grad.addColorStop(0.5, 'rgba(255, 184, 0, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Outer Orbit
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-rotY * 0.6);
      ctx.beginPath();
      ctx.ellipse(0, 0, 135, 50, rotX * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 184, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      // Connect Torus Grid Lines
      for (let i = 0; i < segmentsU; i++) {
        for (let j = 0; j < segmentsV; j++) {
          const idx = i * segmentsV + j;
          const nextU = ((i + 1) % segmentsU) * segmentsV + j;
          const nextV = i * segmentsV + ((j + 1) % segmentsV);

          const p = projected[idx];
          const pU = projected[nextU];
          const pV = projected[nextV];

          const alpha = Math.max(0.12, (p.z + 100) / 200);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pU.x, pU.y);
          ctx.strokeStyle = `rgba(255, 45, 85, ${alpha * 0.55})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pV.x, pV.y);
          ctx.strokeStyle = `rgba(255, 184, 0, ${alpha * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw Nodes
      projected.forEach((p) => {
        const alpha = Math.max(0.25, (p.z + 100) / 200);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 184, 0, ${alpha})`;
        ctx.shadowColor = '#ffb800';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Center Calorie Plasma Core
      const pulse = Math.sin(Date.now() * 0.005) * 4;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 16 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 45, 85, 0.9)';
      ctx.shadowColor = '#ff2d55';
      ctx.shadowBlur = 28;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none group">
      <canvas
        ref={canvasRef}
        className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] 2xl:w-[380px] 2xl:h-[380px] drop-shadow-[0_0_35px_rgba(255,45,85,0.4)]"
      />
      {/* Floating Holographic Caption (No Box, pure typography & glowing line) */}
      <div className="mt-[-20px] flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff2d55] uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55] animate-ping" />
          3D CALORIE TORUS REACTOR
        </span>
        <span className="text-[9px] font-mono text-zinc-400">Kinetic Energy Synthesis</span>
      </div>
    </div>
  );
};
