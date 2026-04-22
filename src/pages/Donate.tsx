import DonateCta from '../components/Donate/DonateCta'
import DonateDonorTrust from '../components/Donate/DonateDonorTrust'
import DonateHero from '../components/Donate/DonateHero'
import DonateImageStrip from '../components/Donate/DonateImageStrip'
import DonateMainSection from '../components/Donate/DonateMainSection'
import DonateMethods from '../components/Donate/DonateMethods'
import DonatePrograms from '../components/Donate/DonatePrograms'
import DonateStories from '../components/Donate/DonateStories'
import DonateTrustBlock from '../components/Donate/DonateTrustBlock'
import DonateTransparency from '../components/Donate/DonateTransparency'

function Donate() {
  return (
    <>
      <DonateHero />
      <DonateMainSection />
      <DonateTransparency />
      <DonatePrograms />
      <DonateStories />
      <DonateDonorTrust />
      <DonateImageStrip />
      <DonateMethods />
      <DonateTrustBlock />
      <DonateCta />
    </>
  )
}

export default Donate
