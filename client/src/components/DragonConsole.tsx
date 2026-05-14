import { useEffect, useRef, useState } from 'react';

// N = 14 segments — compact body, fits well in the larger console
const N = 14;

// Scale multiplier — shrinks the entire dragon proportionally
const SCALE_MULT = 0.52;

export function DragonConsole() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);
  const [bootVisible, setBootVisible] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBootVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const svg  = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;

    const xmlns   = "http://www.w3.org/2000/svg";
    const xlinkns = "http://www.w3.org/1999/xlink";

    let W = wrap.clientWidth;
    let H = wrap.clientHeight;

    const screen = svg.querySelector('g#screen') as SVGGElement;

    const elems: { use: SVGUseElement | null; x: number; y: number }[] =
      Array.from({ length: N }, () => ({ use: null, x: W / 2, y: H / 2 }));

    const pointer = { x: W / 2, y: H / 2 };
    let frm = Math.random();
    let rad = 0;

    // One wing at segment 6 only — uses the new single-sided Aleta1 shape
    for (let i = 1; i < N; i++) {
      const el = document.createElementNS(xmlns, 'use');
      elems[i].use = el;
      const shape = i === 1 ? 'Cabeza' : i === 6 ? 'Aleta1' : 'Espina';
      el.setAttributeNS(xlinkns, 'xlink:href', '#' + shape);
      screen.prepend(el);
    }

    // ── Food ─────────────────────────────────────────────────────────────────
    interface FoodItem {
      g: SVGGElement;
      glowEl: SVGCircleElement;
      x: number; y: number;
      eaten: boolean;
      id: number;
    }
    const foods: FoodItem[] = [];
    let foodId   = 0;
    let localScore = 0;

    const addFood = (x: number, y: number) => {
      const g    = document.createElementNS(xmlns, 'g');
      const glow = document.createElementNS(xmlns, 'circle');
      glow.setAttribute('cx', String(x));
      glow.setAttribute('cy', String(y));
      glow.setAttribute('r', '14');
      glow.setAttribute('fill', 'rgba(255,200,0,0.15)');
      g.appendChild(glow);

      const outer = document.createElementNS(xmlns, 'circle');
      outer.setAttribute('cx', String(x)); outer.setAttribute('cy', String(y));
      outer.setAttribute('r', '7'); outer.setAttribute('fill', '#b36b00');
      outer.setAttribute('stroke', '#ffd700'); outer.setAttribute('stroke-width', '1.5');
      g.appendChild(outer);

      const inner = document.createElementNS(xmlns, 'circle');
      inner.setAttribute('cx', String(x)); inner.setAttribute('cy', String(y));
      inner.setAttribute('r', '4'); inner.setAttribute('fill', '#ffe066');
      g.appendChild(inner);

      const glint = document.createElementNS(xmlns, 'circle');
      glint.setAttribute('cx', String(x - 2)); glint.setAttribute('cy', String(y - 2));
      glint.setAttribute('r', '1.5'); glint.setAttribute('fill', 'rgba(255,240,180,0.8)');
      g.appendChild(glint);

      const label = document.createElementNS(xmlns, 'text');
      label.setAttribute('x', String(x - 16)); label.setAttribute('y', String(y - 16));
      label.setAttribute('fill', '#ffc830'); label.setAttribute('font-size', '9');
      label.setAttribute('font-family', 'JetBrains Mono, monospace');
      label.textContent = '◆ FEED';
      g.appendChild(label);

      screen.appendChild(g);
      foods.push({ g, glowEl: glow, x, y, eaten: false, id: foodId++ });
      if (foods.length > 6) {
        const old = foods.shift();
        old?.g.remove();
      }
    };

    // ── Events ───────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r   = svg.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      rad = 0;
    };
    const onClickWrap = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      addFood(e.clientX - r.left, e.clientY - r.top);
    };
    const onResize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
    };

    svg.addEventListener('mousemove', onMove);
    wrap.addEventListener('click', onClickWrap);
    window.addEventListener('resize', onResize);

    // ── RAF loop ──────────────────────────────────────────────────────────────
    let raf: number;

    const run = () => {
      raf = requestAnimationFrame(run);

      const maxRad = Math.min(pointer.x, pointer.y, W - pointer.x, H - pointer.y) - 20;
      const ax     = (Math.cos(3 * frm) * rad * W) / H;
      const ay     = (Math.sin(4 * frm) * rad * H) / W;

      elems[0].x += (ax + pointer.x - elems[0].x) / 10;
      elems[0].y += (ay + pointer.y - elems[0].y) / 10;

      for (let i = 1; i < N; i++) {
        const e  = elems[i];
        const ep = elems[i - 1];
        const a  = Math.atan2(e.y - ep.y, e.x - ep.x);
        e.x += (ep.x - e.x + Math.cos(a) * (100 - i) / 5) / 4;
        e.y += (ep.y - e.y + Math.sin(a) * (100 - i) / 5) / 4;
        // Scale formula multiplied by SCALE_MULT to shrink the dragon
        const s = ((162 + 4 * (1 - i)) / 50) * SCALE_MULT;
        e.use!.setAttributeNS(
          null, 'transform',
          `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${(180 / Math.PI) * a}) scale(${s})`
        );
      }

      if (rad < maxRad) rad++;
      frm += 0.003;
      if (rad > 60) {
        pointer.x += (W / 2 - pointer.x) * 0.05;
        pointer.y += (H / 2 - pointer.y) * 0.05;
      }

      const headX = (elems[0].x + elems[1].x) / 2;
      const headY = (elems[0].y + elems[1].y) / 2;

      const now = Date.now();
      foods.forEach(f => {
        if (f.eaten) return;
        const pulse = 1 + 0.4 * Math.sin(now / 300 + f.id * 1.4);
        f.glowEl.setAttribute('r', String(14 * pulse));
        f.glowEl.setAttribute('fill', `rgba(255,200,0,${0.15 * pulse})`);
        if (Math.hypot(headX - f.x, headY - f.y) < 24) {
          f.eaten = true;
          f.g.remove();
          localScore++;
          setScore(localScore);
        }
      });
    };

    raf = requestAnimationFrame(run);

    return () => {
      cancelAnimationFrame(raf);
      svg.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('click', onClickWrap);
      window.removeEventListener('resize', onResize);
      for (let i = 1; i < N; i++) { elems[i].use?.remove(); }
      foods.forEach(f => f.g.remove());
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full bg-black rounded-xl overflow-hidden border border-yellow-600/50 shadow-2xl cursor-none"
      style={{ height: '420px' }}
    >
      {/* Crosshatch bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,215,0,0.05) 20px, rgba(255,215,0,0.05) 21px),
            repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(184,134,11,0.05) 20px, rgba(184,134,11,0.05) 21px)
          `,
        }}
      />

      {/* ── SVG Dragon ────────────────────────────────────────────────────────── */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'hidden', cursor: 'none' }}
      >
        <defs>
          {/* ── Cabeza (Head) ── */}
          <g id="Cabeza">
            <path
              style={{ fill: '#ffe08c', fillOpacity: 1 }}
              d="M-28.9,-1.1L-28.55 -1.95Q-28.1 -3.1 -27.25 -2.95L-26.7 -2.95Q-27.7 -1.65 -28.9 -1.1
                 M-18.35,-1.8Q-15.1 -10.3 -9.6 -6.05Q-15.1 -6.2 -18.35 -1.8
                 M-18.35,1.1Q-15.1 5.45 -9.6 5.35Q-15.1 9.55 -18.35 1.1
                 M-26.7,2.2L-27.25 2.25Q-28.1 2.4 -28.55 1.2L-28.9 0.35Q-27.7 0.9 -26.7 2.2"
            />
            <path
              style={{ fill: '#1a1000', fillOpacity: 1 }}
              d="M-21.05,-8.25Q-13.6 -15.95 -1.3 -12.1Q-7.85 -8.5 -5.85 -4.35Q-2.3 -4.85 10.5 0.15
                 Q0 4.35 -5.85 3.65Q-7.85 7.75 -1.25 12.45Q-13.6 15.2 -21.05 7.5
                 Q-29.55 4.05 -30.2 -0.35Q-29.55 -4.8 -21.05 -8.25
                 M-26.7,-2.95L-27.25 -2.95Q-28.1 -3.1 -28.55 -1.95L-28.9 -1.1Q-27.7 -1.65 -26.7 -2.95
                 M-9.6,-6.05Q-15.1 -10.3 -18.35 -1.8Q-15.1 -6.2 -9.6 -6.05
                 M-9.6,5.35Q-15.1 5.45 -18.35 1.1Q-15.1 9.55 -9.6 5.35
                 M-28.9,0.35L-28.55 1.2Q-28.1 2.4 -27.25 2.25L-26.7 2.2Q-27.7 0.9 -28.9 0.35"
            />
          </g>

          {/* ── Aleta1 — single wing, sweeps upward only ────────────────────── */}
          <g id="Aleta1">
            <linearGradient id="GradWing1" gradientUnits="userSpaceOnUse"
              x1="-10" y1="0" x2="-10" y2="-68">
              <stop offset="0"   style={{ stopColor: '#ffc830', stopOpacity: 1 }} />
              <stop offset="0.6" style={{ stopColor: '#e08000', stopOpacity: 0.9 }} />
              <stop offset="1"   style={{ stopColor: '#1a0d00', stopOpacity: 0.75 }} />
            </linearGradient>

            {/* Main membrane — single upward wing */}
            <path
              style={{ fill: 'url(#GradWing1)' }}
              d="M0,0
                 Q-6,-14 -14,-28
                 Q-20,-42 -16,-60
                 Q-8,-72  4,-68
                 Q16,-64  20,-50
                 Q24,-36  16,-22
                 Q10,-12   0,0 Z"
            />

            {/* Wing ribs — thin gold lines */}
            <line x1="0" y1="0" x2="-14" y2="-58"
              stroke="rgba(255,180,0,0.45)" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="0" y1="0" x2="16" y2="-52"
              stroke="rgba(255,150,0,0.35)" strokeWidth="0.7" strokeLinecap="round" />
            <line x1="0" y1="0" x2="4" y2="-68"
              stroke="rgba(200,100,0,0.3)"  strokeWidth="0.6" strokeLinecap="round" />

            {/* Wing tip claw */}
            <path
              d="M4,-68 L0,-76 M4,-68 L10,-74"
              stroke="rgba(255,190,0,0.5)" strokeWidth="0.8" strokeLinecap="round"
              fill="none"
            />

            {/* Subtle edge highlight */}
            <path
              d="M0,0 Q-6,-14 -14,-28 Q-20,-42 -16,-60 Q-8,-72 4,-68"
              stroke="rgba(255,220,80,0.3)" strokeWidth="0.6"
              fill="none" strokeLinecap="round"
            />
          </g>

          {/* ── Espina (Spine) — gold gradient ── */}
          <g id="Espina">
            <linearGradient id="GradSpineUp" gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0.0229492,0,0,-0.0152893,0,0.05)"
              spreadMethod="pad" x1="-819.2" y1="0" x2="819.2" y2="0">
              <stop offset="0" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: '#5c3a00', stopOpacity: 1 }} />
            </linearGradient>
            <path style={{ fill: 'url(#GradSpineUp)' }}
              d="M-18.8,0Q-17.85 -5.7 -12.3 -9.6Q-11.2 -5.35 -6.5 -8.25L-6.45 -8.2L-6.2 -8.3
                 Q1.25 -16.25 6.65 -12.4Q0.05 -12.55 0 -5.95Q2.7 -2.4 7.75 -4.1Q18 -1.45 18.8 0L-18.8 0"
            />
            <linearGradient id="GradSpineDn" gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0.0229492,0,0,0.0152893,0,-0.05)"
              spreadMethod="pad" x1="-819.2" y1="0" x2="819.2" y2="0">
              <stop offset="0" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: '#5c3a00', stopOpacity: 1 }} />
            </linearGradient>
            <path style={{ fill: 'url(#GradSpineDn)' }}
              d="M18.8,0Q18 1.45 7.75 4.1Q2.7 2.4 0 5.95Q0.05 12.55 6.65 12.4Q1.25 16.25 -6.2 8.35
                 Q-6.35 8.25 -6.45 8.25L-6.5 8.25Q-11.2 5.35 -12.3 9.6Q-17.85 5.7 -18.8 0L18.8 0"
            />
          </g>
        </defs>

        <g id="screen" />
      </svg>

      {/* ── Boot text overlay ─────────────────────────────────────────────────── */}
      <div
        className="absolute top-4 left-4 font-mono text-sm space-y-1 z-10 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: bootVisible ? 1 : 0 }}
      >
        <div className="animate-pulse text-yellow-400">{'> Advanced Physics Engine Activated...'}</div>
        <div className="text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }}>
          {'> Skeletal_Dragon_v2.0 initialized'}
        </div>
        <div className="text-amber-300 animate-pulse" style={{ animationDelay: '1s' }}>
          {'> Single-Wing Mode: ENGAGED'}
        </div>
        <div className="text-orange-300 animate-pulse" style={{ animationDelay: '1.5s' }}>
          {'> Ancient Dragon consciousness: AWAKENED'}
        </div>
        <div className="text-yellow-500 animate-pulse" style={{ animationDelay: '2s' }}>
          {'> click anywhere to place food ◆'}
        </div>
      </div>

      {/* Score */}
      {score > 0 && (
        <div
          className="absolute top-4 right-4 font-mono text-xs z-10 pointer-events-none"
          style={{ color: '#ffd700' }}
        >
          {`> devoured: ${score}`}
        </div>
      )}

      {/* ── Status panel ──────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-yellow-600/40 z-10 pointer-events-none">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-yellow-400">Physics Engine: <span className="text-green-400">ACTIVE</span></span>
          <span className="text-amber-400">Skeletal Dragon v2.0</span>
          <span className="text-orange-400">Reality Level: MAXIMUM</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono mt-1 opacity-70">
          <span className="text-green-400">Spring Physics: ON</span>
          <span className="text-yellow-300">Wing Mode: SINGLE</span>
          <span className="text-red-400">Fire Breath: ON</span>
        </div>
      </div>
    </div>
  );
}
