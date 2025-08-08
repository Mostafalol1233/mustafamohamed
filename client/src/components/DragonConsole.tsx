import { useState, useEffect, useRef } from 'react';

// Advanced Realistic Dragon Console with Physics Engine
export function DragonConsole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 400, y: 200 });
  
  // Advanced physics-based dragon system
  const dragonRef = useRef({
    head: { x: 400, y: 200, vx: 0, vy: 0, targetX: 400, targetY: 200 },
    spine: Array.from({ length: 12 }, (_, i) => ({
      x: 400 - i * 15,
      y: 200,
      vx: 0,
      vy: 0,
      angle: 0,
      springForce: 0.15,
      damping: 0.85
    })),
    tail: Array.from({ length: 8 }, (_, i) => ({
      x: 400 - 180 - i * 20,
      y: 200,
      vx: 0,
      vy: 0,
      wavePhase: i * 0.5
    })),
    wings: {
      left: { angle: 0, targetAngle: 0, beat: 0 },
      right: { angle: 0, targetAngle: 0, beat: 0 }
    },
    jaw: { openness: 0, targetOpenness: 0 },
    eyes: { blink: 0, sparkle: Math.random() },
    breathing: { intensity: 0, particles: [] as any[] }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = (currentTime: number) => {
      timeRef.current = currentTime * 0.001;
      
      updateDragonPhysics();
      drawDragon(ctx);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Advanced physics simulation for realistic dragon movement
  const updateDragonPhysics = () => {
    const dragon = dragonRef.current;
    const time = timeRef.current;
    const mouse = mouseRef.current;

    // Head tracking with spring physics
    const headToMouse = {
      x: mouse.x - dragon.head.x,
      y: mouse.y - dragon.head.y
    };
    const distance = Math.sqrt(headToMouse.x ** 2 + headToMouse.y ** 2);
    
    // Spring force towards mouse with inertia
    dragon.head.vx += headToMouse.x * 0.002;
    dragon.head.vy += headToMouse.y * 0.002;
    
    // Apply damping
    dragon.head.vx *= 0.92;
    dragon.head.vy *= 0.92;
    
    dragon.head.x += dragon.head.vx;
    dragon.head.y += dragon.head.vy;

    // Spinal flexibility with realistic curvature
    for (let i = 0; i < dragon.spine.length; i++) {
      const segment = dragon.spine[i];
      const target = i === 0 ? dragon.head : dragon.spine[i - 1];
      
      const dx = target.x - segment.x;
      const dy = target.y - segment.y;
      const dist = Math.sqrt(dx ** 2 + dy ** 2);
      const targetDist = 18;
      
      if (dist > targetDist) {
        const angle = Math.atan2(dy, dx);
        segment.x = target.x - Math.cos(angle) * targetDist;
        segment.y = target.y - Math.sin(angle) * targetDist;
      }
      
      // Add spinal curve simulation
      segment.angle = Math.atan2(dy, dx);
      
      // Apply oscillation for natural movement
      segment.x += Math.sin(time + i * 0.3) * 0.8;
      segment.y += Math.cos(time + i * 0.2) * 0.6;
    }

    // Autonomous tail wave motion
    for (let i = 0; i < dragon.tail.length; i++) {
      const tailSegment = dragon.tail[i];
      const prevSegment = i === 0 ? dragon.spine[dragon.spine.length - 1] : dragon.tail[i - 1];
      
      // Wave motion independent of mouse
      const waveOffset = Math.sin(time * 2 + tailSegment.wavePhase) * 25;
      const baseX = prevSegment.x - 25;
      const baseY = prevSegment.y + waveOffset;
      
      tailSegment.vx += (baseX - tailSegment.x) * 0.1;
      tailSegment.vy += (baseY - tailSegment.y) * 0.1;
      
      tailSegment.vx *= 0.88;
      tailSegment.vy *= 0.88;
      
      tailSegment.x += tailSegment.vx;
      tailSegment.y += tailSegment.vy;
    }

    // Wing beat animation
    dragon.wings.left.beat = Math.sin(time * 4) * 0.6;
    dragon.wings.right.beat = Math.sin(time * 4 + Math.PI) * 0.6;
    
    // Jaw movement based on distance to mouse
    dragon.jaw.targetOpenness = Math.min(distance / 100, 1);
    dragon.jaw.openness += (dragon.jaw.targetOpenness - dragon.jaw.openness) * 0.08;
    
    // Eye blinking and sparkle
    if (Math.random() < 0.01) dragon.eyes.blink = 1;
    dragon.eyes.blink *= 0.85;
    dragon.eyes.sparkle = Math.sin(time * 8) * 0.5 + 0.5;

    // Fire breathing particles
    if (Math.random() < 0.3) {
      dragon.breathing.particles.push({
        x: dragon.head.x + 30,
        y: dragon.head.y + 10,
        vx: (Math.random() - 0.5) * 4 + 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: Math.random() * 4 + 2
      });
    }

    // Update fire particles
    dragon.breathing.particles = dragon.breathing.particles
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02
      }))
      .filter(p => p.life > 0);
  };

  // Advanced dragon rendering with realistic textures and lighting
  const drawDragon = (ctx: CanvasRenderingContext2D) => {
    const dragon = dragonRef.current;
    const time = timeRef.current;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dynamic lighting setup
    const lightSource = { x: mouseRef.current.x, y: mouseRef.current.y };
    
    // Draw mystical background aura
    ctx.save();
    const gradient = ctx.createRadialGradient(
      dragon.head.x, dragon.head.y, 0,
      dragon.head.x, dragon.head.y, 150
    );
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    // Draw fire breathing particles first (behind dragon)
    dragon.breathing.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      const fireGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      fireGradient.addColorStop(0, '#ff6b35');
      fireGradient.addColorStop(0.5, '#ffa500');
      fireGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
      ctx.fillStyle = fireGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw spine with realistic bone texture
    for (let i = dragon.spine.length - 1; i >= 0; i--) {
      const segment = dragon.spine[i];
      const nextSegment = dragon.spine[i + 1] || dragon.tail[0];
      
      if (nextSegment) {
        drawBoneSegment(ctx, segment, nextSegment, i, lightSource);
      }
    }

    // Draw tail with serpentine texture
    for (let i = dragon.tail.length - 1; i >= 0; i--) {
      const segment = dragon.tail[i];
      const nextSegment = dragon.tail[i + 1];
      
      if (nextSegment) {
        drawTailSegment(ctx, segment, nextSegment, i, lightSource);
      }
    }

    // Draw wings with membrane texture
    drawWing(ctx, dragon.head.x - 40, dragon.head.y - 20, dragon.wings.left.beat, 'left', lightSource);
    drawWing(ctx, dragon.head.x - 40, dragon.head.y - 20, dragon.wings.right.beat, 'right', lightSource);

    // Draw dragon head with detailed features
    drawDragonHead(ctx, dragon, lightSource, time);

    // Draw ribs extending from spine
    dragon.spine.forEach((segment, i) => {
      if (i % 2 === 0 && i < 8) {
        drawRibs(ctx, segment, i, lightSource);
      }
    });
  };

  // Draw individual bone segment with texture and lighting
  const drawBoneSegment = (ctx: CanvasRenderingContext2D, segment: any, nextSegment: any, index: number, light: any) => {
    ctx.save();
    
    // Calculate lighting intensity
    const lightDist = Math.sqrt((segment.x - light.x) ** 2 + (segment.y - light.y) ** 2);
    const lightIntensity = Math.max(0.3, 1 - lightDist / 200);
    
    // Bone texture with cracks
    const angle = Math.atan2(nextSegment.y - segment.y, nextSegment.x - segment.x);
    ctx.translate(segment.x, segment.y);
    ctx.rotate(angle);
    
    // Main bone structure
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.9 * lightIntensity})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    
    // Bone detail and cracks
    ctx.strokeStyle = `rgba(200, 180, 50, ${0.7 * lightIntensity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.lineTo(6, -2);
    ctx.moveTo(-6, 2);
    ctx.lineTo(6, 2);
    ctx.stroke();
    
    // Joint nodes
    ctx.fillStyle = `rgba(255, 235, 100, ${0.8 * lightIntensity})`;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  // Draw tail segment with serpentine scales
  const drawTailSegment = (ctx: CanvasRenderingContext2D, segment: any, nextSegment: any, index: number, light: any) => {
    ctx.save();
    
    const lightDist = Math.sqrt((segment.x - light.x) ** 2 + (segment.y - light.y) ** 2);
    const lightIntensity = Math.max(0.2, 1 - lightDist / 250);
    
    const angle = Math.atan2(nextSegment.y - segment.y, nextSegment.x - segment.x);
    ctx.translate(segment.x, segment.y);
    ctx.rotate(angle);
    
    // Tail spine
    ctx.strokeStyle = `rgba(255, 140, 0, ${0.8 * lightIntensity})`;
    ctx.lineWidth = Math.max(1, 6 - index);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.stroke();
    
    // Scale texture
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(180, 120, 20, ${0.4 * lightIntensity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-5 + i * 5, 0, 2, 0, Math.PI);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  // Draw wing with realistic membrane
  const drawWing = (ctx: CanvasRenderingContext2D, x: number, y: number, beat: number, side: string, light: any) => {
    ctx.save();
    
    const lightIntensity = Math.max(0.3, 1 - Math.sqrt((x - light.x) ** 2 + (y - light.y) ** 2) / 200);
    const wingX = side === 'left' ? x - 60 : x + 60;
    const wingY = y + beat * 20;
    
    // Wing membrane (semi-transparent)
    ctx.fillStyle = `rgba(139, 69, 19, ${0.3 * lightIntensity})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(wingX - 20, wingY - 30, wingX, wingY);
    ctx.quadraticCurveTo(wingX - 10, wingY + 40, x - (side === 'left' ? 20 : -20), y + 30);
    ctx.fill();
    
    // Wing bone structure
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.7 * lightIntensity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(wingX, wingY);
    ctx.moveTo(x, y);
    ctx.lineTo(wingX - 10, wingY + 20);
    ctx.moveTo(x, y);
    ctx.lineTo(x - (side === 'left' ? 20 : -20), y + 30);
    ctx.stroke();
    
    ctx.restore();
  };

  // Draw detailed dragon head
  const drawDragonHead = (ctx: CanvasRenderingContext2D, dragon: any, light: any, time: number) => {
    const head = dragon.head;
    const lightIntensity = Math.max(0.4, 1 - Math.sqrt((head.x - light.x) ** 2 + (head.y - light.y) ** 2) / 150);
    
    ctx.save();
    ctx.translate(head.x, head.y);
    
    // Head outline with gradient
    const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
    headGradient.addColorStop(0, `rgba(255, 215, 0, ${0.9 * lightIntensity})`);
    headGradient.addColorStop(1, `rgba(184, 134, 11, ${0.6 * lightIntensity})`);
    
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = `rgba(255, 235, 100, ${0.8 * lightIntensity})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Jaw movement
    ctx.save();
    ctx.translate(0, 8);
    ctx.rotate(dragon.jaw.openness * 0.3);
    
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.7 * lightIntensity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.quadraticCurveTo(0, 8, 15, 0);
    ctx.stroke();
    
    // Teeth
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * lightIntensity})`;
      ctx.beginPath();
      ctx.moveTo(-12 + i * 6, 0);
      ctx.lineTo(-10 + i * 6, 6);
      ctx.lineTo(-8 + i * 6, 0);
      ctx.fill();
    }
    ctx.restore();
    
    // Eyes with blinking and sparkle
    const eyeOpacity = 1 - dragon.eyes.blink;
    ctx.fillStyle = `rgba(255, 0, 0, ${0.9 * eyeOpacity * lightIntensity})`;
    ctx.beginPath();
    ctx.arc(-8, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = `rgba(200, 0, 0, ${0.8 * eyeOpacity * lightIntensity})`;
    ctx.beginPath();
    ctx.arc(8, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye sparkle effect
    if (dragon.eyes.sparkle > 0.7) {
      ctx.fillStyle = `rgba(255, 255, 255, ${dragon.eyes.sparkle * lightIntensity})`;
      ctx.beginPath();
      ctx.arc(-8, -5, 1, 0, Math.PI * 2);
      ctx.arc(8, -5, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Nostril flames
    if (Math.random() < 0.7) {
      ctx.fillStyle = `rgba(255, 100, 0, ${0.6 * lightIntensity})`;
      ctx.beginPath();
      ctx.arc(15, -2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  // Draw ribs extending from spine
  const drawRibs = (ctx: CanvasRenderingContext2D, segment: any, index: number, light: any) => {
    const lightIntensity = Math.max(0.2, 1 - Math.sqrt((segment.x - light.x) ** 2 + (segment.y - light.y) ** 2) / 200);
    
    ctx.save();
    ctx.translate(segment.x, segment.y);
    
    ctx.strokeStyle = `rgba(205, 165, 55, ${0.5 * lightIntensity})`;
    ctx.lineWidth = 1.5;
    
    // Upper ribs
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-15, -20, -25, -15);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(15, -20, 25, -15);
    ctx.stroke();
    
    // Lower ribs
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-12, 15, -20, 12);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(12, 15, 20, 12);
    ctx.stroke();
    
    ctx.restore();
  };

  return (
    <div className="relative w-full h-96 bg-black rounded-xl overflow-hidden border border-yellow-600/50 shadow-2xl cursor-none">
      {/* Mystical Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 215, 0, 0.1) 20px, rgba(255, 215, 0, 0.1) 21px),
            repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(184, 134, 11, 0.1) 20px, rgba(184, 134, 11, 0.1) 21px)
          `
        }}></div>
      </div>
      
      {/* Advanced Dragon Console Text */}
      <div className="absolute top-4 left-4 text-yellow-400 font-mono text-sm space-y-1 z-10">
        <div className="animate-pulse">{'> Advanced Physics Engine Activated...'}</div>
        <div className="text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }}>{'> Skeletal_Dragon_v2.0 initialized'}</div>
        <div className="text-amber-300 animate-pulse" style={{ animationDelay: '1s' }}>{'> Real-time physics simulation: ENABLED'}</div>
        <div className="text-orange-300 animate-pulse" style={{ animationDelay: '1.5s' }}>{'> Ancient Dragon consciousness: AWAKENED'}</div>
      </div>

      {/* Advanced Dragon Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'auto' }}
      />

      {/* Advanced Status Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-yellow-600/40 z-10">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-yellow-400">Physics Engine: ACTIVE</span>
          <span className="text-amber-400">Skeletal Dragon v2.0</span>
          <span className="text-orange-400">Reality Level: MAXIMUM</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono mt-1 opacity-70">
          <span className="text-green-400">Spring Physics: ON</span>
          <span className="text-blue-400">Spinal Flexibility: ON</span>
          <span className="text-red-400">Fire Breath: ON</span>
        </div>
      </div>
    </div>
  );
}