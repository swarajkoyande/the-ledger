import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppDemoDesktop from './pages/AppDemoDesktop'
import { DesktopAuthProvider, useDesktopAuth } from './contexts/DesktopAuth'
import DesktopLogin from './components/desktop/DesktopLogin'

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message + '\n' + e.stack } }
  render() {
    if (this.state.error) return <pre style={{ color: 'red', padding: 20, whiteSpace: 'pre-wrap' }}>{this.state.error}</pre>
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

  return <AppDemoDesktop />
}

createRoot(document.getElementById('desktop-root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <DesktopAuthProvider>
        <AuthGate />
      </DesktopAuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
