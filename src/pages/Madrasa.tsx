import MadrasaCta from '../components/Madrasa/MadrasaCta'
import MadrasaFeatures from '../components/Madrasa/MadrasaFeatures'
import MadrasaGallery from '../components/Madrasa/MadrasaGallery'
import MadrasaHero from '../components/Madrasa/MadrasaHero'
import MadrasaHifz from '../components/Madrasa/MadrasaHifz'
import MadrasaImpactStrip from '../components/Madrasa/MadrasaImpactStrip'
import MadrasaLeadership from '../components/Madrasa/MadrasaLeadership'
import MadrasaPathway from '../components/Madrasa/MadrasaPathway'
import MadrasaSupport from '../components/Madrasa/MadrasaSupport'
import MadrasaTrust from '../components/Madrasa/MadrasaTrust'
import MadrasaVision from '../components/Madrasa/MadrasaVision'

function Madrasa() {
  return (
    <>
      <MadrasaHero />
      <MadrasaImpactStrip />
      <MadrasaVision />
      <MadrasaLeadership />
      <MadrasaFeatures />
      <MadrasaPathway />
      <MadrasaSupport />
      <MadrasaHifz />
      <MadrasaGallery />
      <MadrasaTrust />
      <MadrasaCta />
    </>
  )
}

export default Madrasa
