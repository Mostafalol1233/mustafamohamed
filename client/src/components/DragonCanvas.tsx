import { useEffect, useRef } from "react";

// ─── Original spring-chain physics (ported from script.js) ───────────────────
// N = 28 segments (shorter tail: original used 40)
const N = 28;

// Scale formula from original: s = (162 + 4*(1-i)) / 50
// Mapped to canvas pixels
function segSize(i: number): number {
  const s = (162 + 4 * (1 - i)) / 50;
  return Math.max(2.5, s * 8);
  // i=1 → 26px, i=27 → ~9px  — natural body taper
}

interface El { x: number; y: number; }
interface Food { id: number; x: number; y: number; eaten: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; }

export default function DragonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;

    const setSize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ctx = canvas.getContext("2d")!;
    setSize();

    // ── State ────────────────────────────────────────────────────────────────
    const pointer = { x: W / 2, y: H / 2 };

    // Chain elements: e[0] = virtual mouse-guide (not drawn)
    const elems: El[] = Array.from({ length: N }, (_, i) => ({
      x: W / 2 - i * 22,
      y: H / 2,
    }));

    let frm     = Math.random();  // idle animation phase
    let rad     = 0;              // idle orbit radius (grows when still)
    let bootT   = 0;
    let blinkCD = 150 + Math.random() * 180;
    let blinkPh = 0;
    let isBlinking = false;

    // Food
    const foods: Food[] = [];
    let foodId = 0;
    let score  = 0;

    // Particles (eat burst)
    const particles: Particle[] = [];

    // ── Events ───────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      rad = 0; // reset idle drift when mouse moves
    };
    const onTouch = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.touches[0].clientX - r.left;
      pointer.y = e.touches[0].clientY - r.top;
      rad = 0;
    };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      foods.push({ id: foodId++, x: e.clientX - r.left, y: e.clientY - r.top, eaten: false });
      if (foods.length > 6) foods.shift(); // keep max 6 food items
    };

    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", setSize);

    // ── Particle helpers ──────────────────────────────────────────────────────
    function burst(x: number, y: number) {
      for (let k = 0; k < 16; k++) {
        const a = (Math.PI * 2 * k) / 16 + Math.random() * 0.3;
        const spd = 1.5 + Math.random() * 3.5;
        particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, life: 1 });
      }
    }

    // ── Draw ─────────────────────────────────────────────────────────────────

    function drawGrid() {
      const sz = 44;
      ctx.strokeStyle = "rgba(48,54,61,0.18)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }

    function drawWingAt(si: number) {
      const ep = elems[si - 1], e = elems[si];
      const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
      const a  = Math.atan2(e.y - ep.y, e.x - ep.x);
      const t  = Date.now();
      const bR = segSize(si) * 0.55;
      const spd = Math.sqrt((elems[0].x - elems[1].x) ** 2 + (elems[0].y - elems[1].y) ** 2);
      const spread  = 58 + Math.min(spd * 2, 60);
      const flapAmp = 8 + Math.min(spd * 0.5, 18);
      const flapOff = Math.sin(t / 480) * flapAmp;

      for (const side of [-1, 1] as const) {
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(a);

        const rY  = side * bR;
        const jx  = -12, jy  = side * (bR + spread * 0.5) + flapOff * side;
        const tipX = -3, tipY = side * (bR + spread) + flapOff * side * 1.1;
        const t1x = -30, t1y = side * (bR + spread * 0.35) + flapOff * side * 0.5;
        const t2x = -50, t2y = side * (bR + spread * 0.12);
        const taX = -44, taY = side * bR * 0.2;

        // membrane
        ctx.save();
        ctx.shadowColor = "rgba(70,10,110,0.18)"; ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(0, rY);
        ctx.quadraticCurveTo(jx * 0.4, (rY + jy) * 0.5, jx, jy);
        ctx.quadraticCurveTo((jx + tipX) / 2, (jy + tipY) / 2, tipX, tipY);
        ctx.quadraticCurveTo((tipX + t1x) / 2, (tipY + t1y) / 2, t1x, t1y);
        ctx.quadraticCurveTo((t1x + t2x) / 2, (t1y + t2y) / 2, t2x, t2y);
        ctx.quadraticCurveTo((t2x + taX) / 2, (t2y + taY) / 2, taX, taY);
        ctx.quadraticCurveTo(-22, rY * 0.5, 0, rY);
        ctx.closePath();
        ctx.fillStyle   = "rgba(5,3,16,0.88)";
        ctx.strokeStyle = "rgba(65,12,105,0.3)";
        ctx.lineWidth   = 0.7;
        ctx.fill(); ctx.stroke();
        ctx.restore();

        // ribs
        ctx.strokeStyle = "rgba(28,7,55,0.55)"; ctx.lineWidth = 0.8;
        [[jx, jy], [tipX * 0.9, tipY * 0.9], [t1x, t1y], [t2x, t2y]].forEach(([rx, ry]) => {
          ctx.beginPath(); ctx.moveTo(0, rY); ctx.lineTo(rx, ry); ctx.stroke();
        });

        // wing claw at tip
        const ca = Math.atan2(tipY - jy, tipX - jx);
        ctx.strokeStyle = "rgba(18,5,38,0.6)"; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX + Math.cos(ca) * 9, tipY + Math.sin(ca) * 9);
        ctx.stroke();

        ctx.restore();
      }
    }

    function drawHead() {
      const ep = elems[0], e = elems[1];
      const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
      // head faces FROM body TOWARD mouse-guide = forward direction
      const a = Math.atan2(ep.y - e.y, ep.x - e.x);

      // blink update
      blinkCD--;
      if (blinkCD <= 0 && !isBlinking) { isBlinking = true; blinkPh = 0; blinkCD = 150 + Math.random() * 200; }
      if (isBlinking) { blinkPh += 0.14; if (blinkPh > Math.PI) isBlinking = false; }
      const blinkY = isBlinking ? Math.max(0, Math.sin(blinkPh)) : 1;

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(a);

      // head glow + fill
      ctx.save();
      ctx.shadowColor = "rgba(75,15,130,0.45)"; ctx.shadowBlur = 32;
      ctx.beginPath();
      ctx.moveTo(26, 0); ctx.lineTo(18, -9); ctx.lineTo(4, -15);
      ctx.lineTo(-14, -12); ctx.lineTo(-22, -5); ctx.lineTo(-22, 5);
      ctx.lineTo(-14, 12);  ctx.lineTo(4, 13);   ctx.lineTo(18, 8);
      ctx.closePath();
      ctx.fillStyle = "#040810"; ctx.fill();
      ctx.restore();

      // top horn
      ctx.beginPath();
      ctx.moveTo(0, -15); ctx.lineTo(3, -27); ctx.lineTo(7, -15);
      ctx.fillStyle = "#07050f"; ctx.fill();

      // back spines
      [[-8, -12], [-14, -12], [-19, -9]].forEach(([hx, hy]) => {
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - 2, hy - 7);
        ctx.strokeStyle = "rgba(25,6,50,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      });

      // snout ridge
      ctx.beginPath();
      ctx.moveTo(26, 0); ctx.lineTo(20, -4); ctx.lineTo(12, -6);
      ctx.strokeStyle = "rgba(35,10,65,0.4)"; ctx.lineWidth = 0.8; ctx.stroke();

      // eyes
      [[9, -7], [9, 6]].forEach(([ex, ey]) => {
        ctx.save();
        ctx.shadowColor = "#cc0a0a"; ctx.shadowBlur = 16;
        ctx.fillStyle = "#d41515";
        ctx.beginPath(); ctx.ellipse(ex, ey, 5, 5 * blinkY, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowColor = "#ff2020"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#e82020";
        ctx.beginPath(); ctx.ellipse(ex, ey, 3.2, 3.2 * blinkY, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // slit pupil
        ctx.beginPath();
        ctx.ellipse(ex + 1, ey, 1.2, 2.8 * blinkY, 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "#120003"; ctx.fill();

        // glint
        ctx.save();
        ctx.shadowColor = "#ff5555"; ctx.shadowBlur = 4;
        ctx.fillStyle = "rgba(255,130,130,0.65)";
        ctx.beginPath(); ctx.ellipse(ex - 1.5, ey - 1.8 * blinkY, 1, 1 * blinkY, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    }

    function drawBody() {
      // glow pass
      ctx.save();
      ctx.shadowColor = "rgba(75,15,130,0.22)"; ctx.shadowBlur = 24;
      for (let i = 2; i < N; i++) {
        const ep = elems[i - 1], e = elems[i];
        const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
        const nep = i < N - 1 ? elems[i] : e;
        const ne  = i < N - 1 ? elems[i + 1] : { x: e.x + (e.x - ep.x), y: e.y + (e.y - ep.y) };
        const nmx = (nep.x + ne.x) / 2, nmy = (nep.y + ne.y) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.quadraticCurveTo(e.x, e.y, nmx, nmy);
        ctx.strokeStyle = "rgba(18,4,42,0.75)";
        ctx.lineWidth = segSize(i) * 2;
        ctx.lineCap = "round"; ctx.stroke();
      }
      ctx.restore();

      // solid dark pass
      for (let i = 2; i < N; i++) {
        const ep = elems[i - 1], e = elems[i];
        const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
        const nep = i < N - 1 ? elems[i] : e;
        const ne  = i < N - 1 ? elems[i + 1] : { x: e.x + (e.x - ep.x), y: e.y + (e.y - ep.y) };
        const nmx = (nep.x + ne.x) / 2, nmy = (nep.y + ne.y) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.quadraticCurveTo(e.x, e.y, nmx, nmy);
        ctx.strokeStyle = "#040710";
        ctx.lineWidth = segSize(i) * 1.65;
        ctx.lineCap = "round"; ctx.stroke();
      }

      // subtle purple edge rim on upper body
      for (let i = 2; i < Math.min(N - 4, 14); i++) {
        const ep = elems[i - 1], e = elems[i];
        const mx = (ep.x + e.x) / 2, my = (ep.y + e.y) / 2;
        const nep = elems[i], ne  = elems[i + 1] ?? e;
        const nmx = (nep.x + ne.x) / 2, nmy = (nep.y + ne.y) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.quadraticCurveTo(e.x, e.y, nmx, nmy);
        ctx.strokeStyle = "rgba(50,10,90,0.1)";
        ctx.lineWidth = segSize(i) * 1.65 + 2;
        ctx.lineCap = "round"; ctx.stroke();
      }

      // tail spike
      const tl = elems[N - 1], tp = elems[N - 2];
      const tailA = Math.atan2(tl.y - tp.y, tl.x - tp.x);
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tl.x + Math.cos(tailA) * 13, tl.y + Math.sin(tailA) * 13);
      ctx.strokeStyle = "#040710"; ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.stroke();
    }

    function drawFood() {
      const now = Date.now();
      foods.forEach(f => {
        if (f.eaten) return;
        const pulse = 0.6 + 0.4 * Math.sin(now / 320 + f.id * 1.3);
        const r = 10 + pulse * 3;

        // outer glow ring
        ctx.save();
        ctx.shadowColor = "#ff1a1a"; ctx.shadowBlur = 20 * pulse;
        ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,20,20,${0.22 * pulse})`; ctx.fill();

        // core gem
        ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(f.x, f.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#b01010"; ctx.fill();
        ctx.beginPath(); ctx.arc(f.x, f.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff3030"; ctx.fill();

        // glint
        ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(f.x - 2, f.y - 2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,200,200,0.8)"; ctx.fill();
        ctx.restore();

        // label
        ctx.save();
        ctx.font = "9px 'JetBrains Mono',monospace";
        ctx.fillStyle = `rgba(255,80,80,${0.6 + 0.4 * pulse})`;
        ctx.fillText("◆ FEED", f.x - 16, f.y - 16);
        ctx.restore();
      });
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.life -= 0.028;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.shadowColor = "#ff2020"; ctx.shadowBlur = 7;
        ctx.fillStyle = p.life > 0.5 ? "#ff4040" : "#cc1010";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    function drawHUD() {
      if (bootT > 5) return;
      const alpha = bootT < 4 ? 1 : Math.max(0, 1 - (bootT - 4));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "11px 'JetBrains Mono','Fira Code',monospace";
      ctx.fillStyle = "#3fb950";
      ctx.fillText("> Void entity detected...", 22, 34);
      if (bootT > 0.8)  ctx.fillText("> Binding to cursor... done", 22, 52);
      if (bootT > 1.8)  ctx.fillText("> click anywhere to place food", 22, 70);
      ctx.restore();

      if (score > 0) {
        ctx.save();
        ctx.font = "11px 'JetBrains Mono','Fira Code',monospace";
        ctx.fillStyle = "#3fb950";
        ctx.fillText(`> devoured: ${score}`, W - 135, 34);
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

      // ── Physics — exact original spring chain ─────────────────────────────
      // Idle oscillation: grows when mouse is still
      const maxRad = Math.min(pointer.x, pointer.y, W - pointer.x, H - pointer.y) - 20;
      if (rad < maxRad) rad++;
      frm += 0.003;
      if (rad > 60) {
        pointer.x += (W / 2 - pointer.x) * 0.05;
        pointer.y += (H / 2 - pointer.y) * 0.05;
      }

      const ax = (Math.cos(3 * frm) * rad * W) / H;
      const ay = (Math.sin(4 * frm) * rad * H) / W;

      // Mouse-guide (e[0]) chases pointer
      elems[0].x += (ax + pointer.x - elems[0].x) / 10;
      elems[0].y += (ay + pointer.y - elems[0].y) / 10;

      // Body chain: each segment spring-follows the previous
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
        const d = Math.hypot(headX - f.x, headY - f.y);
        if (d < 28) { f.eaten = true; score++; burst(f.x, f.y); }
      });

      // ── Draw ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, W, H);

      drawGrid();
      drawFood();

      // Wings (same positions as original "Aletas" at i=8 and i=14)
      drawWingAt(8);
      drawWingAt(14);

      drawBody();
      drawHead();
      drawParticles();
      drawHUD();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <section
      className="border-t border-b border-[#21262d] relative overflow-hidden select-none"
      style={{ background: "#0d1117" }}
    >
      <div
        className="absolute bottom-4 right-5 text-xs pointer-events-none z-10"
        style={{ color: "#30363d", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
      >
        click · feed the void
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "520px", display: "block", cursor: "none" }}
        data-testid="canvas-dragon"
      />
    </section>
  );
}
