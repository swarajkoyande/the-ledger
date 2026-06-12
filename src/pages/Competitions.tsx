import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { useState, useEffect, useRef } from 'react'

// ── WORLD MAP ─────────────────────────────────────────────────────────────────
const MAP_W = 800, MAP_H = 400

function lonLatToXY(lon: number, lat: number): [number, number] {
  return [
    (lon + 180) / 360 * MAP_W,
    (90 - lat) / 180 * MAP_H,
  ]
}

const CHAPTER_CITIES = [
  { id: 'tokyo',     name: 'Tokyo',      lon: 139.7,  lat: 35.7,  members: 12, flag: '🇯🇵', hq: true  },
  { id: 'singapore', name: 'Singapore',  lon: 103.8,  lat: 1.4,   members: 8,  flag: '🇸🇬', hq: false },
  { id: 'mumbai',    name: 'Mumbai',     lon: 72.9,   lat: 19.1,  members: 15, flag: '🇮🇳', hq: false },
  { id: 'madrid',    name: 'Madrid',     lon: -3.7,   lat: 40.4,  members: 9,  flag: '🇪🇸', hq: false },
  { id: 'london',    name: 'London',     lon: -0.1,   lat: 51.5,  members: 11, flag: '🇬🇧', hq: false },
  { id: 'newyork',   name: 'New York',   lon: -74.0,  lat: 40.7,  members: 7,  flag: '🇺🇸', hq: false },
  { id: 'sydney',    name: 'Sydney',     lon: 151.2,  lat: -33.9, members: 6,  flag: '🇦🇺', hq: false },
]

// Simplified continent polygons (equirectangular, 800×400 viewBox)
const LAND_PATHS = [
  // North America
  'M44,42 L82,28 L132,24 L182,30 L212,42 L230,62 L240,84 L238,104 L232,126 L222,148 L214,168 L208,186 L200,194 L190,186 L178,168 L162,148 L144,128 L126,104 L106,86 L88,76 L64,66 L46,58 Z',
  // Greenland
  'M218,18 L252,12 L282,18 L290,34 L278,52 L256,58 L232,50 L218,34 Z',
  // South America
  'M200,194 L222,178 L244,170 L270,176 L314,182 L318,208 L298,254 L270,302 L246,330 L226,360 L214,374 L202,366 L194,336 L190,296 L190,254 L198,220 Z',
  // Europe
  'M382,118 L362,108 L355,96 L364,80 L380,66 L397,53 L420,46 L446,42 L464,46 L474,62 L470,82 L462,100 L450,112 L446,124 L428,130 L406,124 L388,120 Z',
  // Africa
  'M384,120 L352,138 L342,164 L344,188 L362,200 L388,204 L414,202 L432,212 L442,240 L440,274 L428,310 L412,338 L394,344 L374,338 L356,310 L342,274 L336,240 L340,207 L350,182 L356,160 L366,140 L376,124 Z',
  // Asia (main body)
  'M468,106 L490,86 L516,66 L558,50 L604,42 L648,42 L692,52 L726,62 L750,84 L750,110 L738,134 L718,154 L694,168 L666,180 L640,184 L618,190 L600,196 L584,182 L566,190 L552,208 L538,202 L520,188 L506,172 L496,156 L488,140 L476,126 Z',
  // India
  'M536,152 L560,148 L574,160 L576,178 L568,194 L554,204 L540,198 L528,182 L527,165 Z',
  // SE Asia
  'M614,188 L636,182 L652,186 L663,200 L663,216 L648,224 L630,220 L618,209 Z',
  // Japan
  'M708,103 L716,96 L724,100 L724,110 L718,117 L710,118 Z',
  // Korea
  'M698,110 L706,106 L712,110 L710,118 L702,120 L696,116 Z',
  // British Isles
  'M372,64 L378,60 L384,62 L384,72 L376,76 L370,70 Z',
  // Australia
  'M658,268 L672,250 L694,228 L722,222 L742,240 L746,264 L738,286 L720,298 L700,302 L678,296 L660,282 Z',
  // New Zealand (tiny)
  'M754,302 L758,296 L764,300 L762,308 L756,310 Z',
]

type TooltipState = { id: string; x: number; y: number } | null

function WorldMap() {
  const [tooltip, setTooltip] = useState<TooltipState>(null)
  const [visible, setVisible] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.25 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hqCity = CHAPTER_CITIES.find(c => c.hq)!

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      {/* HUD header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px rgba(74,222,128,0.9)',
            animation: 'cf-hud-blink 2s ease-in-out infinite',
          }}/>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.7)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            GLOBAL_REACH
          </span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(196,168,130,0.45)', letterSpacing: '0.18em' }}>
          {CHAPTER_CITIES.length} CHAPTERS · 7 COUNTRIES
        </span>
      </div>

      {/* Map container */}
      <div style={{
        position: 'relative',
        border: '1px solid rgba(249,115,22,0.14)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(8,18,38,0.7)',
      }}>
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ocean base */}
          <rect width={MAP_W} height={MAP_H} fill="transparent" />

          {/* Grid */}
          {[-60,-30,0,30,60].map(lat => {
            const y = (90 - lat) / 180 * MAP_H
            return <line key={`lat${lat}`} x1={0} y1={y} x2={MAP_W} y2={y}
              stroke={lat === 0 ? 'rgba(249,115,22,0.14)' : 'rgba(249,115,22,0.05)'}
              strokeWidth={lat === 0 ? 1 : 0.5}
              strokeDasharray={lat === 0 ? undefined : '3 6'}
            />
          })}
          {[-120,-60,0,60,120].map(lon => {
            const x = (lon + 180) / 360 * MAP_W
            return <line key={`lon${lon}`} x1={x} y1={0} x2={x} y2={MAP_H}
              stroke="rgba(249,115,22,0.05)" strokeWidth="0.5" strokeDasharray="3 6"
            />
          })}

          {/* Continent fills */}
          {LAND_PATHS.map((d, i) => (
            <path key={i} d={d}
              fill="rgba(196,168,130,0.10)"
              stroke="rgba(196,168,130,0.18)"
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
          ))}

          {/* Connection lines from HQ (Tokyo) */}
          {visible && CHAPTER_CITIES.filter(c => !c.hq).map(city => {
            const [x1, y1] = lonLatToXY(hqCity.lon, hqCity.lat)
            const [x2, y2] = lonLatToXY(city.lon, city.lat)
            return (
              <line key={`line-${city.id}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(249,115,22,0.18)" strokeWidth="0.7"
                strokeDasharray="4 5"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="3s" repeatCount="indefinite"/>
              </line>
            )
          })}

          {/* City pins */}
          {CHAPTER_CITIES.map((city, i) => {
            const [cx, cy] = lonLatToXY(city.lon, city.lat)
            const isHovered = tooltip?.id === city.id
            const delay = `${i * 0.4}s`
            return (
              <g key={city.id}
                onMouseEnter={e => {
                  const svgEl = (e.currentTarget.ownerSVGElement as SVGSVGElement)
                  const rect = svgEl.getBoundingClientRect()
                  const svgW = svgEl.viewBox.baseVal.width
                  const svgH = svgEl.viewBox.baseVal.height
                  const scaleX = rect.width / svgW
                  const scaleY = rect.height / svgH
                  setTooltip({ id: city.id, x: cx * scaleX + rect.left, y: cy * scaleY + rect.top })
                }}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer pulse ring */}
                {visible && (
                  <circle cx={cx} cy={cy} r="4" fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1">
                    <animate attributeName="r" values="4;14;4" dur="3s" begin={delay} repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" begin={delay} repeatCount="indefinite"/>
                  </circle>
                )}
                {/* Core dot */}
                <circle cx={cx} cy={cy}
                  r={city.hq ? 5.5 : isHovered ? 5 : 3.5}
                  fill={city.hq ? '#F97316' : '#F97316'}
                  style={{
                    filter: `drop-shadow(0 0 ${city.hq ? 10 : isHovered ? 8 : 5}px rgba(249,115,22,${city.hq ? 1 : isHovered ? 0.9 : 0.65}))`,
                    transition: 'r 0.15s',
                  }}
                />
                {/* HQ crown ring */}
                {city.hq && (
                  <circle cx={cx} cy={cy} r="9" fill="none" stroke="rgba(249,115,22,0.45)" strokeWidth="1.2"/>
                )}
              </g>
            )
          })}

          {/* Equator label */}
          <text x="8" y={MAP_H/2 - 4}
            style={{ fontFamily: 'monospace', fontSize: '7px', fill: 'rgba(249,115,22,0.35)', letterSpacing: '0.15em' }}>
            EQUATOR
          </text>
        </svg>

        {/* HTML tooltip overlay */}
        {tooltip && (() => {
          const city = CHAPTER_CITIES.find(c => c.id === tooltip.id)!
          return (
            <div style={{
              position: 'fixed',
              left: tooltip.x + 12,
              top: tooltip.y - 28,
              transform: 'translateZ(0)',
              zIndex: 50,
              pointerEvents: 'none',
              background: 'rgba(10,12,8,0.95)',
              border: '1px solid rgba(249,115,22,0.4)',
              borderRadius: '8px',
              padding: '8px 12px',
              minWidth: '120px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#F5F0E8', fontWeight: 700, marginBottom: '2px' }}>
                {city.flag} {city.name}
                {city.hq && <span style={{ marginLeft: '6px', fontSize: '8px', color: '#F97316', letterSpacing: '0.1em' }}>HQ</span>}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.7)', letterSpacing: '0.08em' }}>
                {city.members} members
              </div>
            </div>
          )
        })()}

        {/* Bottom legend */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '16px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#F97316', boxShadow: '0 0 8px rgba(249,115,22,0.8)' }}/>
            <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(196,168,130,0.5)', letterSpacing: '0.12em' }}>ACTIVE CHAPTER</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="24" height="8" style={{ overflow: 'visible' }}>
              <line x1="0" y1="4" x2="24" y2="4" stroke="rgba(249,115,22,0.4)" strokeWidth="1" strokeDasharray="3 3"/>
            </svg>
            <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(196,168,130,0.5)', letterSpacing: '0.12em' }}>COMPETITION LINK</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── QUARTERLY AUTO-DETECTION ──────────────────────────────────────────────────
function getTradingQuarter() {
  const now = new Date()
  const month = now.getMonth()
  if (month <= 2) return { season: 'Winter', window: 'Jan – Mar', status: 'Open' }
  if (month <= 5) return { season: 'Spring', window: 'Apr – Jun', status: 'Open' }
  if (month <= 8) return { season: 'Summer', window: 'Jul – Sep', status: 'Open' }
  return { season: 'Fall', window: 'Oct – Dec', status: 'Open' }
}
const tq = getTradingQuarter()

const competitions = [
  {
    name: 'Ledger × EconomiX Economics Case Competition',
    organizer: 'The Ledger · EconomiX',
    region: 'Global (Japan focus)',
    status: 'In Pursuit',
    description: "A two-phase academic competition co-hosted with EconomiX. Phase 1: teams submit a 2–3 page analytical essay on a real Japan economics case study, graded by The Ledger's proprietary AI system + human review panel. Phase 2: top teams compete head-to-head in a live in-person final — presenting policy proposals, fielding judge Q&A, and facing a rebuttal round. 4–6 weeks end-to-end.",
    prize: '🥇 Winner: trophy, internship opportunity with a sponsor, Winner badge on The Ledger · 🎖️ Finalist: badge + joint certificate · All participants: AI scorecard feedback + Participant badge',
    eligibility: 'High school students · Teams of 2–4 · All Ledger chapters globally',
    deadline: 'Competition being finalised — registration opening soon',
  },
  {
    name: 'Ledger × NGYA Economics Debate Championship',
    organizer: 'The Ledger · NGYA',
    region: 'Global (Virtual)',
    status: 'In Pursuit' as const,
    description: 'A 5-day virtual debate tournament built on real-world finance and economics motions — co-hosted with NGYA (Nihon Global Youth Association). No reports, no case packs. Every round is a live debate. Format escalates: 1v1 in prelims, 2v2 in semis, full team clash in the Grand Final.',
    prize: '🏆 Champions: Ledger Fellows badge, crystal engraved trophy, winner medals, co-signed certificate · 🎖️ Runners-up: LinkedIn recommendation from NGYA Executive Founder · 🎤 Best Individual Debater: Sharp Minds Award',
    eligibility: 'All Ledger chapter members globally · Teams of 3–4 · Virtual format',
    deadline: 'Proposed for Summer 2026 — details being confirmed with NGYA',
  },
  {
    name: `Ledger Trading Competition — ${tq.season} 2026`,
    organizer: 'The Ledger Network',
    region: 'Global',
    status: tq.status,
    description: `The Ledger's flagship quarterly trading competition. Each participant starts with a virtual $100,000 portfolio and competes across stocks and crypto — with leverage available. Runs every quarter (Spring · Summer · Fall · Winter). Current session: ${tq.season} ${tq.window}.`,
    prize: '🏆 Ledger Fellows badge permanently on your app profile · Network-wide spotlight · Leaderboard recognition',
    eligibility: 'All active Ledger chapter members globally · Individual · $0 entry fee',
    deadline: `${tq.season} session live now — closes end of ${tq.window.split('–')[1].trim()}`,
  },
]

const statusStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Open:            { label: 'Open',          color: '#F97316', bg: 'rgba(249,115,22,0.12)',   border: '1px solid rgba(249,115,22,0.3)'   },
  'Coming Soon':   { label: 'Coming Soon',   color: '#C4A882', bg: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.3)'  },
  'In Pursuit':    { label: 'In Pursuit',    color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: '1px solid rgba(52,211,153,0.25)'  },
  'In Discussion': { label: 'In Discussion', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)'  },
  Closed:          { label: 'Closed',        color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: '1px solid rgba(107,114,128,0.25)' },
}

// ── INJECTED CSS ──────────────────────────────────────────────────────────────
const css = `
  .cf-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes cf-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes cf-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes cf-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes cf-noise {
    0%   { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  @keyframes cf-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cf-btn-primary {
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
    transition: box-shadow 0.25s ease, background 0.2s ease, color 0.2s ease;
    box-shadow: 0 0 0px rgba(249,115,22,0);
  }
  .cf-btn-primary:hover {
    background: #ff8c38;
    color: #0E0C09;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2), inset 0 0 12px rgba(255,255,255,0.12);
  }

  .cf-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #C4A882;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.06em;
    padding: 2px 0;
    border-bottom: 1px solid rgba(196,168,130,0.35);
    transition: color 0.2s ease, border-color 0.2s ease, text-shadow 0.2s ease;
  }
  .cf-btn-ghost:hover {
    color: #F5F0E8;
    border-color: rgba(245,240,232,0.5);
    text-shadow: 0 0 18px rgba(249,115,22,0.4);
  }

  .cf-compete:hover { color: #ff9a50; text-shadow: 0 0 40px rgba(249,115,22,0.35); }
  .cf-win:hover     { text-shadow: 0 0 60px rgba(249,115,22,0.8); filter: brightness(1.15); }

  .cf-compete, .cf-win { transition: color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease; }

  @keyframes cf-coming-soon-pulse {
    0%, 100% {
      box-shadow: 0 0 0px rgba(249,115,22,0), inset 0 0 0px rgba(249,115,22,0);
      border-color: rgba(249,115,22,0.18);
    }
    40% {
      box-shadow: 0 0 18px rgba(249,115,22,0.35), 0 0 40px rgba(249,115,22,0.12), inset 0 0 10px rgba(249,115,22,0.06);
      border-color: rgba(249,115,22,0.65);
    }
    60% {
      box-shadow: 0 0 22px rgba(249,115,22,0.4), 0 0 50px rgba(249,115,22,0.15), inset 0 0 12px rgba(249,115,22,0.08);
      border-color: rgba(249,115,22,0.75);
    }
  }
  .cf-coming-soon {
    animation: cf-coming-soon-pulse 2.8s ease-in-out infinite;
  }

  @keyframes cf-spotlight-sweep {
    0%   { opacity: 0;   transform: translateX(-80%); }
    15%  { opacity: 1; }
    70%  { opacity: 0.7; }
    100% { opacity: 0;   transform: translateX(140%); }
  }
  .cf-spotlight {
    animation: cf-spotlight-sweep 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`

export default function Competitions() {
  const activeCount = competitions.filter(c => c.status === 'Open').length
  const heroRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [scrollY, setScrollY] = useState(0)
  const [spotlit, setSpotlit] = useState(false)

  const handleBrowse = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSpotlit(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setSpotlit(true)))
  }

  // Mouse tracking for the glow
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const handleMouseLeave = () => setMouse({ x: -9999, y: -9999 })

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden cf-futura"
        style={{ background: '#0E0C09', minHeight: '90vh', paddingTop: '68px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* ── Layer 0: subtle noise/grain texture ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        {/* ── Layer 1: scanlines ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 5px)',
            zIndex: 1,
          }}
        />

        {/* ── Layer 2: static background orbs ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-80px',
            width: '620px', height: '620px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 65%)',
            animation: 'cf-orb-drift 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)',
            animation: 'cf-orb-drift 18s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '35%',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)',
            animation: 'cf-orb-drift 22s ease-in-out infinite',
            animationDelay: '-7s',
          }} />
        </div>

        {/* ── Layer 3: mouse-tracking orange glow ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(249,115,22,0.11) 0%, rgba(249,115,22,0.04) 30%, transparent 60%)`,
            zIndex: 3,
            transition: 'background 0.08s ease',
          }}
        />

        {/* ── Layer 4: HUD corner brackets ── */}
        {([
          { style: { top: 84, left: 20 },   d: 'M0 16 L0 0 L16 0' },
          { style: { top: 84, right: 20 },   d: 'M0 0 L16 0 L16 16' },
          { style: { bottom: 52, left: 20 }, d: 'M0 0 L0 16 L16 16' },
          { style: { bottom: 52, right: 20 },d: 'M16 0 L16 16 L0 16' },
        ] as { style: React.CSSProperties; d: string }[]).map((b, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="absolute pointer-events-none"
            style={{ ...b.style, zIndex: 5, animation: `cf-hud-blink 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <path d={b.d} stroke="rgba(249,115,22,0.45)" strokeWidth="1.2" />
          </svg>
        ))}

        {/* ── Layer 5: diagonal slash ── */}
        <div className="absolute pointer-events-none" style={{
          left: '40%', top: 0, width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(196,168,130,0.12) 20%, rgba(196,168,130,0.2) 50%, rgba(196,168,130,0.12) 80%, transparent 100%)',
          transform: 'rotate(10deg)', transformOrigin: 'top center',
          zIndex: 4,
        }} />

        {/* ── Rotated eyebrow — left edge ── */}
        <div className="absolute left-5 top-1/2 hidden md:flex items-center gap-2" style={{
          writingMode: 'vertical-rl',
          transform: 'translateY(-50%) rotate(180deg)',
          zIndex: 6,
        }}>
          <span style={{ color: 'rgba(249,115,22,0.7)', fontSize: '8px' }}>◆</span>
          <span style={{ color: 'rgba(196,168,130,0.5)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Network Competitions · 2026
          </span>
        </div>

        {/* ── Main content ── */}
        <div
          className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Monospace label */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'cf-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ LEDGER_COMPETITIONS ]
          </div>

          {/* Avant-garde heading */}
          <div style={{ lineHeight: 0.88, marginBottom: '28px' }}>
            <div
              className="cf-compete"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 10rem)',
                fontWeight: 900,
                color: '#F5F0E8',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
                opacity: 0,
                animation: 'cf-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards',
              }}
            >
              COMPETE.
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.5rem', marginTop: '6px', opacity: 0, animation: 'cf-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
              <span style={{
                fontSize: 'clamp(1.3rem, 2.8vw, 2.3rem)',
                fontWeight: 400,
                color: '#C4A882',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block',
                fontFamily: '"Futura", "Century Gothic", sans-serif',
              }}>
                learn.
              </span>
              <span
                className="cf-win"
                style={{
                  fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                  fontWeight: 900,
                  color: '#F97316',
                  letterSpacing: '-0.04em',
                  cursor: 'default',
                  textShadow: '0 0 40px rgba(249,115,22,0.45)',
                }}
              >
                WIN.
              </span>
            </div>
          </div>

          {/* Body + CTAs */}
          <div style={{ maxWidth: '420px', opacity: 0, animation: 'cf-word-in 0.6s ease 0.45s forwards' }}>
            <p style={{
              color: '#7A6B58',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.75,
              marginBottom: '36px',
              transform: 'rotate(-0.8deg)',
              transformOrigin: 'left center',
              fontFamily: 'inherit',
            }}>
              Trading · Case competitions · Live debates.<br />
              The Ledger network runs challenges that build<br />
              real financial thinking. All at zero cost to members.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="cf-btn-primary">
                Register Now <ArrowRight size={13} />
              </Link>
              <button onClick={handleBrowse} className="cf-btn-ghost" style={{ background: 'none', border: 'none', borderBottom: '1px solid rgba(196,168,130,0.35)', cursor: 'pointer' }}>
                Browse competitions ↓
              </button>
            </div>
          </div>

          {/* Bottom-right active count */}
          <div style={{
            position: 'absolute', right: '48px', bottom: '60px',
            textAlign: 'right', opacity: 0,
            animation: 'cf-word-in 0.5s ease 0.6s forwards',
          }}>
            <div style={{ fontSize: '9px', color: '#3A3028', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Active</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#4ade80', lineHeight: 1, textShadow: '0 0 30px rgba(74,222,128,0.35)' }}>{activeCount}</div>
          </div>

          {/* Decorative large ghost "C" */}
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
            C
          </div>
        </div>

        {/* ── Ticker strip ── */}
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
            animation: 'cf-ticker 22s linear infinite',
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
                TRADING &nbsp;·&nbsp; DEBATE &nbsp;·&nbsp; CASE STUDY &nbsp;·&nbsp; ECONOMICS &nbsp;·&nbsp; GLOBAL &nbsp;·&nbsp; VIRTUAL &nbsp;·&nbsp; $0 ENTRY &nbsp;·&nbsp; SPRING 2026 &nbsp;·&nbsp; STOCKS &amp; CRYPTO &nbsp;·&nbsp; LEVERAGE AVAILABLE &nbsp;·&nbsp; 6+ COUNTRIES &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-center">
            {[`${activeCount} Active Competition${activeCount !== 1 ? 's' : ''}`, '6+ Countries Eligible', '$0 Entry Fee'].map((stat, i) => (
              <span key={i} className="flex items-center gap-4">
                <span style={{ color: '#C4A882', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>{stat}</span>
                {i < 2 && <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: '18px' }}>·</span>}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── WORLD MAP ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', paddingBottom: '0' }}>
        <FadeIn>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 pb-0">
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.55)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '8px' }}>
                [ NETWORK_MAP ]
              </p>
              <h2 style={{ fontFamily: '"Futura","Century Gothic",sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: '#F5F0E8', letterSpacing: '-0.02em' }}>
                Chapters competing globally.
              </h2>
            </div>
            <WorldMap />
          </div>
        </FadeIn>
      </section>

      {/* ── COMPETITION CARDS ─────────────────────────────────────────────── */}
      <section ref={cardsRef} className="relative py-16 pb-28 overflow-hidden" style={{ background: '#0E0C09' }}>
        {/* Spotlight sweep overlay */}
        {spotlit && (
          <div
            className="cf-spotlight absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
            onAnimationEnd={() => setSpotlit(false)}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 38% 100% at 50% 50%, rgba(249,115,22,0.13) 0%, rgba(249,115,22,0.05) 45%, transparent 70%)',
            }} />
          </div>
        )}

        {/* Subtle background lighting for the cards section */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '-80px', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 65%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 space-y-4">
          {competitions.map((comp, i) => {
            const s = statusStyle[comp.status] || statusStyle['Closed']
            return (
              <FadeIn key={comp.name} delay={i * 80} direction="up">
                <div
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="grid md:grid-cols-[260px_1fr]">
                    {/* Left panel — darker glass */}
                    <div
                      className="p-8 flex flex-col justify-between gap-6"
                      style={{
                        background: 'rgba(249,115,22,0.04)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div>
                        <h2 className="text-xl font-black leading-snug mb-3" style={{ color: '#F5F0E8', fontFamily: '"Futura","Century Gothic",sans-serif' }}>{comp.name}</h2>
                        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B5E50', marginBottom: '16px', fontFamily: 'monospace' }}>{comp.organizer}</p>
                        <div className="flex flex-col gap-2">
                          <span style={{ display: 'inline-flex', fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', width: 'fit-content', color: '#C4A882', background: 'rgba(196,168,130,0.08)', border: '1px solid rgba(196,168,130,0.18)', letterSpacing: '0.06em' }}>{comp.region}</span>
                          <span style={{ display: 'inline-flex', fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', width: 'fit-content', color: s.color, background: s.bg, border: s.border, letterSpacing: '0.06em' }}>{s.label}</span>
                        </div>
                      </div>
                      <div style={{ borderRadius: '10px', padding: '12px 14px', fontSize: '11px', fontWeight: 300, lineHeight: 1.6, color: '#C4A882', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {comp.deadline}
                      </div>
                    </div>

                    {/* Right panel — lighter glass */}
                    <div className="p-8 md:p-10 flex flex-col justify-between gap-6">
                      <p style={{ fontWeight: 300, fontSize: '16px', lineHeight: 1.75, color: '#9A8B7A' }}>{comp.description}</p>
                      <div className="space-y-2">
                        <div style={{ borderRadius: '12px', padding: '14px 18px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A3F35', marginBottom: '6px', fontFamily: 'monospace' }}>Prize / Reward</p>
                          <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.6, color: '#7A6B58' }}>{comp.prize}</p>
                        </div>
                        <div style={{ borderRadius: '12px', padding: '14px 18px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A3F35', marginBottom: '6px', fontFamily: 'monospace' }}>Eligibility</p>
                          <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.6, color: '#7A6B58' }}>{comp.eligibility}</p>
                        </div>
                      </div>
                      {comp.status === 'Open' ? (
                        <a
                          href="https://app.theledger.online"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cf-btn-primary"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          Register <ArrowRight size={13} />
                        </a>
                      ) : (
                        <span
                          className="cf-coming-soon"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 22px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: '"Futura","Century Gothic",sans-serif',
                            color: 'rgba(196,168,130,0.45)',
                            background: 'rgba(249,115,22,0.03)',
                            border: '1px solid rgba(249,115,22,0.18)',
                            borderRadius: '2px',
                            cursor: 'not-allowed',
                            textDecoration: 'line-through',
                            textDecorationColor: 'rgba(249,115,22,0.2)',
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p style={{ color: '#C4A882', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'monospace' }}>[ GOT_AN_IDEA ]</p>
            <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '16px', lineHeight: 1.1, fontFamily: '"Futura","Century Gothic",sans-serif' }}>
              Have a competition idea?
            </h2>
            <p style={{ color: '#6B5E50', fontSize: '17px', fontWeight: 300, marginBottom: '36px', maxWidth: '480px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              We're always looking for new challenges. If you have a format, topic, or partnership in mind — tell us about it.
            </p>
            <a
              href="mailto:theledger.japan@gmail.com?subject=Competition%20Idea%20for%20The%20Ledger"
              className="cf-btn-primary"
            >
              Get in Touch <ArrowRight size={13} />
            </a>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
