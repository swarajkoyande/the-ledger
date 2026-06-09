import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AppPage from './pages/AppPage'
import Chapters from './pages/Chapters'
import Register from './pages/Register'
import Events from './pages/Events'
import Competitions from './pages/Competitions'
import CompetitionsAvant from './pages/CompetitionsAvant'
import CompetitionsFuturistic from './pages/CompetitionsFuturistic'
import CompetitionsMotion from './pages/CompetitionsMotion'
import CompetitionsMinimal from './pages/CompetitionsMinimal'
import CompetitionsFinal from './pages/CompetitionsFinal'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/home"        element={<Navigate to="/" replace />} />
        <Route path="/app"         element={<AppPage />} />
        <Route path="/chapters"    element={<Chapters />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/events"      element={<Events />} />
        <Route path="/competitions"           element={<Competitions />} />
        <Route path="/competitions-avant"     element={<CompetitionsAvant />} />
        <Route path="/competitions-futuristic" element={<CompetitionsFuturistic />} />
        <Route path="/competitions-motion"    element={<CompetitionsMotion />} />
        <Route path="/competitions-minimal"   element={<CompetitionsMinimal />} />
        <Route path="/competitions-final"     element={<CompetitionsFinal />} />
        {/* Legacy redirects */}
        <Route path="/download"    element={<Navigate to="/app" replace />} />
        <Route path="/ledger-app"  element={<Navigate to="/app" replace />} />
        <Route path="/ledger-app-1" element={<Navigate to="/app" replace />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
