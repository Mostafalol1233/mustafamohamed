import { useEffect, useRef, useState } from 'react';

const N = 20; // segments

// ── Web Audio eat sound ────────────────────────────────────────────────────────
function playEatSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
    osc.onended = () => ctx.close();
  } catch (_) { /* silence on unsupported browsers */ }
}

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

    const xmlns   = 'http://www.w3.org/2000/svg';
    const xlinkns = 'http://www.w3.org/1999/xlink';

    let W = wrap.clientWidth;
    let H = wrap.clientHeight;

    const screen = svg.querySelector('g#screen') as SVGGElement;

    const elems: { use: SVGUseElement | null; x: number; y: number }[] =
      Array.from({ length: N }, () => ({ use: null, x: W / 2, y: H / 2 }));

    const pointer = { x: W / 2, y: H / 2 };
    let frm = Math.random();
    let rad = 0;

    // Original shape assignment — two wing positions
    for (let i = 1; i < N; i++) {
      const el = document.createElementNS(xmlns, 'use');
      elems[i].use = el;
      const shape = i === 1 ? 'Cabeza' : (i === 8 || i === 14) ? 'Aletas' : 'Espina';
      el.setAttributeNS(xlinkns, 'xlink:href', '#' + shape);
      screen.prepend(el);
    }

    // ── Food helpers ──────────────────────────────────────────────────────────
    interface FoodItem {
      g: SVGGElement;
      glowEl: SVGCircleElement;
      x: number; y: number;
      eaten: boolean;
      id: number;
    }
    const foods: FoodItem[] = [];
    let foodId    = 0;
    let localScore = 0;

    const addFood = (x: number, y: number) => {
      const g    = document.createElementNS(xmlns, 'g');
      const glow = document.createElementNS(xmlns, 'circle');
      glow.setAttribute('cx', String(x)); glow.setAttribute('cy', String(y));
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

    // Spawn food at a random position inside the canvas bounds
    const spawnRandom = () => {
      const margin = 40;
      const x = margin + Math.random() * (W - margin * 2);
      const y = margin + Math.random() * (H - margin * 2);
      addFood(x, y);
    };

    // Auto-spawn food every 3.5 s
    spawnRandom(); // first piece right away
    const autoFood = setInterval(spawnRandom, 3500);

    // ── Events ────────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      rad = 0;
    };
    // Touch — finger controls dragon on mobile
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const r     = svg.getBoundingClientRect();
      const touch = e.touches[0];
      pointer.x = touch.clientX - r.left;
      pointer.y = touch.clientY - r.top;
      rad = 0;
    };
    const onClickWrap = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      addFood(e.clientX - r.left, e.clientY - r.top);
    };
    const onResize = () => { W = wrap.clientWidth; H = wrap.clientHeight; };

    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('touchstart',  onTouch, { passive: false });
    svg.addEventListener('touchmove',   onTouch, { passive: false });
    wrap.addEventListener('click', onClickWrap);
    window.addEventListener('resize', onResize);

    // ── RAF physics loop ──────────────────────────────────────────────────────
    let raf: number;

    const run = () => {
      raf = requestAnimationFrame(run);

      const maxRad = Math.min(pointer.x, pointer.y, W - pointer.x, H - pointer.y) - 20;
      const ax = (Math.cos(3 * frm) * rad * W) / H;
      const ay = (Math.sin(4 * frm) * rad * H) / W;

      elems[0].x += (ax + pointer.x - elems[0].x) / 10;
      elems[0].y += (ay + pointer.y - elems[0].y) / 10;

      for (let i = 1; i < N; i++) {
        const e  = elems[i];
        const ep = elems[i - 1];
        const a  = Math.atan2(e.y - ep.y, e.x - ep.x);
        e.x += (ep.x - e.x + Math.cos(a) * (100 - i) / 5) / 4;
        e.y += (ep.y - e.y + Math.sin(a) * (100 - i) / 5) / 4;
        const s = (162 + 4 * (1 - i)) / 50;
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
        if (Math.hypot(headX - f.x, headY - f.y) < 32) {
          f.eaten = true;
          f.g.remove();
          localScore++;
          setScore(localScore);
          playEatSound();
        }
      });
    };

    raf = requestAnimationFrame(run);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(autoFood);
      svg.removeEventListener('mousemove', onMove);
      svg.removeEventListener('touchstart', onTouch);
      svg.removeEventListener('touchmove',  onTouch);
      wrap.removeEventListener('click', onClickWrap);
      window.removeEventListener('resize', onResize);
      for (let i = 1; i < N; i++) elems[i].use?.remove();
      foods.forEach(f => f.g.remove());
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full bg-black rounded-xl overflow-hidden border border-yellow-600/50 shadow-2xl"
      style={{ height: '420px', touchAction: 'none' }}
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

      {/* ── SVG Dragon — original shapes, golden palette ─────────────────────── */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'hidden', cursor: 'none', touchAction: 'none' }}
      >
        <defs>
          {/* ── Cabeza (Head) ── */}
          <g id="Cabeza" transform="matrix(1,0,0,1,0,0)">
            <path style={{ fill: '#ffe08c', fillOpacity: 1 }}
              d="M-28.9,-1.1L-28.55 -1.95Q-28.1 -3.1 -27.25 -2.95L-26.7 -2.95Q-27.7 -1.65 -28.9 -1.1
                 M-18.35,-1.8Q-15.1 -10.3 -9.6 -6.05Q-15.1 -6.2 -18.35 -1.8
                 M-18.35,1.1Q-15.1 5.45 -9.6 5.35Q-15.1 9.55 -18.35 1.1
                 M-26.7,2.2L-27.25 2.25Q-28.1 2.4 -28.55 1.2L-28.9 0.35Q-27.7 0.9 -26.7 2.2" />
            <path style={{ fill: '#1a1000', fillOpacity: 1 }}
              d="M-21.05,-8.25Q-13.6 -15.95 -1.3 -12.1Q-7.85 -8.5 -5.85 -4.35Q-2.3 -4.85 10.5 0.15
                 Q0 4.35 -5.85 3.65Q-7.85 7.75 -1.25 12.45Q-13.6 15.2 -21.05 7.5
                 Q-29.55 4.05 -30.2 -0.35Q-29.55 -4.8 -21.05 -8.25
                 M-26.7,-2.95L-27.25 -2.95Q-28.1 -3.1 -28.55 -1.95L-28.9 -1.1Q-27.7 -1.65 -26.7 -2.95
                 M-9.6,-6.05Q-15.1 -10.3 -18.35 -1.8Q-15.1 -6.2 -9.6 -6.05
                 M-9.6,5.35Q-15.1 5.45 -18.35 1.1Q-15.1 9.55 -9.6 5.35
                 M-28.9,0.35L-28.55 1.2Q-28.1 2.4 -27.25 2.25L-26.7 2.2Q-27.7 0.9 -28.9 0.35" />
          </g>

          {/* ── Aletas (Wings) — original bilateral gold shape ── */}
          <g id="Aletas" transform="matrix(1,0,0,1,0,0)">
            <linearGradient id="GradWing" gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0.0935974,0,0,0.188782,-20.55,0)"
              spreadMethod="pad" x1="-819.2" y1="0" x2="819.2" y2="0">
              <stop offset="0" style={{ stopColor: '#ffc830', stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: '#1a0d00', stopOpacity: 0.88 }} />
            </linearGradient>
            <path style={{ fill: 'url(#GradWing)' }} d="M29.75,-36.85Q-17.75 -61.45 -42.05 -40.95L-45.35 -38.35L-53.7 -41.15L-51.15 -44.85Q-34.85 -68.4 21 -57.8Q-32.2 -72.1 -50.25 -50Q-53.85 -45.65 -56.05 -41.95L-64.7 -43.35L-60.6 -50.3Q-45.9 -75.55 5.1 -79.35Q-2.2 -79.8 -9.45 -79.15Q-16.2 -78.55 -22.85 -77.15Q-29.85 -75.65 -36.5 -73Q-43.05 -70.4 -48.8 -66.85Q-54.55 -63.35 -56.8 -60.3L-60.5 -55.4Q-62.95 -52.1 -67 -43.55L-70.55 -43.55L-76.35 -42.95Q-74.6 -49.1 -71.85 -54.85Q-68.9 -61.25 -64.8 -67.1Q-60.8 -73 -55.45 -77.55Q-49.9 -82.35 -43.65 -85.85L-30.6 -92.7Q-24.05 -95.95 -17 -98.25Q-63.75 -86.35 -73.65 -57.1Q-75.75 -50.75 -77.45 -42.75Q-82.9 -41.75 -88 -39.65Q-87.65 -46.65 -86.3 -53.05Q-79.8 -89.8 -36.65 -117.2Q-80.65 -94.5 -87.55 -59.55Q-88.65 -54.15 -88.95 -39.4L-89.8 -38.85L-92.7 -37.6Q-93.75 -44.35 -94.1 -51.15Q-94.4 -58.2 -93.25 -65.1Q-92.15 -72.5 -90.05 -79.65Q-88.05 -86.55 -85 -93Q-82.1 -99.3 -78.45 -105.15Q-74.6 -111.35 -70.25 -117.25Q-65.95 -123.1 -61.1 -128.55Q-70.3 -119.35 -77.9 -108.7Q-86 -97.3 -90.8 -84.05Q-95.8 -70.5 -96 -56.15Q-96.1 -46 -94.05 -36.05L-93.25 -31.55Q-93.5 -35.65 -92.35 -36Q-79.85 -42 -66.6 -40.45Q-52.45 -38.85 -39.2 -33.25Q-28.3 -29.9 -21.25 -24.15Q-17.8 -23.3 -8.6 -15.6Q-12.1 -20.75 -16.75 -24.5Q-24.55 -30.7 -34.25 -34.05L-42.55 -37Q-38.9 -41.25 -31.5 -43.25Q-24.05 -45.3 -16.2 -46.3Q-8.35 -47.35 -1 -46Q5.95 -44.75 12.75 -42.85Q19.85 -40.9 29.75 -36.85M-92.45,-27.35L-94.95 -36.25Q-109.7 -105 -27.95 -154.65Q-98.65 -103.8 -91.75 -39.4L-89.95 -40.2Q-92.2 -105.25 -5.6 -130.9Q-78.8 -99.95 -87.45 -40.9Q-83.15 -42.95 -78.45 -43.95Q-70 -101.3 17.65 -103.8Q-56.9 -93.4 -74.5 -44.55L-67.4 -45.45Q-49.1 -94.95 39.25 -75.65Q-36.75 -84.35 -62.25 -44.25L-57.3 -43.6Q-31.65 -86.5 56.15 -46.05Q-20.3 -73.35 -51.35 -41.7L-45.95 -39.75Q-17.85 -71.35 51.85 -24.8Q-8.7 -56.4 -39.75 -37.05Q-28.15 -34.05 -14.25 -24.45Q-8.6 -19.85 -5.8 -16.95Q5.95 -2.4 20 0Q5.95 2.4 -5.8 16.95Q-8.6 19.85 -14.25 24.45Q-28.15 34.05 -39.75 37.05Q-8.7 56.4 51.85 24.8Q-17.85 71.35 -45.95 39.75L-51.35 41.7Q-20.3 73.35 56.15 46.1Q-31.65 86.5 -57.3 43.65L-62.25 44.3Q-36.75 84.35 39.25 75.7Q-49.1 94.95 -67.4 45.5L-74.5 44.6Q-56.9 93.4 17.65 103.85Q-70 101.3 -78.45 43.95Q-83.15 42.95 -87.45 40.9Q-78.8 99.95 -5.6 130.9Q-92.2 105.25 -89.95 40.25L-91.75 39.4Q-98.65 103.8 -27.95 154.65Q-109.7 105 -94.95 36.3L-92.45 27.35Q-93.05 33.9 -92.05 34.75Q-91.1 35.55 -88.95 36.7L-87.95 37Q-83.7 38.25 -79.05 38.8L-77.25 38.95Q-72.55 39.3 -67.5 38.85L-65.45 38.65Q-44.4 36.05 -17.8 19.6Q-9.9 12.8 -15.15 4.4Q-18.15 3.15 -19 0Q-18.15 -3.15 -15.15 -4.4Q-9.9 -12.8 -17.8 -19.6L-17.8 -19.55Q-44.4 -36.05 -65.45 -38.6L-67.5 -38.8Q-72.55 -39.3 -77.25 -38.95L-79.05 -38.75Q-83.7 -38.25 -87.95 -36.95L-88.95 -36.65Q-91.1 -35.55 -92.05 -34.7Q-93.05 -33.9 -92.45 -27.35M-8.6,15.6Q-17.8 23.3 -21.25 24.2Q-28.3 29.9 -39.2 33.3Q-52.45 38.85 -66.6 40.5Q-79.85 42 -92.35 36Q-93.5 35.65 -93.25 31.55L-94.05 36.1Q-96.1 46.05 -96 56.15Q-95.8 70.5 -90.8 84.1Q-86 97.3 -77.9 108.75Q-70.3 119.35 -61.1 128.6Q-65.95 123.1 -70.25 117.25Q-74.6 111.35 -78.45 105.15Q-82.1 99.3 -85 93Q-88.05 86.55 -90.05 79.7Q-92.15 72.5 -93.25 65.1Q-94.4 58.2 -94.1 51.2Q-93.75 44.35 -92.7 37.6L-89.8 38.9L-88.95 39.45Q-88.65 54.15 -87.55 59.55Q-80.65 94.5 -36.65 117.25Q-79.8 89.8 -86.3 53.1Q-87.65 46.65 -88 39.65Q-82.9 41.75 -77.45 42.75Q-75.75 50.75 -73.65 57.15Q-63.75 86.35 -17 98.3Q-24.05 95.95 -30.6 92.75L-43.65 85.9Q-49.9 82.35 -55.45 77.6Q-60.8 73 -64.8 67.15Q-68.9 61.25 -71.85 54.85Q-74.6 49.1 -76.35 42.95L-70.55 43.6L-67 43.6Q-62.95 52.1 -60.5 55.4L-56.8 60.35Q-54.55 63.35 -48.8 66.9Q-43.05 70.4 -36.5 73Q-29.85 75.65 -22.85 77.15Q-16.2 78.55 -9.45 79.15Q-2.2 79.8 5.1 79.35Q-45.9 75.55 -60.6 50.3L-64.7 43.4L-56.05 41.95Q-53.85 45.65 -50.25 50Q-32.2 72.1 21 57.85Q-34.85 68.4 -51.15 44.85L-53.7 41.2L-45.35 38.35L-42.05 40.95Q-17.75 61.45 29.75 36.85Q19.85 40.9 12.75 42.9Q5.95 44.75 -1 46Q-8.35 47.35 -16.2 46.35Q-24.05 45.3 -31.5 43.3Q-38.9 41.25 -42.55 37.05L-34.25 34.05Q-24.55 30.7 -16.75 24.5Q-12.1 20.75 -8.6 15.6" />
          </g>

          {/* ── Espina (Spine) — gold gradient ── */}
          <g id="Espina" transform="matrix(1,0,0,1,0,0)">
            <linearGradient id="GradSpineUp" gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0.0229492,0,0,-0.0152893,0,0.05)"
              spreadMethod="pad" x1="-819.2" y1="0" x2="819.2" y2="0">
              <stop offset="0" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: '#5c3a00', stopOpacity: 1 }} />
            </linearGradient>
            <path style={{ fill: 'url(#GradSpineUp)' }}
              d="M-18.8,0Q-17.85 -5.7 -12.3 -9.6Q-11.2 -5.35 -6.5 -8.25L-6.45 -8.2L-6.2 -8.3
                 Q1.25 -16.25 6.65 -12.4Q0.05 -12.55 0 -5.95Q2.7 -2.4 7.75 -4.1Q18 -1.45 18.8 0L-18.8 0" />
            <linearGradient id="GradSpineDn" gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0.0229492,0,0,0.0152893,0,-0.05)"
              spreadMethod="pad" x1="-819.2" y1="0" x2="819.2" y2="0">
              <stop offset="0" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: '#5c3a00', stopOpacity: 1 }} />
            </linearGradient>
            <path style={{ fill: 'url(#GradSpineDn)' }}
              d="M18.8,0Q18 1.45 7.75 4.1Q2.7 2.4 0 5.95Q0.05 12.55 6.65 12.4Q1.25 16.25 -6.2 8.35
                 Q-6.35 8.25 -6.45 8.25L-6.5 8.25Q-11.2 5.35 -12.3 9.6Q-17.85 5.7 -18.8 0L18.8 0" />
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
          {'> Real-time physics simulation: ENABLED'}
        </div>
        <div className="text-orange-300 animate-pulse" style={{ animationDelay: '1.5s' }}>
          {'> Ancient Dragon consciousness: AWAKENED'}
        </div>
        <div className="text-yellow-500 animate-pulse" style={{ animationDelay: '2s' }}>
          {'> touch / move mouse • click to place food ◆'}
        </div>
      </div>

      {/* Score */}
      {score > 0 && (
        <div className="absolute top-4 right-4 font-mono text-xs z-10 pointer-events-none" style={{ color: '#ffd700' }}>
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
          <span className="text-blue-400">Auto Feed: ON</span>
          <span className="text-red-400">Fire Breath: ON</span>
        </div>
      </div>
    </div>
  );
}
