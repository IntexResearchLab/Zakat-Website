import AdminRouteGuard from './components/Admin/AdminRouteGuard'
import Home from './pages/Home'
import Footer from './components/reusables/Footer'
import Header from './components/reusables/Header'
import PageTitle from './components/reusables/PageTitle'
import ScrollToTop from './components/reusables/ScrollToTop'
import { PublicStatsProvider } from './lib/publicStats'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'

// Each page downloads when it is first opened. Home stays in the main bundle so the
// landing page renders without waiting for a second request.
const About = lazy(() => import('./pages/About'))
const AdminAuth = lazy(() => import('./pages/AdminAuth'))
const AdminCampaigns = lazy(() => import('./pages/AdminCampaigns'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminDonations = lazy(() => import('./pages/AdminDonations'))
const AdminExecutives = lazy(() => import('./pages/AdminExecutives'))
const AdminGallery = lazy(() => import('./pages/AdminGallery'))
const AdminMagazines = lazy(() => import('./pages/AdminMagazines'))
const AdminMessages = lazy(() => import('./pages/AdminMessages'))
const AdminResetPassword = lazy(() => import('./pages/AdminResetPassword'))
const AdminStats = lazy(() => import('./pages/AdminStats'))
const AlokayonSchool = lazy(() => import('./pages/AlokayonSchool'))
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Campaigns = lazy(() => import('./pages/Campaigns'))
const Donate = lazy(() => import('./pages/Donate'))
const DonationResult = lazy(() => import('./pages/DonationResult'))
const Gallery = lazy(() => import('./pages/Gallery'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const Madrasa = lazy(() => import('./pages/Madrasa'))
const NotFound = lazy(() => import('./pages/NotFound'))
const OpinionsOfBeneficiaries = lazy(() => import('./pages/OpinionsOfBeneficiaries'))
const OurDonors = lazy(() => import('./pages/OurDonors'))
const Programs = lazy(() => import('./pages/Programs'))
const Transparency = lazy(() => import('./pages/Transparency'))
const TransparencyReader = lazy(() => import('./pages/TransparencyReader'))
const ZakatCalculator = lazy(() => import('./pages/ZakatCalculator'))

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const PageContent = isAdminRoute ? 'div' : 'main'
  const { t } = useTranslation()

  return (
    <PublicStatsProvider>
      <div
        className={`min-h-screen ${isAdminRoute ? 'bg-[#f4f8fb] text-[#16324f]' : 'bg-[#eef7fb] text-[#16324f]'}`}
      >
        {!isAdminRoute ? (
          <a
            className="sr-only z-50 rounded-full bg-[#115b82] text-sm font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-5 focus:py-3"
            href="#main-content"
          >
            {t('common.aria.skipToContent')}
          </a>
        ) : null}
        {!isAdminRoute ? <Header /> : null}
        <PageTitle />
        <ScrollToTop />
        {/* Admin pages render their own <main> inside the dashboard layout. */}
        <PageContent id="main-content" tabIndex={-1}>
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
                path="/admin/campaigns"
                element={
                  <AdminRouteGuard mode="protected">
                    <AdminCampaigns />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminRouteGuard mode="protected">
                    <AdminMessages />
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
              <Route path="/zakat-calculator" element={<ZakatCalculator />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:slug" element={<CampaignDetail />} />
            <Route path="/contact" element={<Contact />} />
              <Route path="/terms-and-conditions" element={<LegalPage policy="terms" />} />
              <Route path="/privacy-policy" element={<LegalPage policy="privacy" />} />
              <Route path="/refund-policy" element={<LegalPage policy="refund" />} />
              <Route path="/transparency/:year" element={<TransparencyReader />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageContent>
        {!isAdminRoute ? <Footer /> : null}
      </div>
    </PublicStatsProvider>
  )
}

export default App
