import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppDemo from './pages/AppDemo'
import { DesktopAuthProvider, useDesktopAuth } from './contexts/DesktopAuth'
import DesktopLogin from './components/desktop/DesktopLogin'

class ErrorBoundary extends Component<{children: React.ReactNode},{error: Error|null}> {
  constructor(p: { children: React.ReactNode }) { super(p); this.state = { error: null } }
  static getDerivedStateFromError(e: Error) { return { error: e } }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 24, fontFamily: 'monospace', background: '#fee2e2', color: '#991b1b', borderRadius: 12, margin: 16 }}>
        <strong>Runtime error:</strong><br/>{this.state.error.message}<br/><br/>
        <pre style={{ fontSize: 11, overflow: 'auto' }}>{this.state.error.stack}</pre>
      </div>
    )
    return this.props.children
  }
}

function AuthGate() {
  const { user, isLoading } = useDesktopAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f7f9fb', fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <p style={{ color: '#75777f', fontSize: 14 }}>Loading…</p>
      </div>
    )
  }

  if (!user) return <DesktopLogin />

  return <AppDemo />
}

createRoot(document.getElementById('app-root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <DesktopAuthProvider>
        <AuthGate />
      </DesktopAuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
