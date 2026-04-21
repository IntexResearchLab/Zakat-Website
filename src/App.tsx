import Header from './components/Header'
import HeroCarousel from './components/HeroCarousel'
import ImpactSection from './components/ImpactSection'
import MissionSection from './components/MissionSection'
import ProgramsSection from './components/ProgramsSection'
import SupportOptionsSection from './components/SupportOptionsSection'
import VoiceOfChangeSection from './components/VoiceOfChangeSection'

function App() {
  return (
    <main className="min-h-screen bg-[#eef7fb] text-[#16324f]">
      <Header />
      <HeroCarousel />
      <ImpactSection />
      <MissionSection />
      <ProgramsSection />
      <SupportOptionsSection />
      <VoiceOfChangeSection />
    </main>
  )
}

export default App
