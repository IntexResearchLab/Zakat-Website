import AdminRouteGuard from './components/Admin/AdminRouteGuard'
import Home from './pages/Home'
import Footer from './components/reusables/Footer'
import Header from './components/reusables/Header'
import PageTitle from './components/reusables/PageTitle'
import ScrollToTop from './components/reusables/ScrollToTop'
import { PublicStatsProvider } from './lib/publicStats'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

// Each page downloads when it is first opened. Home stays in the main bundle so the
// landing page renders without waiting for a second request.
const About = lazy(() => import('./pages/About'))
const AdminAuth = lazy(() => import('./pages/AdminAuth'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminDonations = lazy(() => import('./pages/AdminDonations'))
const AdminExecutives = lazy(() => import('./pages/AdminExecutives'))
const AdminGallery = lazy(() => import('./pages/AdminGallery'))
const AdminMagazines = lazy(() => import('./pages/AdminMagazines'))
const AdminResetPassword = lazy(() => import('./pages/AdminResetPassword'))
const AdminStats = lazy(() => import('./pages/AdminStats'))
const AlokayonSchool = lazy(() => import('./pages/AlokayonSchool'))
const Donate = lazy(() => import('./pages/Donate'))
const DonationResult = lazy(() => import('./pages/DonationResult'))
const Gallery = lazy(() => import('./pages/Gallery'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const Madrasa = lazy(() => import('./pages/Madrasa'))
const OpinionsOfBeneficiaries = lazy(() => import('./pages/OpinionsOfBeneficiaries'))
const OurDonors = lazy(() => import('./pages/OurDonors'))
const Programs = lazy(() => import('./pages/Programs'))
const Transparency = lazy(() => import('./pages/Transparency'))
const TransparencyReader = lazy(() => import('./pages/TransparencyReader'))

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <PublicStatsProvider>
      <main
        className={`min-h-screen ${isAdminRoute ? 'bg-[#f4f8fb] text-[#16324f]' : 'bg-[#eef7fb] text-[#16324f]'}`}
      >
        {!isAdminRoute ? <Header /> : null}
        <PageTitle />
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRouteGuard mode="guest">
                  <AdminAuth />
                </AdminRouteGuard>
              }
            />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRouteGuard mode="protected">
                  <AdminDashboard />
                </AdminRouteGuard>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <AdminRouteGuard mode="protected">
                  <AdminDonations />
                </AdminRouteGuard>
              }
            />
            <Route
              path="/admin/magazines"
              element={
                <AdminRouteGuard mode="protected">
                  <AdminMagazines />
                </AdminRouteGuard>
              }
            />
            <Route
              path="/admin/executives"
              element={
                <AdminRouteGuard mode="protected">
                  <AdminExecutives />
                </AdminRouteGuard>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <AdminRouteGuard mode="protected">
                  <AdminGallery />
                </AdminRouteGuard>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <AdminRouteGuard mode="protected">
                  <AdminStats />
                </AdminRouteGuard>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/donate/success" element={<DonationResult status="success" />} />
            <Route path="/donate/failed" element={<DonationResult status="failed" />} />
            <Route path="/donate/cancelled" element={<DonationResult status="cancelled" />} />
            <Route path="/donate/receipt" element={<DonationResult status="receipt" />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/opinions-of-beneficiaries" element={<OpinionsOfBeneficiaries />} />
            <Route path="/our-donors" element={<OurDonors />} />
            <Route path="/programs/alokayon-school" element={<AlokayonSchool />} />
            <Route path="/programs/madrasa" element={<Madrasa />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/terms-and-conditions" element={<LegalPage policy="terms" />} />
            <Route path="/privacy-policy" element={<LegalPage policy="privacy" />} />
            <Route path="/refund-policy" element={<LegalPage policy="refund" />} />
            <Route path="/transparency/:year" element={<TransparencyReader />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Suspense>
        {!isAdminRoute ? <Footer /> : null}
      </main>
    </PublicStatsProvider>
  )
}

export default App
