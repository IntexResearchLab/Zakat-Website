import About from './pages/About'
import AlokayonSchool from './pages/AlokayonSchool'
import Home from './pages/Home'
import Madrasa from './pages/Madrasa'
import OpinionsOfBeneficiaries from './pages/OpinionsOfBeneficiaries'
import OurDonors from './pages/OurDonors'
import Programs from './pages/Programs'
import Footer from './components/reusables/Footer'
import Header from './components/reusables/Header'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <main className="min-h-screen bg-[#eef7fb] text-[#16324f]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/opinions-of-beneficiaries"
          element={<OpinionsOfBeneficiaries />}
        />
        <Route path="/our-donors" element={<OurDonors />} />
        <Route path="/programs/alokayon-school" element={<AlokayonSchool />} />
        <Route path="/programs/madrasa" element={<Madrasa />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default App
