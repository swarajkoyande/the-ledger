import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import BorderGlow from '../components/BorderGlow'
import { Seo } from '../components/Seo'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

// ── WORLD MAP ─────────────────────────────────────────────────────────────────
const MAP_W = 1000, MAP_H = 500

const MAP_CHAPTERS = [
  { id: 'tokyo',     lon: 139.69, lat: 35.69,  flag: '🇯🇵', title: 'Tokyo',      country: 'Japan',
    tag: 'Founding Chapter', tc: '#f97316', tb: 'rgba(249,115,22,0.1)', tbr: 'rgba(249,115,22,0.28)',
    stats: ['35+ Members', '7 Schools'],
    desc: 'Our flagship chapter — weekly market discussions, live trading simulations, and a growing alumni network spanning the city.' },
  { id: 'india',     lon: 78.96,  lat: 20.59,  flag: '🇮🇳', title: 'India',      country: 'Delhi · Tamil Nadu · Gujarat',
    tag: 'Expanding Fast', tc: '#4ade80', tb: 'rgba(74,222,128,0.08)', tbr: 'rgba(74,222,128,0.2)',
    stats: ['3 Regions', 'Since 2024'],
    desc: "The Ledger's most ambitious expansion — Delhi, Tamil Nadu, Gujarat — meeting the demand for applied financial education." },
  { id: 'madrid',    lon: -3.70,  lat: 40.42,  flag: '🇪🇸', title: 'Madrid',     country: 'Spain',
    tag: 'European Hub', tc: '#C4A882', tb: 'rgba(196,168,130,0.08)', tbr: 'rgba(196,168,130,0.22)',
    stats: ['EU Chapter', 'Active'],
    desc: "The Ledger's European home. Market deep-dives, case competitions, and discussions on Europe's evolving economic landscape." },
  { id: 'goldcoast', lon: 153.43, lat: -28.02, flag: '🇦🇺', title: 'Gold Coast', country: 'Australia',
    tag: 'Fintech Focus', tc: '#818cf8', tb: 'rgba(129,140,248,0.08)', tbr: 'rgba(129,140,248,0.2)',
    stats: ['Fintech', 'Active'],
    desc: 'Where finance meets technology. Algorithmic trading, fintech models, and how software is reshaping capital markets.' },
  { id: 'newyork',   lon: -74.01, lat: 40.71,  flag: '🇺🇸', title: 'New York',   country: 'United States',
    tag: 'Western Hemisphere', tc: '#f97316', tb: 'rgba(249,115,22,0.1)', tbr: 'rgba(249,115,22,0.28)',
    stats: ['Active', 'EST'],
    desc: "The financial capital of the Western world — and The Ledger's first foothold in North America. Built for Wall Street ambition." },
  { id: 'calgary',   lon: -114.07, lat: 51.05, flag: '🇨🇦', title: 'Calgary',    country: 'Canada',
    tag: 'Western Hemisphere', tc: '#f97316', tb: 'rgba(249,115,22,0.1)', tbr: 'rgba(249,115,22,0.28)',
    stats: ['Active', 'MST'],
    desc: "Canada's energy capital and a rising hub for finance and entrepreneurship. Calgary brings a frontier ambition to The Ledger network." },
]

type MapChapter = typeof MAP_CHAPTERS[number]
type PinPos = { ch: MapChapter; cx: number; cy: number }

function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef    = useRef<SVGSVGElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)
  const [activeChapter, setActiveChapter] = useState<MapChapter | null>(null)
  const [cardPos, setCardPos] = useState({ left: 0, top: 0, flip: false })
  const [pins, setPins] = useState<PinPos[]>([])

  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    if (!canvas) return
    const W = MAP_W, H = MAP_H
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0d0c0a'; ctx.fillRect(0, 0, W, H)
    ;(async () => {
      const world = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json').then(r => r.json())
      if (cancelled) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const land = topojson.feature(world as Parameters<typeof topojson.feature>[0], (world as any).objects.land)
      const off = document.createElement('canvas'); off.width = W; off.height = H
      const oc = off.getContext('2d')!
      const proj = d3.geoEquirectangular().scale(H / Math.PI).translate([W / 2, H / 2])
      oc.fillStyle = '#fff'; oc.beginPath(); d3.geoPath(proj, oc)(land); oc.fill()
      const pix = oc.getImageData(0, 0, W, H).data
      const isLand = (x: number, y: number) => { const i = (Math.round(y) * W + Math.round(x)) * 4; return i >= 0 && i < pix.length && pix[i] > 100 }
      const SP = 7, R = 2.5
      ctx.fillStyle = 'rgba(160,155,148,0.55)'
      for (let y = SP / 2; y < H; y += SP)
        for (let x = SP / 2; x < W; x += SP)
          if (isLand(x, y)) { ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill() }
      const computed: PinPos[] = MAP_CHAPTERS.map(ch => { const [cx, cy] = proj([ch.lon, ch.lat]) as [number, number]; return { ch, cx, cy } })
      if (!cancelled) setPins(computed)
    })()
    return () => { cancelled = true }
  }, [])

  const handlePinEnter = (pin: PinPos) => {
    const wrap = wrapRef.current, card = cardRef.current
    if (!wrap || !card) return
    const mapW = wrap.offsetWidth, mapH = wrap.offsetHeight
    const CW = 234, GAP = 14
    const pinX = pin.cx * (mapW / MAP_W), pinY = pin.cy * (mapH / MAP_H)
    const goRight = pinX + GAP + CW < mapW - 4
    const left = goRight ? pinX + GAP : pinX - GAP - CW
    const cardH = card.offsetHeight || 175
    let top = pinY - cardH / 2
    if (top < 4) top = 4
    if (top + cardH > mapH + 60) top = mapH + 60 - cardH
    setCardPos({ left, top, flip: !goRight })
    setActiveChapter(pin.ch)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={wrapRef} style={{ position: 'relative', background: '#0d0c0a', borderRadius: '16px', overflow: 'hidden', minHeight: '200px' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 'auto' }} />
        <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'all' }}>
          {pins.map((pin, i) => (
            <g key={pin.ch.id} transform={`translate(${pin.cx.toFixed(1)},${pin.cy.toFixed(1)})`} style={{ cursor: 'pointer' }}
              onMouseEnter={() => handlePinEnter(pin)} onMouseLeave={() => setActiveChapter(null)}>
              <circle r="4.5" fill="none" stroke="#f97316" strokeWidth="1.2">
                <animate attributeName="r" values="4.5;20;4.5" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite"/>
              </circle>
              <circle r="4.5" fill="none" stroke="#f97316" strokeWidth="0.8">
                <animate attributeName="r" values="4.5;20;4.5" dur="2.4s" begin={`${i * 0.6 + 1.2}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" begin={`${i * 0.6 + 1.2}s`} repeatCount="indefinite"/>
              </circle>
              <circle r={activeChapter?.id === pin.ch.id ? 6 : 4.5} fill="#f97316"
                style={{ transition: 'r 0.15s ease', filter: 'drop-shadow(0 0 8px rgba(249,115,22,1)) drop-shadow(0 0 16px rgba(249,115,22,0.5))' }} />
            </g>
          ))}
        </svg>
      </div>
      <div ref={cardRef} style={{ position: 'absolute', left: cardPos.left, top: cardPos.top, width: '230px', background: '#1c1a16', border: '0.5px solid rgba(249,115,22,0.3)', borderRadius: '14px', padding: '13px 15px', pointerEvents: 'none', zIndex: 20, opacity: activeChapter ? 1 : 0, transform: activeChapter ? 'scaleX(1)' : 'scaleX(0.88)', transformOrigin: cardPos.flip ? 'right center' : 'left center', transition: 'opacity 0.16s ease, transform 0.16s ease' }}>
        {activeChapter && (<>
          <div style={{ fontSize: '18px', marginBottom: '5px', lineHeight: 1 }}>{activeChapter.flag}</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f97316', marginBottom: '2px', fontFamily: '"Futura","Century Gothic",sans-serif' }}>{activeChapter.title}</div>
          <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '7px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{activeChapter.country}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '9px', fontWeight: 300 }}>{activeChapter.desc}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <span style={{ fontSize: '9.5px', padding: '2px 8px', borderRadius: '99px', background: activeChapter.tb, color: activeChapter.tc, border: `0.5px solid ${activeChapter.tbr}`, fontFamily: 'monospace' }}>{activeChapter.tag}</span>
            {activeChapter.stats.map(s => <span key={s} style={{ fontSize: '9.5px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>{s}</span>)}
          </div>
        </>)}
      </div>
    </div>
  )
}

const chapters = [
  {
    city: 'Tokyo', country: 'Japan', flag: '🇯🇵',
    tag: 'Founding Chapter', tagStyle: { color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' },
    stats: [{ v: '35+', l: 'Members' }, { v: '7', l: 'Schools' }],
    desc: 'Our flagship chapter unites 35+ members from 7 schools across Tokyo — bound by a belief that young people deserve to understand money, markets, and their financial future. Weekly market discussions, live trading simulations, and a growing alumni network that spans the city.',
  },
  {
    city: 'India', country: 'Delhi · Tamil Nadu · Gujarat', flag: '🇮🇳',
    tag: 'Expanding Fast', tagStyle: { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.18)' },
    stats: [{ v: '3', l: 'Regions' }, { v: '2024', l: 'Launched' }],
    desc: 'Spanning three regions — Delhi in the North, Tamil Nadu in the South, Gujarat in the West — India is The Ledger\'s most ambitious expansion. In one of the world\'s youngest nations, the demand for accessible, applied financial education is enormous. We\'re here for it.',
  },
  {
    city: 'Madrid', country: 'Spain', flag: '🇪🇸',
    tag: 'European Hub', tagStyle: { color: '#C4A882', background: 'rgba(196,168,130,0.08)', border: '1px solid rgba(196,168,130,0.2)' },
    stats: [{ v: 'EU', l: 'Chapter' }, { v: 'Active', l: 'Status' }],
    desc: 'The Ledger\'s European home brings together students passionate about economics, investing, and the kind of real financial knowledge that goes beyond the classroom. Market deep-dives, case competitions, and discussions on Europe\'s evolving economic landscape.',
  },
  {
    city: 'Gold Coast', country: 'Australia', flag: '🇦🇺',
    tag: 'Fintech Focus', tagStyle: { color: '#818cf8', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.18)' },
    stats: [{ v: 'Fintech', l: 'Focus' }, { v: 'Active', l: 'Status' }],
    desc: 'Where finance meets technology. Gold Coast members pull apart fintech models, explore algorithmic trading, and understand how software is reshaping capital markets. The most technically focused chapter in the network — and proud of it.',
  },
  {
    city: 'New York', country: 'United States', flag: '🇺🇸',
    tag: 'Western Hemisphere', tagStyle: { color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' },
    stats: [{ v: 'Active', l: 'Status' }, { v: 'EST', l: 'Region' }],
    desc: 'New York is the financial capital of the Western world — and The Ledger\'s first foothold in North America. A chapter rooted in Wall Street culture: rigorous, ambitious, and relentlessly focused on markets. The first stepping stone of the Western Hemisphere.',
  },
  {
    city: 'Calgary', country: 'Canada', flag: '🇨🇦',
    tag: 'Western Hemisphere', tagStyle: { color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' },
    stats: [{ v: 'Active', l: 'Status' }, { v: 'MST', l: 'Region' }],
    desc: 'Calgary is Canada\'s energy capital and one of its fastest-growing hubs for finance, entrepreneurship, and innovation. The Ledger\'s Canadian chapter brings the same rigour and competitive edge that defines the network globally — to the heart of the Western frontier. The Western Hemisphere expansion continues.',
  },
]

// ── INJECTED CSS ──────────────────────────────────────────────────────────────
const css = `
  .ch-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes ch-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes ch-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes ch-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes ch-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ch-globe:hover  { color: #ff9a50; text-shadow: 0 0 40px rgba(249,115,22,0.35); }
  .ch-expand:hover { text-shadow: 0 0 60px rgba(249,115,22,0.8); filter: brightness(1.15); }
  .ch-globe, .ch-expand { transition: color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease; }

  .ch-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F97316;
    color: #0E0C09;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-weight: 900;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 14px 28px;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    text-decoration: none;
    transition: box-shadow 0.25s ease, background 0.2s ease;
    box-shadow: 0 0 0px rgba(249,115,22,0);
  }
  .ch-btn-primary:hover {
    background: #ff8c38;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2), inset 0 0 12px rgba(255,255,255,0.12);
  }
`

export default function ChaptersPage() {
  const heroRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [scrollY, setScrollY] = useState(0)
  const [openCard, setOpenCard] = useState<string | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const handleMouseLeave = () => setMouse({ x: -9999, y: -9999 })

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <Seo
      title="Chapters — Student Finance Clubs Worldwide | The Ledger"
      description="Find The Ledger student finance and economics chapters in Tokyo, India, Madrid, Gold Coast, and more. Join a local chapter or start one at your school."
      path="/chapters"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: chapters.map((ch, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${ch.city}, ${ch.country}`,
        })),
      }}
    />
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden ch-futura"
        style={{ background: '#0E0C09', minHeight: '90vh', paddingTop: '68px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Layer 0: grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        {/* Layer 1: scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 5px)',
            zIndex: 1,
          }}
        />

        {/* Layer 2: drifting background orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-80px',
            width: '620px', height: '620px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 65%)',
            animation: 'ch-orb-drift 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)',
            animation: 'ch-orb-drift 18s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '35%',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)',
            animation: 'ch-orb-drift 22s ease-in-out infinite',
            animationDelay: '-7s',
          }} />
        </div>

        {/* Layer 3: mouse-tracking glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(249,115,22,0.11) 0%, rgba(249,115,22,0.04) 30%, transparent 60%)`,
            zIndex: 3,
            transition: 'background 0.08s ease',
          }}
        />

        {/* Layer 4: HUD corner brackets */}
        {([
          { style: { top: 84, left: 20 },    d: 'M0 16 L0 0 L16 0' },
          { style: { top: 84, right: 20 },   d: 'M0 0 L16 0 L16 16' },
          { style: { bottom: 52, left: 20 }, d: 'M0 0 L0 16 L16 16' },
          { style: { bottom: 52, right: 20 }, d: 'M16 0 L16 16 L0 16' },
        ] as { style: React.CSSProperties; d: string }[]).map((b, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="absolute pointer-events-none"
            style={{ ...b.style, zIndex: 5, animation: `ch-hud-blink 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <path d={b.d} stroke="rgba(249,115,22,0.45)" strokeWidth="1.2" />
          </svg>
        ))}

        {/* Layer 5: diagonal slash */}
        <div className="absolute pointer-events-none" style={{
          left: '40%', top: 0, width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(196,168,130,0.12) 20%, rgba(196,168,130,0.2) 50%, rgba(196,168,130,0.12) 80%, transparent 100%)',
          transform: 'rotate(10deg)', transformOrigin: 'top center',
          zIndex: 4,
        }} />

        {/* Rotated eyebrow — left edge */}
        <div className="absolute left-5 top-1/2 hidden md:flex items-center gap-2" style={{
          writingMode: 'vertical-rl',
          transform: 'translateY(-50%) rotate(180deg)',
          zIndex: 6,
        }}>
          <span style={{ color: 'rgba(249,115,22,0.7)', fontSize: '8px' }}>◆</span>
          <span style={{ color: 'rgba(196,168,130,0.5)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Global Chapters · 2026
          </span>
        </div>

        {/* Main content */}
        <div
          className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Monospace label */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'ch-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ LEDGER_NETWORK ]
          </div>

          {/* Avant-garde heading */}
          <h1 style={{ lineHeight: 0.88, margin: '0 0 28px', fontWeight: 'inherit', fontSize: 'inherit' }}>
            <div
              className="ch-globe"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 10rem)',
                fontWeight: 900,
                color: '#F5F0E8',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
                opacity: 0,
                animation: 'ch-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards',
              }}
            >
              GLOBAL.
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.5rem', marginTop: '6px', opacity: 0, animation: 'ch-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
              <span style={{
                fontSize: 'clamp(1.3rem, 2.8vw, 2.3rem)',
                fontWeight: 400,
                color: '#C4A882',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transform: 'rotate(0deg)',
                display: 'inline-block',
                fontFamily: '"Futura", "Century Gothic", sans-serif',
              }}>
                local roots.
              </span>
              <span
                className="ch-expand"
                style={{
                  fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                  fontWeight: 900,
                  color: '#F97316',
                  letterSpacing: '-0.04em',
                  cursor: 'default',
                  textShadow: '0 0 40px rgba(249,115,22,0.45)',
                }}
              >
                EXPAND.
              </span>
            </div>
          </h1>

          {/* Body */}
          <div style={{ maxWidth: '420px', opacity: 0, animation: 'ch-word-in 0.6s ease 0.45s forwards' }}>
            <p style={{
              color: '#7A6B58',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.75,
              marginBottom: '36px',
              transform: 'rotate(0deg)',
              transformOrigin: 'left center',
              fontFamily: 'inherit',
            }}>
              Tokyo · Delhi · Madrid · Gold Coast.<br />
              New York · Toronto — next.<br />
              The Ledger is building a generation of financially literate leaders — one chapter at a time.
            </p>
          </div>

          {/* Bottom-right chapter count */}
          <div style={{
            position: 'absolute', right: '48px', bottom: '60px',
            textAlign: 'right', opacity: 0,
            animation: 'ch-word-in 0.5s ease 0.6s forwards',
          }}>
            <div style={{ fontSize: '9px', color: '#3A3028', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Chapters</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#F97316', lineHeight: 1, textShadow: '0 0 30px rgba(249,115,22,0.45)' }}>{chapters.length}</div>
          </div>

          {/* Decorative ghost "N" */}
          <div style={{
            position: 'absolute', right: '-40px', top: '30px',
            fontSize: '55vw', fontWeight: 900, lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(249,115,22,0.06)',
            letterSpacing: '-0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}>
            N
          </div>
        </div>

        {/* Ticker strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          overflow: 'hidden',
          borderTop: '1px solid rgba(249,115,22,0.18)',
          background: 'rgba(249,115,22,0.04)',
          padding: '9px 0',
          zIndex: 7,
        }}>
          <div style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'ch-ticker 22s linear infinite',
            width: 'max-content',
          }}>
            {[0, 1].map(i => (
              <span key={i} style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: 'rgba(249,115,22,0.55)',
                letterSpacing: '0.22em',
                paddingRight: '48px',
              }}>
                TOKYO &nbsp;·&nbsp; DELHI &nbsp;·&nbsp; MADRID &nbsp;·&nbsp; GOLD COAST &nbsp;·&nbsp; NEW YORK &nbsp;·&nbsp; TORONTO &nbsp;·&nbsp; 6 CHAPTERS &nbsp;·&nbsp; 7 COUNTRIES &nbsp;·&nbsp; FOUNDED 2023 &nbsp;·&nbsp; GROWING FAST &nbsp;·&nbsp; APPLY NOW &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORLD MAP ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', paddingBottom: '0' }}>
        <FadeIn>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 pb-0">
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '8px' }}>
                [ GLOBAL_FOOTPRINT ]
              </p>
              <h1 style={{ fontFamily: '"Futura","Century Gothic",sans-serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, color: '#F5F0E8', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Where we are
              </h1>
              <p style={{ fontSize: '14px', color: '#6B5E50', fontWeight: 300, lineHeight: 1.7, maxWidth: '460px' }}>
                Six chapters. Seven countries. One network — and the Western Hemisphere is next.
              </p>
            </div>
            <WorldMap />
          </div>
        </FadeIn>
      </section>

      {/* ── CHAPTER CARDS ─────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', padding: '20px 0 80px' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '24px' }}>[ ACTIVE_CHAPTERS ]</p>
          <div className="space-y-3">
            {chapters.map((ch, i) => {
              const isOpen = openCard === ch.city
              return (
                <FadeIn key={ch.city} delay={i * 80} direction="up">
                  <BorderGlow
                    borderRadius={16}
                    animated
                    glowColor="24 95 53"
                    colors={['#f97316', '#c4a882', '#92400e']}
                    backgroundColor="#0E0C09"
                  >
                  <div
                    style={{
                      cursor: 'pointer',
                      transition: 'background 0.25s ease',
                      background: isOpen ? 'rgba(249,115,22,0.04)' : 'transparent',
                    }}
                    onClick={() => setOpenCard(isOpen ? null : ch.city)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 28px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{ch.flag}</div>
                      <div style={{ minWidth: '140px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F5F0E8', fontFamily: '"Futura","Century Gothic",sans-serif', lineHeight: 1.1 }}>{ch.city}</div>
                        <div style={{ fontSize: '11px', color: '#6B5E50', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} />{ch.country}</div>
                      </div>
                      <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '3px 11px', borderRadius: '99px', whiteSpace: 'nowrap', ...ch.tagStyle }}>{ch.tag}</span>
                      <div style={{ display: 'flex', gap: '24px', marginLeft: 'auto' }}>
                        {ch.stats.map(s => (
                          <div key={s.l} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F97316', lineHeight: 1 }}>{s.v}</div>
                            <div style={{ fontSize: '10px', color: '#6B5E50', fontWeight: 300, marginTop: '2px', letterSpacing: '0.04em' }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <ChevronDown size={16} style={{ color: isOpen ? '#F97316' : '#4A3F35', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.2s ease', flexShrink: 0 }} />
                    </div>
                    <div style={{ maxHeight: isOpen ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                      <div style={{ padding: '0 28px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '16px', color: '#9A8B7A', fontWeight: 300, lineHeight: 1.8, paddingTop: '22px' }}>{ch.desc}</p>
                      </div>
                    </div>
                  </div>
                  </BorderGlow>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── EXPANSION CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p style={{ color: '#C4A882', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'monospace' }}>
              [ YOUR_CITY_NEXT ]
            </p>
            <h2
              style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '16px', lineHeight: 1.1, fontFamily: '"Futura","Century Gothic",sans-serif' }}
            >
              Start a chapter in your city.
            </h2>
            <p style={{ color: '#6B5E50', fontSize: '17px', fontWeight: 300, maxWidth: '480px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              The Ledger is actively expanding. Apply to become a Regional Head and bring the network to your community.
            </p>
            <Link to="/register" className="ch-btn-primary">
              Apply as Regional Head <ArrowRight size={13} />
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
    </>
  )
}
