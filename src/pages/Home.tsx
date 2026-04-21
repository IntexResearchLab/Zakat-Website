import DonationSection from '../components/Home/DonationSection'
import HeroCarousel from '../components/Home/HeroCarousel'
import ImpactSection from '../components/Home/ImpactSection'
import MissionSection from '../components/Home/MissionSection'
import ProgramsSection from '../components/Home/ProgramsSection'
import SupportOptionsSection from '../components/Home/SupportOptionsSection'
import VoiceOfChangeSection from '../components/Home/VoiceOfChangeSection'

function Home() {
  return (
    <>
      <HeroCarousel />
      <ImpactSection />
      <MissionSection />
      <ProgramsSection />
      <DonationSection />
      <SupportOptionsSection />
      <VoiceOfChangeSection />
    </>
  )
}

export default Home
