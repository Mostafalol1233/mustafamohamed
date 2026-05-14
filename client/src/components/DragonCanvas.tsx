import { useEffect, useRef } from "react";

// ─── Math helpers ─────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

interface Vec2 { x: number; y: number; }
const vlen = (v: Vec2) => Math.sqrt(v.x * v.x + v.y * v.y);

function solve2BoneIK(
  root: Vec2, target: Vec2,
  upper: number, lower: number,
  flip: number
): Vec2 {
  const dx = target.x - root.x, dy = target.y - root.y;
  const d = clamp(Math.sqrt(dx * dx + dy * dy), 0.01, upper + lower - 0.5);
  const a0 = Math.atan2(dy, dx);
  const cosA = clamp((upper * upper + d * d - lower * lower) / (2 * upper * d), -1, 1);
  const ea = a0 + flip * Math.acos(cosA);
  return { x: root.x + Math.cos(ea) * upper, y: root.y + Math.sin(ea) * upper };
}

// ─── Dragon anatomy constants ─────────────────────────────────────────────────
const NUM_SEGS = 22;
const SEG_DIST = 19;

function segR(i: number): number {
  if (i === 0) return 0;                              // head drawn separately
  if (i <= 2)  return 14;                             // neck
  if (i <= 6)  return 13;                             // chest/shoulders
  if (i <= 11) return 11;                             // abdomen
  return Math.max(2, 10 - (i - 11) * 1.2);           // tail taper
}

// Limb definitions: segment to attach, which side, flip for IK bend
const LIMB_DEFS = [
  { si: 4,  side: -1, flip:  1, isFront: true  },
  { si: 4,  side:  1, flip: -1, isFront: true  },
  { si: 9,  side: -1, flip: -1, isFront: false },
  { si: 9,  side:  1, flip:  1, isFront: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function DragonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ctx = canvas.getContext("2d")!;
    resize();

    // ── State ────────────────────────────────────────────────────────────────

    const mouse  = { x: W * 0.5, y: H * 0.4 };
    let prevMx   = mouse.x, prevMy = mouse.y;
    let speed    = 0;
    let isIdle   = true;

    // Body segments
    interface Seg { x: number; y: number; angle: number; }
    const segs: Seg[] = Array.from({ length: NUM_SEGS }, (_, i) => ({
      x: W * 0.5 - i * SEG_DIST,
      y: H * 0.4,
      angle: 0,
    }));

    // Feet
    interface Foot { si: number; side: number; flip: number; isFront: boolean;
                     x: number; y: number; tx: number; ty: number;
                     stepping: boolean; t: number; startX: number; startY: number; }
    const feet: Foot[] = LIMB_DEFS.map(d => ({
      ...d,
      x: segs[d.si].x + d.side * 40,
      y: segs[d.si].y + 55,
      tx: segs[d.si].x + d.side * 40,
      ty: segs[d.si].y + 55,
      stepping: false, t: 1,
      startX: segs[d.si].x + d.side * 40,
      startY: segs[d.si].y + 55,
    }));

    let breathPhase  = 0;
    let bootTimer    = 0;
    let tailSway     = 0;
    let blinkCD      = 140 + Math.random() * 180;
    let blinking     = false;
    let blinkPhase   = 0;

    // ── Mouse / touch ────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onTouchMove = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
    };
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", resize);

    // ── Update ───────────────────────────────────────────────────────────────
    function update(dt: number) {
      breathPhase += dt;
      bootTimer   += dt;
      tailSway    += dt;

      // Speed
      const mdx = mouse.x - prevMx, mdy = mouse.y - prevMy;
      speed = lerp(speed, Math.sqrt(mdx * mdx + mdy * mdy) / Math.max(dt, 0.001), 0.07);
      prevMx = mouse.x; prevMy = mouse.y;
      isIdle = speed < 4;

      // Idle breathing drift
      const dx0 = isIdle ? Math.sin(breathPhase * 0.5)  * 14 : 0;
      const dy0 = isIdle ? Math.sin(breathPhase * 0.35) * 9  : 0;

      // Head springs toward mouse
      segs[0].x = lerp(segs[0].x, mouse.x + dx0, 0.13);
      segs[0].y = lerp(segs[0].y, mouse.y + dy0, 0.13);

      // Chain body: each segment pulled tight to previous
      for (let i = 1; i < NUM_SEGS; i++) {
        const p = segs[i - 1], c = segs[i];
        const dx = c.x - p.x, dy = c.y - p.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > SEG_DIST) {
          c.x = p.x + (dx / d) * SEG_DIST;
          c.y = p.y + (dy / d) * SEG_DIST;
        }
      }

      // Angles (each seg faces away from its follower)
      segs[0].angle = Math.atan2(segs[0].y - segs[1].y, segs[0].x - segs[1].x);
      for (let i = 1; i < NUM_SEGS; i++) {
        segs[i].angle = Math.atan2(segs[i].y - segs[i - 1].y, segs[i].x - segs[i - 1].x);
      }

      // Blink
      blinkCD -= dt * 60;
      if (blinkCD <= 0 && !blinking) {
        blinking = true; blinkPhase = 0;
        blinkCD = 160 + Math.random() * 200;
      }
      if (blinking) {
        blinkPhase += dt * 9;
        if (blinkPhase > Math.PI) blinking = false;
      }

      // Foot targets + stepping
      feet.forEach((f, fi) => {
        const s = segs[f.si];
        const perp = s.angle + Math.PI / 2;
        const fwd  = isIdle ? 0 : Math.cos(s.angle) * 16;
        const fwdY = isIdle ? 0 : Math.sin(s.angle) * 16;

        f.tx = s.x + Math.cos(perp) * f.side * 44 + fwd;
        f.ty = s.y + Math.sin(perp) * f.side * 44 + fwdY;

        const ddx = f.tx - f.x, ddy = f.ty - f.y;
        const dd  = Math.sqrt(ddx * ddx + ddy * ddy);

        // Stagger: front pair on even frames, back pair on odd
        const canStep = !f.stepping && dd > 28;
        const partnerStepping = feet[(fi % 2 === 0 ? fi + 1 : fi - 1)]?.stepping ?? false;

        if (canStep && !partnerStepping) {
          f.stepping = true;
          f.startX = f.x; f.startY = f.y;
          f.t = 0;
        }
        if (f.stepping) {
          f.t = Math.min(1, f.t + dt * 3.5);
          const ease = f.t < 0.5 ? 2 * f.t * f.t : -1 + (4 - 2 * f.t) * f.t;
          f.x = lerp(f.startX, f.tx, ease);
          f.y = lerp(f.startY, f.ty, ease) - Math.sin(f.t * Math.PI) * 22;
          if (f.t >= 1) f.stepping = false;
        }
      });
    }

    // ── Draw helpers ─────────────────────────────────────────────────────────

    function drawGrid() {
      const sz = 44;
      ctx.strokeStyle = "rgba(48,54,61,0.18)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += sz) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += sz) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    }

    function drawWings() {
      const SI = 3; // attachment segment
      const s  = segs[SI];
      const spreadT = clamp(speed / 22, 0, 1);
      const spread  = lerp(52, 125, spreadT);
      const flapAmt = isIdle ? 8 : 5 + spreadT * 22;
      const flapOff = Math.sin(breathPhase * 2.1) * flapAmt;

      for (const side of [-1, 1] as const) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);

        const bR = 13; // body radius at attachment

        // Wing membrane points (local space, head faces +x)
        const rootY = side * bR;
        const jx = -14, jy = side * (bR + spread * 0.52) + flapOff * side;
        const tipX = -4,  tipY = side * (bR + spread) + flapOff * side * 1.15;
        const t1x = -32, t1y = side * (bR + spread * 0.35) + flapOff * side * 0.6;
        const t2x = -54, t2y = side * (bR + spread * 0.15) + flapOff * side * 0.3;
        const tailX = -46, tailY = side * bR * 0.3;

        // Membrane fill
        ctx.save();
        ctx.shadowColor = "rgba(70,10,110,0.18)";
        ctx.shadowBlur  = 22;
        ctx.beginPath();
        ctx.moveTo(0, rootY);
        ctx.quadraticCurveTo(jx * 0.4, (rootY + jy) * 0.5, jx, jy);
        ctx.quadraticCurveTo((jx + tipX) * 0.5, (jy + tipY) * 0.5, tipX, tipY);
        ctx.quadraticCurveTo((tipX + t1x) * 0.5, (tipY + t1y) * 0.5, t1x, t1y);
        ctx.quadraticCurveTo((t1x + t2x) * 0.5, (t1y + t2y) * 0.5, t2x, t2y);
        ctx.quadraticCurveTo((t2x + tailX) * 0.5, (t2y + tailY) * 0.5, tailX, tailY);
        ctx.quadraticCurveTo(-24, rootY * 0.5, 0, rootY);
        ctx.closePath();
        ctx.fillStyle   = "rgba(5, 3, 16, 0.87)";
        ctx.strokeStyle = "rgba(65,12,105,0.3)";
        ctx.lineWidth   = 0.7;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Wing ribs (thin structural lines)
        ctx.strokeStyle = "rgba(28,7,55,0.55)";
        ctx.lineWidth   = 0.9;
        const ribTargets: [number, number][] = [
          [jx, jy],
          [tipX * 0.9, tipY * 0.9],
          [t1x, t1y],
          [t2x, t2y],
        ];
        ribTargets.forEach(([rx, ry]) => {
          ctx.beginPath();
          ctx.moveTo(0, rootY);
          ctx.lineTo(rx, ry);
          ctx.stroke();
        });

        // Wing claw tips (sharp points at tip and t1)
        ctx.strokeStyle = "rgba(18, 5, 38, 0.6)";
        ctx.lineWidth   = 0.8;
        [[tipX, tipY], [t1x, t1y]].forEach(([cx, cy]) => {
          const angle = Math.atan2(cy - jy, cx - jx);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * 9, cy + Math.sin(angle) * 9);
          ctx.stroke();
        });

        ctx.restore();
      }
    }

    function drawLimbs() {
      const UPPER = 32, LOWER = 27, CLAW = 11;

      feet.forEach((f) => {
        const s = segs[f.si];
        const perp = s.angle + Math.PI / 2;
        const rX   = s.x + Math.cos(perp) * f.side * segR(f.si);
        const rY   = s.y + Math.sin(perp) * f.side * segR(f.si);
        const root = { x: rX, y: rY };
        const foot = { x: f.x, y: f.y };

        const elbow = solve2BoneIK(root, foot, UPPER, LOWER, f.flip);

        // Shadow/glow
        ctx.save();
        ctx.shadowColor = "rgba(40,0,65,0.25)";
        ctx.shadowBlur  = 10;

        // Upper + lower arm
        ctx.strokeStyle = "#060910";
        ctx.lineWidth   = 5.5;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.beginPath();
        ctx.moveTo(root.x, root.y);
        ctx.lineTo(elbow.x, elbow.y);
        ctx.lineTo(foot.x, foot.y);
        ctx.stroke();

        // Subtle highlight line along limb
        ctx.strokeStyle = "rgba(40,15,70,0.3)";
        ctx.lineWidth   = 1.2;
        ctx.beginPath();
        ctx.moveTo(root.x, root.y);
        ctx.lineTo(elbow.x, elbow.y);
        ctx.stroke();

        ctx.restore();

        // Claws
        const clawAngle = Math.atan2(foot.y - elbow.y, foot.x - elbow.x);
        ctx.strokeStyle = "rgba(18, 8, 36, 0.75)";
        ctx.lineWidth   = 1.3;
        ctx.lineCap     = "round";
        [-0.42, 0, 0.42].forEach(offset => {
          const ca = clawAngle + offset;
          ctx.beginPath();
          ctx.moveTo(foot.x, foot.y);
          ctx.lineTo(foot.x + Math.cos(ca) * CLAW, foot.y + Math.sin(ca) * CLAW);
          ctx.stroke();
        });
      });
    }

    function drawBody() {
      // Pass 1: glow halo
      ctx.save();
      ctx.shadowColor = "rgba(75,15,130,0.22)";
      ctx.shadowBlur  = 26;
      for (let i = 1; i < NUM_SEGS - 1; i++) {
        const s  = segs[i], ns = segs[i + 1];
        const r  = segR(i);
        const bm = i < 8 ? 1 + Math.sin(breathPhase * 1.1) * 0.05 * (1 - i / 8) : 1;
        const mx = (s.x + ns.x) / 2, my = (s.y + ns.y) / 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(mx, my, ns.x, ns.y);
        ctx.strokeStyle = "rgba(18,4,42,0.75)";
        ctx.lineWidth   = r * 2.3 * bm;
        ctx.lineCap     = "round";
        ctx.stroke();
      }
      ctx.restore();

      // Pass 2: solid dark body
      for (let i = 1; i < NUM_SEGS - 1; i++) {
        const s  = segs[i], ns = segs[i + 1];
        const r  = segR(i);
        const bm = i < 8 ? 1 + Math.sin(breathPhase * 1.1) * 0.05 * (1 - i / 8) : 1;
        const mx = (s.x + ns.x) / 2, my = (s.y + ns.y) / 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(mx, my, ns.x, ns.y);
        ctx.strokeStyle = "#040710";
        ctx.lineWidth   = r * 1.75 * bm;
        ctx.lineCap     = "round";
        ctx.stroke();
      }

      // Pass 3: subtle edge rim (barely visible purple tint)
      for (let i = 1; i < NUM_SEGS - 6; i++) {
        const s  = segs[i], ns = segs[i + 1];
        const r  = segR(i);
        const mx = (s.x + ns.x) / 2, my = (s.y + ns.y) / 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(mx, my, ns.x, ns.y);
        ctx.strokeStyle = "rgba(50,10,90,0.12)";
        ctx.lineWidth   = r * 1.75 + 2;
        ctx.lineCap     = "round";
        ctx.stroke();
      }

      // Tail tip (pointed spike)
      const tl = segs[NUM_SEGS - 1], tp = segs[NUM_SEGS - 2];
      const tailA = Math.atan2(tl.y - tp.y, tl.x - tp.x);
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tl.x + Math.cos(tailA) * 16, tl.y + Math.sin(tailA) * 16);
      ctx.strokeStyle = "#040710";
      ctx.lineWidth   = 1.8;
      ctx.lineCap     = "round";
      ctx.stroke();
    }

    function drawHead() {
      const s = segs[0];
      const a = s.angle;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(a);

      // Head glow
      ctx.save();
      ctx.shadowColor = "rgba(75,15,130,0.45)";
      ctx.shadowBlur  = 32;

      // Angular reptilian head shape (head faces +x in local space)
      ctx.beginPath();
      ctx.moveTo(26, 0);          // snout tip
      ctx.lineTo(18, -9);         // upper jaw
      ctx.lineTo(4, -15);         // top of skull
      ctx.lineTo(-14, -12);       // back top
      ctx.lineTo(-22, -5);        // back of head
      ctx.lineTo(-22, 5);         // back of head bottom
      ctx.lineTo(-14, 12);        // back bottom
      ctx.lineTo(4, 13);          // lower skull
      ctx.lineTo(18, 8);          // lower jaw
      ctx.closePath();
      ctx.fillStyle = "#040810";
      ctx.fill();
      ctx.restore();

      // Snout ridge detail
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -4);
      ctx.lineTo(12, -6);
      ctx.strokeStyle = "rgba(35,10,65,0.4)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Top horn
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(3, -27);
      ctx.lineTo(7, -15);
      ctx.fillStyle = "#07050f";
      ctx.fill();

      // Small back spines
      [[-8, -12], [-14, -12], [-19, -9]].forEach(([hx, hy]) => {
        const spineLen = 7 - Math.abs(hx) * 0.1;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx - 2, hy - spineLen);
        ctx.strokeStyle = "rgba(25,6,50,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // ── Eyes ────────────────────────────────────────────────────────────
      const blinkY = blinking ? Math.max(0, Math.sin(blinkPhase)) : 1;

      // Eye sockets
      const eyes: [number, number][] = [[9, -7], [9, 6]];
      eyes.forEach(([ex, ey]) => {
        // Outer ember glow
        ctx.save();
        ctx.shadowColor = "#cc0a0a";
        ctx.shadowBlur  = 16;
        ctx.fillStyle   = "#d41515";
        ctx.beginPath();
        ctx.ellipse(ex, ey, 5, 5 * blinkY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Inner iris (slightly lighter)
        ctx.save();
        ctx.shadowColor = "#ff2020";
        ctx.shadowBlur  = 8;
        ctx.fillStyle   = "#e82020";
        ctx.beginPath();
        ctx.ellipse(ex, ey, 3.2, 3.2 * blinkY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Slit pupil
        ctx.beginPath();
        ctx.ellipse(ex + 1, ey, 1.2, 2.8 * blinkY, 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "#120003";
        ctx.fill();

        // Glint
        ctx.save();
        ctx.shadowColor = "#ff5555";
        ctx.shadowBlur  = 4;
        ctx.fillStyle   = "rgba(255,130,130,0.7)";
        ctx.beginPath();
        ctx.ellipse(ex - 1.5, ey - 1.8 * blinkY, 1, 1 * blinkY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    }

    function drawBootText() {
      if (bootTimer > 4.5) return;
      const alpha = bootTimer < 3.5 ? 1 : clamp(1 - (bootTimer - 3.5), 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font        = "12px 'JetBrains Mono','Fira Code',monospace";
      ctx.fillStyle   = "#3fb950";
      ctx.fillText("> Void entity detected...", 22, 34);
      if (bootTimer > 0.85) ctx.fillText("> Binding to cursor... done", 22, 54);
      ctx.restore();
    }

    // ── RAF loop ──────────────────────────────────────────────────────────────
    let lastT = performance.now();
    let raf: number;

    const loop = (now: number) => {
      const dt = clamp((now - lastT) / 1000, 0, 0.05);
      lastT = now;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, W, H);

      drawGrid();
      update(dt);
      drawWings();
      drawLimbs();
      drawBody();
      drawHead();
      drawBootText();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <section
      className="border-t border-b border-[#21262d] relative overflow-hidden"
      style={{ background: "#0d1117" }}
    >
      {/* Label */}
      <div
        className="absolute bottom-4 right-5 text-xs pointer-events-none select-none"
        style={{ color: "#30363d", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
      >
        move cursor to interact
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "520px", display: "block", cursor: "crosshair" }}
        data-testid="canvas-dragon"
      />
    </section>
  );
}
