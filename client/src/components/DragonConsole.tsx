import { useEffect, useRef } from 'react';

// ─── Original spring-chain physics (ported from script.js) ───────────────────
// N = 28 segments (shorter tail; original demo used 40)
const N = 28;

// Scale from original: s = (162 + 4*(1-i)) / 50
// → body half-width = s * 7px (i=1: ~23px, i=27: ~8px)
function segW(i: number): number {
  return Math.max(2.5, ((162 + 4 * (1 - i)) / 50) * 7);
}

interface El { x: number; y: number; }
interface Food { id: number; x: number; y: number; eaten: boolean; }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; }

export function DragonConsole() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = wrapRef.current ? wrapRef.current.querySelector('canvas')! : canvasRef.current!;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    resize();

    // ── State ─────────────────────────────────────────────────────────────────
    const pointer = { x: W / 2, y: H / 2 };

    // e[0] = virtual mouse-guide (not drawn)
    const elems: El[] = Array.from({ length: N }, (_, i) => ({
      x: W / 2 - i * 22,
      y: H / 2,
    }));

    let frm    = Math.random();
    let rad    = 0;
    let bootT  = 0;
    let blinkCD = 150 + Math.random() * 180;
    let blinkPh = 0;
    let blinking = false;

    let score = 0;
    const foods: Food[] = [];
    let foodId = 0;
    const sparks: Spark[] = [];

    // ── Events ────────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) * (W / r.width);
      pointer.y = (e.clientY - r.top)  * (H / r.height);
      rad = 0;
    };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      foods.push({
        id: foodId++,
        x: (e.clientX - r.left) * (W / r.width),
        y: (e.clientY - r.top)  * (H / r.height),
        eaten: false,
      });
      if (foods.length > 6) foods.shift();
    };

    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', resize);

    // ── Helpers ───────────────────────────────────────────────────────────────
    function burst(x: number, y: number) {
      for (let k = 0; k < 14; k++) {
        const a = (Math.PI * 2 * k) / 14 + Math.random() * 0.4;
        const s = 1.5 + Math.random() * 3;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
      }
    }

    // ── Draw ─────────────────────────────────────────────────────────────────

    function drawGrid() {
      const sz = 50;
      ctx.strokeStyle = 'rgba(255,215,0,0.04)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }

    function drawHead() {
      const ep = elems[0], e = elems[1];
      const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
      const a  = Math.atan2(ep.y - e.y, ep.x - e.x); // forward dir

      // blink
      blinkCD--;
      if (blinkCD <= 0 && !blinking) { blinking = true; blinkPh = 0; blinkCD = 150 + Math.random() * 200; }
      if (blinking) { blinkPh += 0.14; if (blinkPh > Math.PI) blinking = false; }
      const blinkY = blinking ? Math.max(0, Math.sin(blinkPh)) : 1;

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(a);

      // glow halo
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      halo.addColorStop(0, 'rgba(255,215,0,0.18)');
      halo.addColorStop(1, 'rgba(255,215,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();

      // head body
      const headGrad = ctx.createRadialGradient(-4, -4, 0, 0, 0, 24);
      headGrad.addColorStop(0, 'rgba(255,240,80,0.95)');
      headGrad.addColorStop(0.6, 'rgba(210,160,10,0.9)');
      headGrad.addColorStop(1, 'rgba(130,90,0,0.85)');
      ctx.save();
      ctx.shadowColor = 'rgba(255,215,0,0.5)'; ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(26, 0); ctx.lineTo(18, -10); ctx.lineTo(4, -15);
      ctx.lineTo(-14, -13); ctx.lineTo(-22, -5); ctx.lineTo(-22, 5);
      ctx.lineTo(-14, 12); ctx.lineTo(4, 13); ctx.lineTo(18, 9);
      ctx.closePath();
      ctx.fillStyle = headGrad; ctx.fill();
      ctx.strokeStyle = 'rgba(255,235,100,0.7)'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();

      // horn
      ctx.fillStyle = 'rgba(200,160,10,0.9)';
      ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(4, -26); ctx.lineTo(8, -15); ctx.fill();

      // jaw
      ctx.save();
      ctx.translate(10, 8);
      ctx.strokeStyle = 'rgba(255,215,0,0.7)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(0, 7, 14, 0); ctx.stroke();
      // teeth
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.moveTo(-10 + k * 7, 0); ctx.lineTo(-8 + k * 7, 5); ctx.lineTo(-6 + k * 7, 0);
        ctx.fill();
      }
      ctx.restore();

      // eyes
      [[9, -7], [9, 6]].forEach(([ex, ey]) => {
        ctx.save();
        ctx.shadowColor = '#ff2000'; ctx.shadowBlur = 14;
        ctx.fillStyle = '#dd1100';
        ctx.beginPath(); ctx.ellipse(ex, ey, 4.5, 4.5 * blinkY, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#ff3a00';
        ctx.beginPath(); ctx.ellipse(ex, ey, 2.8, 2.8 * blinkY, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath(); ctx.ellipse(ex + 0.8, ey, 1, 2.4 * blinkY, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,200,100,0.7)';
        ctx.beginPath(); ctx.ellipse(ex - 1.2, ey - 1.5 * blinkY, 0.9, 0.9 * blinkY, 0, 0, Math.PI * 2); ctx.fill();
      });

      // nostril flame flicker
      if (Math.random() < 0.6) {
        ctx.save();
        ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(255,110,0,0.7)';
        ctx.beginPath(); ctx.arc(24, -2, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    function drawWingAt(si: number) {
      const ep = elems[si - 1], e = elems[si];
      const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
      const a   = Math.atan2(e.y - ep.y, e.x - ep.x);
      const t   = Date.now();
      const bR  = segW(si) * 0.6;
      const spd = Math.hypot(elems[0].x - elems[1].x, elems[0].y - elems[1].y);
      const spread  = 50 + Math.min(spd * 1.8, 55);
      const flapOff = Math.sin(t / 480) * (8 + Math.min(spd * 0.4, 16));

      for (const side of [-1, 1] as const) {
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(a);

        const rY  = side * bR;
        const jx  = -12, jy  = side * (bR + spread * 0.5) + flapOff * side;
        const tipX = -3, tipY = side * (bR + spread) + flapOff * side * 1.1;
        const t1x = -28, t1y = side * (bR + spread * 0.35) + flapOff * side * 0.5;
        const t2x = -46, t2y = side * (bR + spread * 0.12);
        const taX = -42, taY = side * bR * 0.2;

        // membrane
        ctx.save();
        ctx.shadowColor = 'rgba(255,160,0,0.2)'; ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(0, rY);
        ctx.quadraticCurveTo(jx * 0.4, (rY + jy) * 0.5, jx, jy);
        ctx.quadraticCurveTo((jx + tipX) / 2, (jy + tipY) / 2, tipX, tipY);
        ctx.quadraticCurveTo((tipX + t1x) / 2, (tipY + t1y) / 2, t1x, t1y);
        ctx.quadraticCurveTo((t1x + t2x) / 2, (t1y + t2y) / 2, t2x, t2y);
        ctx.quadraticCurveTo((t2x + taX) / 2, (t2y + taY) / 2, taX, taY);
        ctx.quadraticCurveTo(-20, rY * 0.5, 0, rY);
        ctx.closePath();
        ctx.fillStyle   = 'rgba(139,69,19,0.28)';
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth   = 0.8;
        ctx.fill(); ctx.stroke();
        ctx.restore();

        // ribs (golden bone lines)
        ctx.strokeStyle = 'rgba(255,200,50,0.55)'; ctx.lineWidth = 1;
        [[jx, jy], [tipX * 0.9, tipY * 0.9], [t1x, t1y], [t2x, t2y]].forEach(([rx, ry]) => {
          ctx.beginPath(); ctx.moveTo(0, rY); ctx.lineTo(rx, ry); ctx.stroke();
        });

        ctx.restore();
      }
    }

    function drawBody() {
      // Glow pass
      ctx.save();
      ctx.shadowColor = 'rgba(255,215,0,0.18)'; ctx.shadowBlur = 20;
      for (let i = 2; i < N; i++) {
        const ep = elems[i - 1], e = elems[i];
        const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
        const nep = elems[i];
        const ne  = i < N - 1 ? elems[i + 1] : { x: e.x + (e.x - ep.x), y: e.y + (e.y - ep.y) };
        const nmx = (nep.x + ne.x) / 2, nmy = (nep.y + ne.y) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.quadraticCurveTo(e.x, e.y, nmx, nmy);
        ctx.strokeStyle = 'rgba(200,150,10,0.5)';
        ctx.lineWidth = segW(i) * 2;
        ctx.lineCap = 'round'; ctx.stroke();
      }
      ctx.restore();

      // Solid body pass
      for (let i = 2; i < N; i++) {
        const ep = elems[i - 1], e = elems[i];
        const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
        const nep = elems[i];
        const ne  = i < N - 1 ? elems[i + 1] : { x: e.x + (e.x - ep.x), y: e.y + (e.y - ep.y) };
        const nmx = (nep.x + ne.x) / 2, nmy = (nep.y + ne.y) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.quadraticCurveTo(e.x, e.y, nmx, nmy);
        // gradient color: gold at head fading to amber at tail
        const t = i / N;
        const r = Math.floor(210 - t * 60);
        const g = Math.floor(140 - t * 80);
        ctx.strokeStyle = `rgba(${r},${g},10,0.85)`;
        ctx.lineWidth = segW(i) * 1.6;
        ctx.lineCap = 'round'; ctx.stroke();
      }

      // Bone detail overlay (spine lines)
      for (let i = 2; i < N - 1; i += 2) {
        const ep = elems[i - 1], e = elems[i];
        const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
        const a  = Math.atan2(e.y - ep.y, e.x - ep.x);
        const w  = segW(i) * 0.55;
        ctx.save();
        ctx.translate(mx, my); ctx.rotate(a);
        ctx.strokeStyle = `rgba(255,235,100,${0.35 - i * 0.008})`;
        ctx.lineWidth = 0.8;
        // spine line
        ctx.beginPath(); ctx.moveTo(-w, 0); ctx.lineTo(w, 0); ctx.stroke();
        // ribs
        if (i < 12) {
          ctx.strokeStyle = `rgba(200,165,55,${0.28 - i * 0.01})`;
          [[-1], [1]].forEach(([s]) => {
            ctx.beginPath();
            ctx.moveTo(-w * 0.4, 0);
            ctx.quadraticCurveTo(-w * 0.2, s * w * 0.8, -w * 0.9, s * w * 0.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(w * 0.4, 0);
            ctx.quadraticCurveTo(w * 0.2, s * w * 0.8, w * 0.9, s * w * 0.7);
            ctx.stroke();
          });
        }
        ctx.restore();
      }

      // Tail spike
      const tl = elems[N - 1], tp = elems[N - 2];
      const tailA = Math.atan2(tl.y - tp.y, tl.x - tp.x);
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tl.x + Math.cos(tailA) * 14, tl.y + Math.sin(tailA) * 14);
      ctx.strokeStyle = 'rgba(200,130,10,0.7)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.stroke();
    }

    function drawFood() {
      const now = Date.now();
      foods.forEach(f => {
        if (f.eaten) return;
        const pulse = 0.6 + 0.4 * Math.sin(now / 300 + f.id * 1.4);
        const r = 10 + pulse * 3;

        ctx.save();
        ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 22 * pulse;
        ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,170,0,${0.18 * pulse})`; ctx.fill();

        ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(f.x, f.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#cc7700'; ctx.fill();
        ctx.beginPath(); ctx.arc(f.x, f.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffcc00'; ctx.fill();

        ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(f.x - 2, f.y - 2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,240,180,0.8)'; ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.font = "9px 'JetBrains Mono',monospace";
        ctx.fillStyle = `rgba(255,200,50,${0.6 + 0.4 * pulse})`;
        ctx.fillText('◆ FEED', f.x - 16, f.y - 16);
        ctx.restore();
      });
    }

    function drawSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= 0.028;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.shadowColor = '#ffa000'; ctx.shadowBlur = 8;
        ctx.fillStyle = p.life > 0.5 ? '#ffcc00' : '#ff8800';
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    function drawHUD() {
      // Boot text (fades out after 5s)
      if (bootT < 5) {
        const alpha = bootT < 4 ? 1 : Math.max(0, 1 - (bootT - 4));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "12px 'JetBrains Mono','Fira Code',monospace";
        ctx.fillStyle = '#ffd700';
        ctx.fillText('> Advanced Physics Engine Activated...', 18, 30);
        if (bootT > 0.7) { ctx.fillStyle = '#ffe066'; ctx.fillText('> Skeletal_Dragon_v2.0 initialized', 18, 50); }
        if (bootT > 1.5) { ctx.fillStyle = '#ffc830'; ctx.fillText('> Real-time physics simulation: ENABLED', 18, 70); }
        if (bootT > 2.3) { ctx.fillStyle = '#ffaa00'; ctx.fillText('> Ancient Dragon consciousness: AWAKENED', 18, 90); }
        if (bootT > 3.0) { ctx.fillStyle = '#ff8800'; ctx.fillText('> click to place food · move to guide', 18, 110); }
        ctx.restore();
      }

      // Score
      if (score > 0) {
        ctx.save();
        ctx.font = "11px 'JetBrains Mono','Fira Code',monospace";
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`> devoured: ${score}`, W - 140, 30);
        ctx.restore();
      }
    }

    // ── RAF loop ──────────────────────────────────────────────────────────────
    let lastT = performance.now();
    let raf: number;

    const loop = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      bootT += dt;

      // ── Original spring-chain physics ─────────────────────────────────────
      const maxRad = Math.min(pointer.x, pointer.y, W - pointer.x, H - pointer.y) - 20;
      if (rad < maxRad) rad++;
      frm += 0.003;
      if (rad > 60) {
        pointer.x += (W / 2 - pointer.x) * 0.05;
        pointer.y += (H / 2 - pointer.y) * 0.05;
      }

      const ax = (Math.cos(3 * frm) * rad * W) / H;
      const ay = (Math.sin(4 * frm) * rad * H) / W;

      elems[0].x += (ax + pointer.x - elems[0].x) / 10;
      elems[0].y += (ay + pointer.y - elems[0].y) / 10;

      for (let i = 1; i < N; i++) {
        const e = elems[i], ep = elems[i - 1];
        const a = Math.atan2(e.y - ep.y, e.x - ep.x);
        e.x += (ep.x - e.x + Math.cos(a) * (100 - i) / 5) / 4;
        e.y += (ep.y - e.y + Math.sin(a) * (100 - i) / 5) / 4;
      }

      // ── Food eating ───────────────────────────────────────────────────────
      const headX = (elems[0].x + elems[1].x) / 2;
      const headY = (elems[0].y + elems[1].y) / 2;
      foods.forEach(f => {
        if (f.eaten) return;
        if (Math.hypot(headX - f.x, headY - f.y) < 28) {
          f.eaten = true; score++; burst(f.x, f.y);
        }
      });

      // ── Draw ──────────────────────────────────────────────────────────────
      // Background
      ctx.fillStyle = '#0a0800';
      ctx.fillRect(0, 0, W, H);

      // Ambient glow around head
      const aura = ctx.createRadialGradient(headX, headY, 0, headX, headY, 160);
      aura.addColorStop(0, 'rgba(255,215,0,0.09)');
      aura.addColorStop(0.5, 'rgba(255,140,0,0.04)');
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura; ctx.fillRect(0, 0, W, H);

      drawGrid();
      drawFood();
      drawWingAt(8);
      drawWingAt(14);
      drawBody();
      drawHead();
      drawSparks();
      drawHUD();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full bg-black rounded-xl overflow-hidden border border-yellow-600/50 shadow-2xl cursor-none"
      style={{ height: '420px' }}
    >
      {/* Subtle crosshatch background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,215,0,0.07) 20px, rgba(255,215,0,0.07) 21px),
            repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(184,134,11,0.07) 20px, rgba(184,134,11,0.07) 21px)
          `,
        }}
      />

      {/* Dragon canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        data-testid="canvas-dragon-console"
      />

      {/* Status panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-yellow-600/40 z-10 pointer-events-none">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-yellow-400">Physics Engine: <span className="text-green-400">ACTIVE</span></span>
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
