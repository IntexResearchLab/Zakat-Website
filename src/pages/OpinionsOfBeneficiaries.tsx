import OpinionsCta from '../components/Opinions/OpinionsCta'
import OpinionsFeaturedStory from '../components/Opinions/OpinionsFeaturedStory'
import OpinionsHero from '../components/Opinions/OpinionsHero'
import OpinionsImpactSummary from '../components/Opinions/OpinionsImpactSummary'
import OpinionsQuoteHighlight from '../components/Opinions/OpinionsQuoteHighlight'
import OpinionsTestimonialGrid from '../components/Opinions/OpinionsTestimonialGrid'
import OpinionsThemes from '../components/Opinions/OpinionsThemes'

function OpinionsOfBeneficiaries() {
  return (
    <>
      <OpinionsHero />
      <OpinionsFeaturedStory />
      <OpinionsTestimonialGrid />
      <OpinionsThemes />
      <OpinionsQuoteHighlight />
      <OpinionsImpactSummary />
      <OpinionsCta />
    </>
  )
}

export default OpinionsOfBeneficiaries
