import ActiveCampaignsSection from '../components/Campaigns/ActiveCampaignsSection'
import DonationSection from '../components/Home/DonationSection'
import FounderMessageSection from '../components/Home/FounderMessageSection'
import HeroCarousel from '../components/Home/HeroCarousel'
import ImpactSection from '../components/Home/ImpactSection'
import MissionSection from '../components/Home/MissionSection'
import ProgramsSection from '../components/Home/ProgramsSection'
import SupportOptionsSection from '../components/Home/SupportOptionsSection'
import VoiceOfChangeSection from '../components/Home/VoiceOfChangeSection'
import LatestUpdatesSection from '../components/Updates/LatestUpdatesSection'

function Home() {
  return (
    <>
      <HeroCarousel />
      <ImpactSection />
      <ActiveCampaignsSection />
      <MissionSection />
      <DonationSection />
      <FounderMessageSection />
      <ProgramsSection />
      {/* News from the programmes above; hidden until a post is published. */}
      <LatestUpdatesSection />
      <SupportOptionsSection />
      <VoiceOfChangeSection />
    </>
  )
}

export default Home
