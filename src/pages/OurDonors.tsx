import DonorsCta from '../components/Donors/DonorsCta'
import DonorsFeaturedTestimonials from '../components/Donors/DonorsFeaturedTestimonials'
import DonorsGlobalSupport from '../components/Donors/DonorsGlobalSupport'
import DonorsHero from '../components/Donors/DonorsHero'
import DonorsStories from '../components/Donors/DonorsStories'
import DonorsTrustIndicators from '../components/Donors/DonorsTrustIndicators'
import DonorsWhyTrust from '../components/Donors/DonorsWhyTrust'

function OurDonors() {
  return (
    <>
      <DonorsHero />
      <DonorsTrustIndicators />
      <DonorsFeaturedTestimonials />
      <DonorsGlobalSupport />
      <DonorsStories />
      <DonorsWhyTrust />
      <DonorsCta />
    </>
  )
}

export default OurDonors
