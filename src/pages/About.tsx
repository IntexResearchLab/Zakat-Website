import AboutCta from '../components/About/AboutCta'
import AboutExecutiveCommittee from '../components/About/AboutExecutiveCommittee'
import AboutHero from '../components/About/AboutHero'
import AboutJourney from '../components/About/AboutJourney'
import AboutPurpose from '../components/About/AboutPurpose'
import AboutPurposeSections from '../components/About/AboutPurposeSections'
import ProgramsSection from '../components/Home/ProgramsSection'
import ImpactSection from '../components/Home/ImpactSection'

function About() {
  return (
    <>
      <AboutHero />
      <AboutJourney />
      <AboutPurpose />
      <ImpactSection />
      <AboutPurposeSections />
      <AboutExecutiveCommittee />
      <ProgramsSection />
      <AboutCta />
    </>
  )
}

export default About
