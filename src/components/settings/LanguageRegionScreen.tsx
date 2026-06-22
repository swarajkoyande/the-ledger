import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Globe, MapPin } from 'lucide-react'
import { useT, O, COUNTRIES, type Country } from '../../pages/AppDemo'

type Lang = { native: string; sub?: string; flag: string }

const LANGUAGES: Lang[] = [
  { native: 'English (US)', flag: '🇺🇸' },
  { native: 'English (UK)', flag: '🇬🇧' },
  { native: 'हिन्दी', sub: 'Hindi', flag: '🇮🇳' },
  { native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { native: '中文', sub: 'Chinese', flag: '🇨🇳' },
  { native: 'Español', sub: 'Spanish', flag: '🇪🇸' },
]

export function LanguageRegionScreen({ country, onSetCountry, onBack }: {
  country: Country
  onSetCountry: (c: Country) => void
  onBack: () => void
}) {
  const { BG, W, MT, ST, GT, CA, ACBG, BR, SH } = useT()
  const [lang, setLang] = useState('English (US)')

  return (
    <div className="min-h-full pb-safe-lg" style={{ background: BG }}>
      <div className="flex items-center gap-3 px-4 py-3 mb-2" style={{ background: W, borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: CA }}>
          <ArrowLeft size={16} style={{ color: ST }}/>
        </button>
        <div>
          <h1 className="text-base font-bold" style={{ color: MT }}>Language &amp; Region</h1>
          <p className="text-[10px]" style={{ color: GT }}>Set your app language and home country</p>
        </div>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0 } }}
        className="px-5"
      >
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: W, boxShadow: SH }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: CA }}>
              <Globe size={16} style={{ color: O }}/>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: GT }}>Region</p>
              <p className="text-sm font-semibold" style={{ color: MT }}>{country.flag} {country.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: CA }}>
              <MapPin size={16} style={{ color: O }}/>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: GT }}>Language</p>
              <p className="text-sm font-semibold" style={{ color: MT }}>{lang}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Region list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
        className="px-5 mt-5"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: GT }}>Region / Home Country</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
          {COUNTRIES.map((c, i) => {
            const active = c.name === country.name
            return (
              <button
                key={c.name}
                onClick={() => onSetCountry(c)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{
                  background: active ? ACBG : 'transparent',
                  borderBottom: i < COUNTRIES.length - 1 ? `1px solid ${BR}` : undefined,
                }}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="flex-1 text-sm font-semibold" style={{ color: MT }}>{c.name}</span>
                {active && <Check size={16} style={{ color: O }}/>}
              </button>
            )
          })}
        </div>
        <p className="text-[11px] px-1 mt-2" style={{ color: GT }}>
          Changing your region updates leaderboards, clubs, and community channels.
        </p>
      </motion.div>

      {/* Language list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="px-5 mt-5"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: GT }}>Language</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
          {LANGUAGES.map((l, i) => {
            const active = l.native === lang
            return (
              <button
                key={l.native}
                onClick={() => setLang(l.native)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{
                  background: active ? ACBG : 'transparent',
                  borderBottom: i < LANGUAGES.length - 1 ? `1px solid ${BR}` : undefined,
                }}
              >
                <span className="text-xl">{l.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: MT }}>{l.native}</p>
                  {l.sub && <p className="text-[11px]" style={{ color: GT }}>{l.sub}</p>}
                </div>
                {active && <Check size={16} style={{ color: O }}/>}
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
