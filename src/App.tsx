import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Home                  = lazy(() => import('./pages/Home'))
const AppPage               = lazy(() => import('./pages/AppPage'))
const Chapters              = lazy(() => import('./pages/Chapters'))
const Register              = lazy(() => import('./pages/Register'))
const Events                = lazy(() => import('./pages/Events'))
const Competitions          = lazy(() => import('./pages/Competitions'))
const CompetitionsAvant     = lazy(() => import('./pages/CompetitionsAvant'))
const CompetitionsFuturistic = lazy(() => import('./pages/CompetitionsFuturistic'))
const CompetitionsMotion    = lazy(() => import('./pages/CompetitionsMotion'))
const CompetitionsMinimal   = lazy(() => import('./pages/CompetitionsMinimal'))
const CompetitionsFinal     = lazy(() => import('./pages/CompetitionsFinal'))
const WorkshopRegister      = lazy(() => import('./pages/WorkshopRegister'))

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/home"        element={<Navigate to="/" replace />} />
          <Route path="/app"         element={<AppPage />} />
          <Route path="/chapters"    element={<Chapters />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/events"      element={<Events />} />
          <Route path="/competitions"            element={<Competitions />} />
          <Route path="/competitions-avant"      element={<CompetitionsAvant />} />
          <Route path="/competitions-futuristic" element={<CompetitionsFuturistic />} />
          <Route path="/competitions-motion"     element={<CompetitionsMotion />} />
          <Route path="/competitions-minimal"    element={<CompetitionsMinimal />} />
          <Route path="/competitions-final"      element={<CompetitionsFinal />} />
          <Route path="/workshop-register"       element={<WorkshopRegister />} />
          {/* Legacy redirects — kept for SEO continuity */}
          <Route path="/download"    element={<Navigate to="/app" replace />} />
          <Route path="/ledger-app"  element={<Navigate to="/app" replace />} />
          <Route path="/ledger-app-1" element={<Navigate to="/app" replace />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}
