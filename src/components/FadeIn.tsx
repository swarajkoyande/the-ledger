import { useInView } from '../hooks/useInView'

interface Props {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, direction = 'up', duration = 600, className = '' }: Props) {
  const { ref, inView } = useInView()

  const initialTransform: Record<string, string> = {
    up: 'translateY(28px)',
    left: 'translateX(28px)',
    right: 'translateX(-28px)',
    none: 'none',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : initialTransform[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
