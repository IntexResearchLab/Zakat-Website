import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (hash) {
      // Pages load on demand, so a section linked from another page may not exist yet:
      // keep looking for it briefly before giving up.
      let frame = 0
      const startedAt = performance.now()
      const scrollToTarget = () => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        } else if (performance.now() - startedAt < 3000) {
          frame = window.requestAnimationFrame(scrollToTarget)
        }
      }
      frame = window.requestAnimationFrame(scrollToTarget)
      return () => window.cancelAnimationFrame(frame)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash, pathname])

  return null
}

export default ScrollToTop
