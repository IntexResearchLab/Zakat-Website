import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`reveal-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default Reveal
