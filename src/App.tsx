import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { Chatbot } from './components/Chatbot'
import { StickyBookingBar } from './components/StickyBookingBar'
import Home from './pages/Home'
import Booking from './pages/Booking'
import AcceptBooking from './pages/AcceptBooking'
import ManageBookings from './pages/ManageBookings'
import CancelBooking from './pages/CancelBooking'
import Shortcuts from './pages/Shortcuts'
import ManageQuote from './pages/ManageQuote'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import RapidSeal from './pages/services/RapidSeal'
import CaulkingSolutions from './pages/services/CaulkingSolutions'
import BalconyLeakDetection from './pages/services/BalconyLeakDetection'
import BathroomShowerWaterproofing from './pages/services/BathroomShowerWaterproofing'
import PlanterBoxWaterproofing from './pages/services/PlanterBoxWaterproofing'
import RoofDeckPodiumWaterproofing from './pages/services/RoofDeckPodiumWaterproofing'
import ExpansionJointSealing from './pages/services/ExpansionJointSealing'
import MaintenancePlans from './pages/services/MaintenancePlans'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function AppShell() {
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Header isScrolled={isScrolled} />
      <main className="pt-20 sm:pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/accept-booking" element={<AcceptBooking />} />
          <Route path="/manage-booking" element={<ManageBookings />} />
          <Route path="/manage-quotes" element={<ManageQuote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cancel-booking" element={<CancelBooking />} />
          <Route path="/quoteid" element={<ManageQuote />} />
          <Route path="/shortcuts" element={<Shortcuts />} />
          <Route path="/services/rapidseal" element={<RapidSeal />} />
          <Route path="/services/caulking-solutions" element={<CaulkingSolutions />} />
          <Route path="/services/balcony-leak-detection" element={<BalconyLeakDetection />} />
          <Route path="/services/bathroom-shower-waterproofing" element={<BathroomShowerWaterproofing />} />
          <Route path="/services/planter-box-waterproofing" element={<PlanterBoxWaterproofing />} />
          <Route path="/services/roof-deck-podium-waterproofing" element={<RoofDeckPodiumWaterproofing />} />
          <Route path="/services/expansion-joint-sealing" element={<ExpansionJointSealing />} />
          <Route path="/services/maintenance-plans" element={<MaintenancePlans />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
      <StickyBookingBar />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  )
}
