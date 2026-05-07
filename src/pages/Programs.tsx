import FeaturedProgram from '../components/Programs/FeaturedProgram'
import FeaturedMadrasa from '../components/Programs/FeaturedMadrasa'
import ProgramsCaseStudy from '../components/Programs/ProgramsCaseStudy'
import ProgramCategories from '../components/Programs/ProgramCategories'
import ProgramsCta from '../components/Programs/ProgramsCta'
import ProgramsGallery from '../components/Programs/ProgramsGallery'
import ProgramsHero from '../components/Programs/ProgramsHero'
import ProgramsImpact from '../components/Programs/ProgramsImpact'
import ProgramsInitiatives from '../components/Programs/ProgramsInitiatives'
import ProgramsStories from '../components/Programs/ProgramsStories'

function Programs() {
  return (
    <>
      <ProgramsHero />
      <ProgramCategories />
      <FeaturedProgram />
      <FeaturedMadrasa />
      <ProgramsCaseStudy />
      <ProgramsGallery />
      <ProgramsInitiatives />
      <ProgramsImpact />
      <ProgramsStories />
      <ProgramsCta />
    </>
  )
}

export default Programs
