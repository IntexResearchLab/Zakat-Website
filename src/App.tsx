import About from './pages/About'
import AdminAuth from './pages/AdminAuth'
import AdminDashboard from './pages/AdminDashboard'
import AlokayonSchool from './pages/AlokayonSchool'
import AdminRouteGuard from './components/Admin/AdminRouteGuard'
import Donate from './pages/Donate'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Madrasa from './pages/Madrasa'
import OpinionsOfBeneficiaries from './pages/OpinionsOfBeneficiaries'
import OurDonors from './pages/OurDonors'
import Programs from './pages/Programs'
import Transparency from './pages/Transparency'
import TransparencyReader from './pages/TransparencyReader'
import Footer from './components/reusables/Footer'
import Header from './components/reusables/Header'
import ScrollToTop from './components/reusables/ScrollToTop'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <main className={`min-h-screen ${isAdminRoute ? 'bg-[#f4f8fb] text-[#16324f]' : 'bg-[#eef7fb] text-[#16324f]'}`}>
      {!isAdminRoute ? <Header /> : null}
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRouteGuard mode="guest">
              <AdminAuth />
            </AdminRouteGuard>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteGuard mode="protected">
              <AdminDashboard />
            </AdminRouteGuard>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route
          path="/opinions-of-beneficiaries"
          element={<OpinionsOfBeneficiaries />}
        />
        <Route path="/our-donors" element={<OurDonors />} />
        <Route path="/programs/alokayon-school" element={<AlokayonSchool />} />
        <Route path="/programs/madrasa" element={<Madrasa />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/transparency/:year" element={<TransparencyReader />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      {!isAdminRoute ? <Footer /> : null}
    </main>
  )
}

export default App
