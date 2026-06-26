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
const WorkshopRegister      = lazy(() => import('./pages/WorkshopRegister'))
const NotFound              = lazy(() => import('./pages/NotFound'))

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
          <Route path="/workshop-register"       element={<WorkshopRegister />} />
          {/* Legacy redirects — kept for SEO continuity */}
          <Route path="/download"    element={<Navigate to="/app" replace />} />
          <Route path="/ledger-app"  element={<Navigate to="/app" replace />} />
          <Route path="/ledger-app-1" element={<Navigate to="/app" replace />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}
