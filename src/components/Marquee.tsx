interface Props {
  items: string[]
  reverse?: boolean
  speed?: string
  className?: string
}

export function MarqueeStrip({ items, reverse = false, speed = '50s', className = '' }: Props) {
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap select-none ${className}`}>
      <div
        className="inline-flex items-center gap-0"
        style={{ animation: `${reverse ? 'marqueeRev' : 'marquee'} ${speed} linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4">
            <span className="text-stone text-xs font-medium tracking-[0.2em] uppercase px-6">
              {item}
            </span>
            <span className="text-orange/60 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
