import React, { useEffect, useRef, useState } from 'react';

interface WarpCanvasProps {
  onGameOver: (score: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface WarpPortal {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  createdAt: number;
  life: number;
  maxLife: number;
}

interface ChaosEntity {
  x: number;
  y: number;
  speed: number;
  angle: number;
  radius: number;
}

export const WarpCanvas: React.FC<WarpCanvasProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState(0);
  const [life, setLife] = useState(100);
  const scoreRef = useRef(0);
  const lifeRef = useRef(100);
  
  // Game state
  const portalsRef = useRef<WarpPortal[]>([]);
  const chaosRef = useRef<ChaosEntity[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    scoreRef.current = score;
    lifeRef.current = life;
    if (life <= 0) {
      onGameOver(scoreRef.current);
    }
  }, [score, life, onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Spawner
    let nextSpawnTime = 0;
    const spawnRate = 1000;

    const spawnChaos = (time: number) => {
      if (time > nextSpawnTime) {
        const edge = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        if (edge === 0) { x = Math.random() * canvas.width; y = -20; }
        else if (edge === 1) { x = canvas.width + 20; y = Math.random() * canvas.height; }
        else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 20; }
        else { x = -20; y = Math.random() * canvas.height; }

        const targetX = canvas.width / 2;
        const targetY = canvas.height / 2;
        const angle = Math.atan2(targetY - y, targetX - x);

        chaosRef.current.push({
          x, y,
          speed: 1 + Math.random() * 2 + (scoreRef.current / 500),
          angle,
          radius: 8 + Math.random() * 8
        });

        nextSpawnTime = time + Math.max(200, spawnRate - (scoreRef.current * 2));
      }
    };

    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          color
        });
      }
    };

    const updateAndDraw = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // Clear background with trail effect
      ctx.fillStyle = 'rgba(5, 5, 7, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      spawnChaos(time);

      // Draw Center Core (The Prophet)
      const coreX = canvas.width / 2;
      const coreY = canvas.height / 2;
      
      const gradient = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, 40);
      gradient.addColorStop(0, '#e879f9');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(coreX - 40, coreY - 40, 80, 80);
      
      ctx.beginPath();
      ctx.arc(coreX, coreY, 15 + Math.sin(time/200) * 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f0abfc';
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Update and Draw Portals
      for (let i = portalsRef.current.length - 1; i >= 0; i--) {
        const p = portalsRef.current[i];
        p.life -= dt;
        if (p.life <= 0) {
          portalsRef.current.splice(i, 1);
          createExplosion(p.x, p.y, '#c084fc');
          continue;
        }

        // Expand portal
        if (p.radius < p.maxRadius) {
          p.radius += dt * 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${p.life / p.maxLife})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = `rgba(126, 34, 206, ${(p.life / p.maxLife) * 0.3})`;
        ctx.fill();
      }

      // Update and Draw Chaos
      for (let i = chaosRef.current.length - 1; i >= 0; i--) {
        const c = chaosRef.current[i];
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;

        // Collision with portals
        let absorbed = false;
        for (const p of portalsRef.current) {
          const dist = Math.hypot(p.x - c.x, p.y - c.y);
          if (dist < p.radius) {
            absorbed = true;
            createExplosion(c.x, c.y, '#38bdf8'); // Cyan logic color
            setScore(s => s + 10);
            p.life = Math.min(p.maxLife, p.life + 200); // Feed portal
            break;
          }
        }

        if (absorbed) {
          chaosRef.current.splice(i, 1);
          continue;
        }

        // Collision with core
        const distToCore = Math.hypot(coreX - c.x, coreY - c.y);
        if (distToCore < 20) {
          chaosRef.current.splice(i, 1);
          createExplosion(coreX, coreY, '#ef4444');
          setLife(l => l - 10);
          continue;
        }

        ctx.beginPath();
        const pts = 3;
        for(let j=0; j<pts * 2; j++) {
            const r = j % 2 == 0 ? c.radius : c.radius/2;
            const a = c.angle + (Math.PI / pts) * j + time/500;
            if(j==0) ctx.moveTo(c.x + Math.cos(a)*r, c.y + Math.sin(a)*r);
            else ctx.lineTo(c.x + Math.cos(a)*r, c.y + Math.sin(a)*r);
        }
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw active drag line
      if (isDraggingRef.current && dragStartRef.current) {
         // (Handled loosely since we create portal on pointerUp, but drawing a line can look cool)
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // slight gravity

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 3 - (p.life/p.maxLife)*3), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    
    const startX = dragStartRef.current.x;
    const startY = dragStartRef.current.y;
    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;

    const dist = Math.hypot(endX - startX, endY - startY);
    
    if (dist > 10) {
      // Create a portal at the midpoint
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      portalsRef.current.push({
        x: midX,
        y: midY,
        radius: 0,
        maxRadius: Math.min(dist, 100), // Drag longer = bigger portal
        createdAt: performance.now(),
        life: 3000 + (dist * 10),
        maxLife: 3000 + (dist * 10),
      });
      
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }
    }

    isDraggingRef.current = false;
    dragStartRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    // can implement drawing a prediction line here
  };

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-crosshair touch-none">
      
      {/* HUD */}
      <div className="absolute top-20 w-full flex justify-between px-6 pointer-events-none z-10">
        <div className="flex flex-col">
          <span className="text-xs text-purple-400 font-mono tracking-widest uppercase">Prophecy Score</span>
          <span className="text-3xl font-bold font-serif text-white">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-red-500 font-mono tracking-widest uppercase">Timeline Stability</span>
          <div className="w-32 h-2 bg-red-900/30 rounded-full mt-2 overflow-hidden border border-red-500/30">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300" 
              style={{ width: `${Math.max(0, life)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none text-purple-400/50 text-xs font-mono uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full border border-purple-500/20 backdrop-blur-sm">
        Drag to weave Warp Portals
      </div>

      <canvas 
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerOut={handlePointerUp}
        className="w-full h-full block"
      />
    </div>
  );
};
