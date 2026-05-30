import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AppPage from './pages/AppPage'
import Chapters from './pages/Chapters'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Navigate to="/home" replace />} />
        <Route path="/home"        element={<Home />} />
        <Route path="/app"         element={<AppPage />} />
        <Route path="/chapters"    element={<Chapters />} />
        <Route path="/register"    element={<Register />} />
        {/* Legacy redirects */}
        <Route path="/download"    element={<Navigate to="/app" replace />} />
        <Route path="/ledger-app"  element={<Navigate to="/app" replace />} />
        <Route path="/ledger-app-1" element={<Navigate to="/app" replace />} />
        <Route path="*"            element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
