import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  count?: number
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 animate-pulse" style={{ background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <div className="flex items-start gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: '#eceef0' }} />
        <div className="flex-1">
          <div className="h-3.5 rounded mb-1.5" style={{ background: '#eceef0', width: '70%' }} />
          <div className="h-2.5 rounded" style={{ background: '#eceef0', width: '40%' }} />
        </div>
        <div className="w-16 h-5 rounded-full" style={{ background: '#eceef0' }} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-20 rounded" style={{ background: '#eceef0' }} />
        <div className="h-4 w-16 rounded" style={{ background: '#eceef0' }} />
      </div>
      <div className="h-3 w-32 rounded mb-3" style={{ background: '#eceef0' }} />
      <div className="h-9 rounded-xl" style={{ background: '#eceef0' }} />
    </div>
  )
}

interface WrapperProps {
  isLoading: boolean
  children: React.ReactNode
  count?: number
}

export function SkeletonLoader({ count = 4 }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonFade({ isLoading, children, count = 4 }: WrapperProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SkeletonLoader count={count} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
