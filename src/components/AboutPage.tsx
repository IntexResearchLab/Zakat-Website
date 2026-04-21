import { useEffect, useMemo, useState } from 'react'
import Reveal from './Reveal'

const impactStats = [
  { value: '2011', label: 'Established' },
  { value: '100+', label: 'Students Supported' },
  { value: '100+', label: 'Families Assisted' },
  { value: '6+', label: 'Programs Running' },
]

const programs = [
  {
    icon: 'school',
    title: 'Education Support',
    description: 'Scholarships, school supplies, and free education programs.',
  },
  {
    icon: 'medical_services',
    title: 'Medical Assistance',
    description: 'Financial aid for treatment and emergency care.',
  },
  {
    icon: 'family_restroom',
    title: 'Widow & Family Support',
    description: 'Financial help and livelihood opportunities.',
  },
  {
    icon: 'volunteer_activism',
    title: 'Food & Relief',
    description: 'Emergency aid during crises and disasters.',
  },
  {
    icon: 'content_cut',
    title: 'Livelihood Programs',
    description: 'Sewing machines, livestock, and small business support.',
  },
  {
    icon: 'ac_unit',
    title: 'Seasonal Support',
    description: 'Winter clothing and essential supplies.',
  },
]

const timeline = [
  {
    year: '2011',
    title: 'Started as a small initiative',
  },
  {
    year: '2019',
    title: 'Officially registered as Alokayon',
  },
  {
    year: 'Today',
    title: 'Supporting communities across Bangladesh',
  },
]

const testimonials = [
  {
    quote:
      'Alokayon supported my family during difficult times — from education to medical help. Their support changed our lives.',
    author: 'Former student & beneficiary',
  },
  {
    quote:
      'This organization ensures transparency and truly helps those in need without bias.',
    author: 'Supporter & donor',
  },
]

const trustPoints = [
  'Transparent donation process',
  'Direct support to beneficiaries',
  'No external funding dependency',
  'Community-driven initiatives',
]

const committeeImages = [
  '/assets/about/person-1.jpg',
  '/assets/about/person-2.jpg',
  '/assets/about/person-3.jpg',
  '/assets/about/person-4.jpg',
]

const committeeMembers = Array.from({ length: 14 }, (_, index) => ({
  name: `Executive Member ${String(index + 1).padStart(2, '0')}`,
  role:
    index === 0
      ? 'Committee Chair'
      : index === 1
        ? 'Executive Advisor'
        : 'Executive Committee',
  image: committeeImages[index % committeeImages.length],
}))

const purposeSections = [
  {
    eyebrow: 'Our Mission',
    title: 'To serve vulnerable people through compassionate, direct support.',
    text:
      'Alokayon exists to stand beside hard-core poor communities through zakat- and donation-funded support in education, healthcare, widow and elderly care, disability assistance, and dignified relief.',
    bullets: [
      'Education support for underprivileged and meritorious students',
      'Healthcare and urgent financial assistance',
      'Support for widows, elderly people, and persons with disabilities',
    ],
    image: '/assets/home/volunteers-1.jpg',
    secondaryImage: '/assets/about/Donation.jpg',
    imageAlt: 'Volunteers and community support work',
  },
  {
    eyebrow: 'Our Vision',
    title: 'A more dignified future for families living through hardship.',
    text:
      'The long-term vision is a society where poverty does not force children out of school, widows are not left without support, and vulnerable families can move toward stability with dignity and hope.',
    bullets: [
      'No one left behind in hardship',
      'Education, care, and shelter within reach',
      'A stronger culture of collective responsibility',
    ],
    image: '/assets/about/Donation.jpg',
    secondaryImage: '/assets/home/carousel-1.jpg',
    imageAlt: 'Support being delivered to communities',
  },
  {
    eyebrow: 'Our Objective',
    title: 'To turn limited resources into meaningful, practical impact.',
    text:
      'With support from compassionate donors, Alokayon focuses on direct educational support, slum-school assistance in Dhaka, help for needy elderly people and widows, support for Hifz students, and relief during disasters such as floods, winter hardship, refugee crises, and public-health emergencies.',
    bullets: [
      'Support where the need is immediate and real',
      'Respond within limited means but with consistency',
      'Keep charity rooted in accountability and care',
    ],
    image: '/assets/home/carousel-2.jpg',
    secondaryImage: '/assets/home/carousel-3.jpg',
    imageAlt: 'Aid and long-term support programs',
  },
]

function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [committeeSlide, setCommitteeSlide] = useState(0)
  const [committeeVisibleCount, setCommitteeVisibleCount] = useState(4)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) {
        setCommitteeVisibleCount(4)
        return
      }

      if (window.innerWidth >= 768) {
        setCommitteeVisibleCount(2)
        return
      }

      setCommitteeVisibleCount(1)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)

    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const committeeTotalSlides = Math.ceil(
    committeeMembers.length / committeeVisibleCount
  )
  const currentCommitteeSlide = Math.min(
    committeeSlide,
    Math.max(committeeTotalSlides - 1, 0)
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCommitteeSlide((current) => (current + 1) % committeeTotalSlides)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [committeeTotalSlides])

  const committeeSlides = useMemo(() => {
    return Array.from({ length: committeeTotalSlides }, (_, slideIndex) =>
      committeeMembers.slice(
        slideIndex * committeeVisibleCount,
        slideIndex * committeeVisibleCount + committeeVisibleCount
      )
    )
  }, [committeeTotalSlides, committeeVisibleCount])

  return (
    <div className="bg-[#f7fbfd] text-[#16324f]">
      <section className="border-b border-[#d8e5ec] bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20 lg:py-20">
          <Reveal className="max-w-2xl">
            <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
              [Home / <span className="text-[#c58b16]">About Us</span>]
            </p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
              About Alokayon
            </p>
            <h1 className="mt-5 max-w-[11ch] text-[3rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#101d2b] sm:text-[4.35rem]">
              Serving people with care, trust, and dignity.
            </h1>
            <p className="mt-8 max-w-[30rem] text-[1.03rem] leading-[1.9] text-[#5d6d78] sm:text-[1.06rem]">
              Alokayon is a non-profit, non-political charity in Bangladesh
              working to support underprivileged communities through education,
              healthcare, and compassionate relief.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
                href="#"
              >
                Donate Now
              </a>
              <a
                className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-[#f6fbff] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
                href="#"
              >
                View Programs
              </a>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative">
              <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <img
                  alt="Alokayon donation support"
                  className="aspect-[5/4] w-full object-cover"
                  src="/assets/about/Donation.jpg"
                />
              </div>

              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <img
                  alt="Alokayon logo"
                  className="h-22 w-22 rounded-full border border-white/85 bg-white/96 object-contain p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:h-26 sm:w-26 sm:p-2"
                  src="/assets/about/Logo.png"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#fbfdfe] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                Our Journey
              </p>
              <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
                A quiet beginning, a formal foundation, and a growing commitment
                to service.
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#647783] sm:text-[1.04rem]">
                From a small initiative to a trusted charitable organization.
              </p>
            </div>
          </Reveal>

          <Reveal
            className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_26rem] lg:items-start lg:gap-4"
            delay={100}
          >
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute bottom-3 left-[0.42rem] top-3 w-px bg-[#d5e1e8] sm:left-[0.52rem]" />
              <div className="space-y-10">
                {timeline.map((item) => (
                  <div className="relative" key={item.year}>
                    <div className="absolute left-[-2rem] top-2.5 h-4 w-4 rounded-full border-4 border-[#f7fbfd] bg-[#115b82] shadow-[0_0_0_1px_#d5e1e8] sm:left-[-2.5rem]" />
                    <p className="text-[1.05rem] font-bold tracking-[0.08em] text-[#115b82]">
                      {item.year}
                    </p>
                    <p className="mt-2 font-serif text-[1.6rem] leading-[1.18] tracking-[-0.03em] text-[#14324d] sm:text-[1.78rem]">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-[26rem] rounded-[1rem] border border-[#dce7ee] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:-ml-14 xl:-ml-20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e5ed] bg-[#f8fcfe] px-3 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                    <span className="material-symbols-outlined text-[1rem]">
                      verified
                    </span>
                    Registered NGO (2019)
                  </div>
                  <p className="mt-4 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#14324d]">
                    Official Registration
                  </p>
                  <p className="mt-2 max-w-[22rem] text-[0.92rem] leading-[1.65] text-[#657783]">
                    Formal registration completed in 2019 under the Department
                    of Social Services.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[0.9rem] border border-[#e2ebf1] bg-[linear-gradient(180deg,#f8fbfd_0%,#f4f8fb_100%)] px-3 py-3">
                <div className="mx-auto max-w-[15rem] rotate-[-4deg] overflow-hidden rounded-[0.75rem] border border-[#d9e5ec] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:rotate-0">
                  <img
                    alt="Alokayon registration certificate"
                    className="max-h-[9rem] w-full object-contain"
                    src="/assets/about/Certificate.png"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-18 sm:py-22">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              Our Purpose
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.2rem]">
              Compassion shaped into steady action.
            </h2>
            <div className="mx-auto mt-8 max-w-4xl space-y-5 text-[1.06rem] leading-[1.85] text-[#516573] sm:text-[1.1rem]">
              <p>
                Alokayon was founded on the belief that no one should be left
                behind in hardship.
              </p>
              <p>
                Since 2011, we have supported orphans, widows, and vulnerable
                families through compassion and collective effort, helping them
                build independent,{' '}
                <span className="text-[#8b9aa5]">dignified lives.</span>
              </p>
            </div>
            <a
              className="mt-8 inline-flex items-center gap-3 text-[0.95rem] font-bold uppercase tracking-[0.16em] text-[#115b82] underline decoration-[#b8d0de] decoration-1 underline-offset-[6px] transition hover:gap-4"
              href="#"
            >
              Read Our Story
              <span aria-hidden="true" className="text-xl leading-none">
                →
              </span>
            </a>
          </Reveal>
          <Reveal className="mt-14" delay={100}>
            <div className="mx-auto max-w-5xl border-t border-[#d9e6ee] pt-10">
              <div className="grid gap-y-10 text-left md:grid-cols-2 md:gap-x-12 xl:grid-cols-4 xl:gap-x-16">
                {impactStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-[2.7rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[3.3rem]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[0.9rem] font-semibold tracking-[0.02em] text-[#697b86]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-18 sm:py-22">
        <div className="mx-auto max-w-7xl space-y-18 px-6 sm:space-y-22">
          {purposeSections.map((section, index) => (
            <Reveal
              className={`grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-16 ${
                index % 2 === 1 ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
              }`}
              delay={index * 80}
              key={section.eyebrow}
            >
              <div className="relative">
                <div className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                  <img
                    alt={section.imageAlt}
                    className="aspect-[5/4] w-full object-cover"
                    src={section.image}
                  />
                </div>
                <div className="absolute -bottom-6 right-4 hidden w-[32%] overflow-hidden rounded-[1.35rem] border-[6px] border-white bg-white shadow-[0_16px_36px_rgba(15,23,42,0.12)] sm:block lg:right-6">
                  <img
                    alt=""
                    className="aspect-[4/5] w-full object-cover"
                    src={section.secondaryImage}
                  />
                </div>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                  {section.eyebrow}
                </p>
                <h3 className="mt-4 font-serif text-[2.45rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                  {section.title}
                </h3>
                <p className="mt-6 text-[1rem] leading-[1.85] text-[#5c6f7b] sm:text-[1.04rem]">
                  {section.text}
                </p>

                <div className="mt-7 space-y-4 border-t border-[#dce7ee] pt-6">
                  {section.bullets.map((item) => (
                    <div className="flex items-start gap-3" key={item}>
                      <span className="material-symbols-outlined mt-0.5 text-[1.1rem] text-[#2d8a57]">
                        task_alt
                      </span>
                      <p className="text-[0.98rem] leading-[1.7] text-[#4f6472]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                Alokayon&apos;s Executive Committee
              </p>
              <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                A trusted leadership team guiding Alokayon&apos;s service and
                direction.
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#5d6f7b] sm:text-[1.04rem]">
                Alokayon is supported by a 14-member executive committee that
                helps steer the organization with accountability, continuity,
                and care for the communities it serves.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-[#dce7ee] bg-[#f8fbfd] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
              14-member committee
            </div>
          </Reveal>

          <Reveal className="mt-10" delay={120}>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentCommitteeSlide * 100}%)`,
                }}
              >
                {committeeSlides.map((slide, slideIndex) => (
                  <div
                    className="min-w-full"
                    key={`committee-slide-${slideIndex + 1}`}
                  >
                    <div
                      className={`grid gap-6 ${
                        committeeVisibleCount === 4
                          ? 'xl:grid-cols-4'
                          : committeeVisibleCount === 2
                            ? 'md:grid-cols-2'
                            : 'grid-cols-1'
                      }`}
                    >
                      {slide.map((member) => (
                        <article
                          className="group rounded-[1.25rem] border border-[#dbe7ee] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                          key={member.name}
                        >
                          <div className="overflow-hidden rounded-[1rem] bg-[#f2f7fa]">
                            <img
                              alt={member.name}
                              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                              src={member.image}
                            />
                          </div>
                          <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                            {member.name}
                          </h3>
                          <p className="mt-2 text-[0.92rem] font-medium leading-[1.6] text-[#6a7c87]">
                            {member.role}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.95rem] leading-[1.7] text-[#627581]">
                Browse through the committee members guiding Alokayon&apos;s
                direction and long-term service.
              </p>

              <div className="flex items-center gap-3">
                <button
                  aria-label="Previous committee members"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce7ee] bg-white text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f5fafe]"
                  onClick={() =>
                    setCommitteeSlide((current) =>
                      current === 0 ? committeeTotalSlides - 1 : current - 1
                    )
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[1.15rem]">
                    west
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {committeeSlides.map((_, index) => (
                    <button
                      aria-label={`Show committee slide ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentCommitteeSlide
                          ? 'w-8 bg-[#115b82]'
                          : 'w-2.5 bg-[#d3e1ea] hover:bg-[#b8cddd]'
                      }`}
                      key={`committee-dot-${index + 1}`}
                      onClick={() => setCommitteeSlide(index)}
                      type="button"
                    />
                  ))}
                </div>

                <button
                  aria-label="Next committee members"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce7ee] bg-white text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f5fafe]"
                  onClick={() =>
                    setCommitteeSlide(
                      (current) => (current + 1) % committeeTotalSlides
                    )
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[1.15rem]">
                    east
                  </span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                What We Do
              </p>
              <h2 className="mt-5 font-serif text-[2.65rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.2rem]">
                Practical programs shaped around education, care, and relief.
              </h2>
            </div>
          </Reveal>

          <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
            {programs.map((program) => (
              <article
                className="rounded-[1.2rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                key={program.title}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7fc] text-[#115b82]">
                  <span className="material-symbols-outlined text-[1.55rem]">
                    {program.icon}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-[1.5rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                  {program.title}
                </h3>
                <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#5d6f7b]">
                  {program.description}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              Voices of Impact
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              Real stories behind the work.
            </h2>
          </Reveal>

          <Reveal
            className="mt-10 rounded-[1.3rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8"
            delay={120}
          >
            <p className="font-serif text-[1.35rem] italic leading-[1.65] text-[#26455f] sm:text-[1.55rem]">
              “{testimonials[activeTestimonial].quote}”
            </p>

            <div className="mt-7 flex flex-col gap-4 border-t border-[#e7eef3] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5f7280]">
                {testimonials[activeTestimonial].author}
              </p>

              <div className="flex items-center gap-3">
                {testimonials.map((item, index) => (
                  <button
                    aria-label={`Show testimonial ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeTestimonial
                        ? 'w-8 bg-[#115b82]'
                        : 'w-2.5 bg-[#d3e1ea] hover:bg-[#b8cddd]'
                    }`}
                    key={item.author}
                    onClick={() => setActiveTestimonial(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#14324d] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8fd1f2]">
                How We Work
              </p>
              <h2 className="mt-5 max-w-lg font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-white sm:text-[3.05rem]">
                Trust is built through clarity, discipline, and community care.
              </h2>
            </Reveal>

            <Reveal className="grid gap-4 sm:grid-cols-2" delay={100}>
              {trustPoints.map((point) => (
                <div
                  className="rounded-[1.15rem] border border-white/10 bg-white/6 px-6 py-5 text-[1rem] leading-[1.7] text-white/88"
                  key={point}
                >
                  {point}
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7e3ea] bg-[radial-gradient(circle_at_top,rgba(225,240,248,0.95)_0%,rgba(243,249,252,0.98)_42%,#f9fcfe_100%)] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              Be Part of the Change
            </p>
            <h2 className="mt-5 font-serif text-[2.7rem] leading-[0.93] tracking-[-0.045em] text-[#14324d] sm:text-[3.4rem]">
              Your support helps bring education, relief, and dignity to those
              who need it most.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-[1.8] text-[#647783] sm:text-[1.04rem]">
              Verified through real programs documented in Alokayon&apos;s
              published magazine and community reporting.
            </p>
            <div className="mx-auto mt-8 h-px w-28 bg-[#d9e6ee]" />
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
                href="#"
              >
                Donate Now
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#cfe0ea] bg-white/80 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition hover:border-[#bdd6e4] hover:bg-white"
                href="#"
              >
                Read Magazine
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </a>
            </div>
            <div className="mt-7 flex flex-col items-center justify-center gap-2 text-[0.92rem] leading-[1.7] text-[#647783] sm:flex-row sm:gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[1rem] text-[#2d8a57]">
                  verified
                </span>
                Trusted since 2011
              </span>
              <span className="hidden text-[#aac0cd] sm:inline">•</span>
              <span>Supporting hundreds of families with direct care</span>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
