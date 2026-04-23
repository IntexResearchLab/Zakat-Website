import GalleryCta from '../components/Gallery/GalleryCta'
import GalleryFeaturedStories from '../components/Gallery/GalleryFeaturedStories'
import GalleryGrid from '../components/Gallery/GalleryGrid'
import GalleryHero from '../components/Gallery/GalleryHero'
import GalleryImpactStrip from '../components/Gallery/GalleryImpactStrip'

function Gallery() {
  return (
    <>
      <GalleryHero />
      <GalleryGrid />
      <GalleryFeaturedStories />
      <GalleryImpactStrip />
      <GalleryCta />
    </>
  )
}

export default Gallery
