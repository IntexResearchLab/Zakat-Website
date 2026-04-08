import { useState } from 'react'

const impactStats = [
  {
    label: 'Total Taka Collected',
    value: '৳1,020,400',
    icon: 'currency',
    note: 'FY 2024-25 Report',
    featured: true,
  },
  {
    label: 'Total Expenditure',
    value: '৳1,132,388',
    icon: 'heart',
    note: 'Annual Expenditure Summary',
    featured: true,
  },
  {
    label: 'Executive Committee',
    value: '14',
    icon: 'group',
    note: 'Current Annual Publication',
  },
  {
    label: 'Financial Years Covered',
    value: '7',
    icon: 'calendar',
    note: '2018-19 to 2024-25',
  },
]

const carouselImages = [
  { src: '/carousel/slide-01.jpg', title: 'Educational materials reaching children directly', category: 'Education' },
  { src: '/carousel/slide-02.jpg', title: 'Community outreach with direct beneficiary contact', category: 'Community Support' },
  { src: '/carousel/slide-03.jpg', title: 'Relief support organized through local coordination', category: 'Relief' },
  { src: '/carousel/slide-04.jpg', title: 'Children receiving practical support in the field', category: 'Child Support' },
  { src: '/carousel/slide-05.jpg', title: 'School supply distribution for underprivileged learners', category: 'Education' },
  { src: '/carousel/slide-06.jpg', title: 'Learning-focused aid delivered through community programs', category: 'Education' },
  { src: '/carousel/slide-07.jpg', title: 'Seasonal support provided to vulnerable households', category: 'Winter Aid' },
  { src: '/carousel/slide-08.jpg', title: 'Local distribution scene documented for transparency', category: 'Transparent Distribution' },
  { src: '/carousel/slide-09.jpg', title: 'Family-centered support during community outreach', category: 'Family Support' },
  { src: '/carousel/slide-10.jpg', title: 'Street-level service reaching people with immediate need', category: 'Community Support' },
  { src: '/carousel/slide-11.jpg', title: 'Leadership and field presence behind the work', category: 'Governance' },
  { src: '/carousel/slide-12.jpg', title: 'Livelihood-oriented support captured in the annual report', category: 'Livelihood' },
  { src: '/carousel/slide-13.jpg', title: 'Documented distribution activity from the published report', category: 'Published Impact' },
]

const programCards = [
  {
    title: 'Support for Elderly & Widows',
    description: 'Direct assistance for elderly people and widowed households facing financial hardship.',
    tag: 'Financial Support',
    image: '/carousel/slide-04.jpg',
  },
  {
    title: 'Medical Assistance',
    description: 'Helping vulnerable families access urgent treatment and basic healthcare support.',
    tag: 'Medical',
    image: '/carousel/slide-10.jpg',
  },
  {
    title: 'Educational Support',
    description: 'Providing learning materials and direct support for underprivileged children.',
    tag: 'Education',
    image: '/carousel/slide-01.jpg',
  },
  {
    title: 'School for Underprivileged Children',
    description: 'Creating access to structured learning environments for underserved students.',
    tag: 'Education',
    image: '/carousel/slide-07.jpg',
  },
  {
    title: 'Support for Disabled People',
    description: 'Extending practical care and financial help to people living with disabilities.',
    tag: 'Community Aid',
    image: '/carousel/slide-08.jpg',
  },
  {
    title: 'Young Widow Livelihood Program',
    description: 'Supporting widows through small livelihood-focused initiatives and guided aid.',
    tag: 'Livelihood',
    image: '/carousel/slide-09.jpg',
  },
  {
    title: 'Goat Distribution Program',
    description: 'Livelihood-oriented animal support for families working toward self-reliance.',
    tag: 'Livelihood',
    image: '/carousel/slide-12.jpg',
  },
  {
    title: 'Livelihood Support',
    description: 'Targeted interventions that help families regain stability and earning capacity.',
    tag: 'Community Aid',
    image: '/carousel/slide-11.jpg',
  },
  {
    title: 'Community Relief Distribution',
    description: 'Organized relief delivery for local communities during moments of urgent need.',
    tag: 'Community Aid',
    image: '/carousel/slide-03.jpg',
  },
]

const beneficiaryOpinions = [
  {
    tag: 'Education Support',
    quote:
      'Alokayon covered my tuition, exam fees, and books, helping me complete my Honors and Master’s degrees and continue toward the BCS journey with dignity.',
    name: 'Md. Nasim Uddin',
    role: 'Senior Teacher, Alokayon Pathshala-1',
    location: 'Dhaka',
    initials: 'MN',
    featured: true,
  },
  {
    tag: 'Family Assistance',
    quote:
      'Scholarship support, medicine costs, food assistance, and help during family hardship reached us when we needed stability the most.',
    name: 'Md. Omar Faruque',
    role: 'Former Student, Dhaka University',
    location: 'Comilla',
    initials: 'OF',
  },
  {
    tag: 'Student Support',
    quote:
      'The financial support for my studies made a difficult academic journey much smoother and strengthened my confidence in the future.',
    name: 'Tumpa',
    role: 'Department of Philosophy, University of Chittagong',
    location: 'Chittagong',
    initials: 'TU',
  },
  {
    tag: 'Winter Relief',
    quote:
      'Winter clothing reached extremely poor families in Kurigram, and seeing relief replace distress on their faces was something I will never forget.',
    name: 'Md. Maruf Hossain',
    role: 'Community Volunteer',
    location: 'Ulipur, Kurigram',
    initials: 'MH',
  },
  {
    tag: 'Higher Education',
    quote:
      'The scholarship eased the pressure on my family and gave me the chance to continue higher education with dignity and hope.',
    name: 'Tahmina Akter',
    role: 'Department of Economics, University of Chittagong',
    location: 'Chittagong',
    initials: 'TA',
  },
  {
    tag: 'University Access',
    quote:
      'As a poor student from Kurigram, I found the courage to continue at Rajshahi University because Alokayon stood beside me at the right time.',
    name: 'Akheruzzaman',
    role: 'Graduate, Rajshahi University',
    location: 'Fulbari, Kurigram',
    initials: 'AK',
  },
]

const frameworkCards = [
  {
    step: 'Step 01',
    title: 'Review',
    body: 'We carefully assess each case based on need and urgency.',
    icon: 'review',
  },
  {
    step: 'Step 02',
    title: 'Verify',
    body: 'Funds are assigned and documented transparently.',
    icon: 'verify',
  },
  {
    step: 'Step 03',
    title: 'Deliver',
    body: 'Support is provided respectfully and with dignity.',
    icon: 'deliver',
  },
  {
    step: 'Step 04',
    title: 'Report',
    body: 'We publish updates showing where support went and what it changed.',
    icon: 'report',
  },
]

const footerLinks = ['Terms of Service', 'Privacy Policy', 'Contact Us', 'Verification Badges']
const heroTrustItems = ['Verified & Audited', 'Signed Receipts', 'Transparent Distribution']
const founderMessage = {
  quote:
    'Zakat is a trust. Every contribution you make is delivered with care, transparency, and dignity to those who need it most.',
  name: 'Md. Fazlul Kader',
  title: 'Founder & Chairman',
  image: '/carousel/slide-11.jpg',
}

const zakatAllocation = [
  {
    label: 'Quran & Needy Student Support',
    percentage: 20.2,
    amount: '৳229,081',
    description: 'Published 2024-25 expenditure item in the annual report.',
    color: '#0f6b4f',
    icon: 'education',
  },
  {
    label: 'Widow Small Business Support',
    percentage: 17.7,
    amount: '৳200,142',
    description: 'Direct livelihood support listed in the 2024-25 expenditure table.',
    color: '#2d8a6d',
    icon: 'livelihood',
  },
  {
    label: 'Orphan & Needy Student Support',
    percentage: 15.2,
    amount: '৳172,500',
    description: 'School, college, and university support from the published report.',
    color: '#d08a1f',
    icon: 'education',
  },
  {
    label: 'Alokayon School Expenses',
    percentage: 13.3,
    amount: '৳150,700',
    description: 'Operating support for the school program in 2024-25.',
    color: '#89b9a7',
    icon: 'education',
  },
  {
    label: 'Food Assistance to Needy Families',
    percentage: 9.9,
    amount: '৳112,592',
    description: 'Published family food support expenditure for 2024-25.',
    color: '#d7e6de',
    icon: 'relief',
  },
]

const navLinkClass = 'font-semibold tracking-tight text-[#2f6b55]/70 transition hover:text-[#143126]'
const buttonPrimary = 'inline-flex items-center justify-center rounded-full bg-[#07583f] px-8 py-3 text-sm font-extrabold text-white transition active:scale-95'

function StatIcon({ type }: { type: string }) {
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.8,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (type) {
    case 'currency':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M12 3v18" />
          <path {...stroke} d="M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 3 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3" />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M12 20s-6.5-3.9-8.5-8.2C2.1 8.6 3.6 5.5 7 5.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.4 0 4.9 3.1 3.5 6.3C18.5 16.1 12 20 12 20Z" fill="currentColor" />
        </svg>
      )
    case 'group':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle {...stroke} cx="8.5" cy="8.5" r="2.5" />
          <circle {...stroke} cx="15.8" cy="9.2" r="2.1" />
          <path {...stroke} d="M4.5 17c.8-2.3 2.5-3.8 4.5-3.8S12.7 14.7 13.5 17" />
          <path {...stroke} d="M13.4 16.1c.6-1.6 1.8-2.6 3.3-2.6 1.1 0 2.1.5 2.8 1.6" />
        </svg>
      )
    case 'education':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M3.5 8.5L12 4l8.5 4.5L12 13 3.5 8.5Z" />
          <path {...stroke} d="M7 10.5V15c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" />
        </svg>
      )
    case 'medical':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <rect {...stroke} x="5.5" y="4.5" width="13" height="15" rx="2.5" />
          <path {...stroke} d="M12 8v8M8 12h8" />
        </svg>
      )
    case 'relief':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M5 15.5h14" />
          <path {...stroke} d="M7.5 15.5V11a4.5 4.5 0 0 1 9 0v4.5" />
          <path {...stroke} d="M10 19.5h4" />
        </svg>
      )
    case 'care':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M12 20s-5.5-3.1-7.2-6.8C3.7 10.9 5 8 7.8 8c1.7 0 2.9.9 4.2 2.5C13.3 8.9 14.5 8 16.2 8c2.8 0 4.1 2.9 3 5.2C17.5 16.9 12 20 12 20Z" />
        </svg>
      )
    case 'livelihood':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M6 18.5h12" />
          <path {...stroke} d="M8 18.5v-7l4-2 4 2v7" />
          <path {...stroke} d="M10.5 13.5h3" />
        </svg>
      )
    case 'review':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M8 5.5h8" />
          <path {...stroke} d="M7 8.5h10" />
          <rect {...stroke} x="5.5" y="4.5" width="13" height="15" rx="2.5" />
          <path {...stroke} d="M8.5 13l1.8 1.8 5.2-5.2" />
        </svg>
      )
    case 'verify':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M12 4.5l6 2.5v4.2c0 4.1-2.3 6.7-6 8.3-3.7-1.6-6-4.2-6-8.3V7l6-2.5Z" />
          <path {...stroke} d="M9.3 11.9l1.8 1.8 3.7-4" />
        </svg>
      )
    case 'deliver':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M7 12.5l3 2.5 7-7" />
          <path {...stroke} d="M4.5 12a7.5 7.5 0 0 0 15 0" />
        </svg>
      )
    case 'report':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path {...stroke} d="M6 18.5h12" />
          <path {...stroke} d="M8.5 15.5v-4" />
          <path {...stroke} d="M12 15.5v-7" />
          <path {...stroke} d="M15.5 15.5v-2.5" />
          <rect {...stroke} x="4.5" y="4.5" width="15" height="15" rx="2.5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <rect {...stroke} x="4.5" y="5.5" width="15" height="14" rx="2.5" />
          <path {...stroke} d="M8 3.5v4M16 3.5v4M4.5 9.5h15" />
        </svg>
      )
  }
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((index) => (index + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((index) => (index - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-[#191c1d] antialiased selection:bg-[#b0f0d6] selection:text-[#0b513d]">
      <nav className="sticky top-0 z-50 border-b border-[#e7ebe8] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="text-2xl font-black tracking-tight text-[#143126]">Alokayon</div>
          <div className="hidden items-center gap-10 md:flex">
            <a className={navLinkClass} href="#transparency">Transparency</a>
            <a className={navLinkClass} href="#impact">Impact</a>
            <a className={navLinkClass} href="#about">About</a>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden cursor-pointer text-sm font-semibold tracking-tight text-[#2f6b55]/70 sm:block">EN | বাংলা</span>
            <a className={buttonPrimary} href="#donate">Donate Now</a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[#f7f8f6]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,107,79,0.06),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(199,163,75,0.08),transparent_20%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#0f6b4f_1px,transparent_1px),linear-gradient(to_bottom,#0f6b4f_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-[#d8e3dd] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f6b4f] shadow-sm">
              Trusted Zakat Platform
            </p>

            <h1 className="mt-6 max-w-[720px] text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#163229] sm:text-5xl lg:text-7xl">
              Give your Zakat with clarity, dignity, and visible impact.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#52615a] sm:text-lg">
              Alokayon helps local and international donors support verified causes with transparent distribution, dependable records, and signed charitable receipts.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="inline-flex items-center justify-center rounded-full bg-[#0f6b4f] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,107,79,0.22)] transition hover:bg-[#0c5a43]"
                href="#donate"
              >
                Donate Zakat
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#d6dfda] bg-white px-7 py-3.5 text-sm font-semibold text-[#163229] shadow-sm transition hover:border-[#bccbc3] hover:bg-[#fbfcfb]"
                href="#transparency"
              >
                Calculate Zakat
              </a>
            </div>

            <ul className="mt-8 flex flex-col gap-3 text-sm text-[#44514b] sm:flex-row sm:flex-wrap sm:gap-5">
              {heroTrustItems.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e7f2ed] text-[#0f6b4f]">
                    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M5 10.5L8.2 13.5L15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-[2rem] bg-[#d8eadf] opacity-60 blur-3xl" />
            <div className="absolute right-0 top-8 hidden h-[88%] w-[88%] rounded-[2rem] border border-white/50 bg-white/30 sm:block" />

            <div className="relative rounded-[2rem] border border-[#d7e1dc] bg-white/70 p-3 shadow-[0_30px_80px_rgba(22,50,41,0.10)] backdrop-blur">
              <div className="overflow-hidden rounded-[1.6rem] border border-[#dbe5df] bg-[linear-gradient(145deg,#edf5f0_0%,#dcebdd_45%,#cfe2d6_100%)] p-6 sm:p-8">
                <div className="flex min-h-[340px] flex-col justify-between rounded-[1.3rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),rgba(255,255,255,0.18)_42%,transparent_70%),linear-gradient(180deg,rgba(255,255,255,0.22),rgba(15,107,79,0.08))] p-6 shadow-inner sm:min-h-[420px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-[#d7e4dc] bg-white/80 px-3 py-1 text-xs font-medium text-[#486058]">
                      Impact Image
                    </span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c7a34b]" />
                  </div>

                  <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-sm rounded-[1.5rem] border border-white/70 bg-white/35 p-5 shadow-[0_18px_50px_rgba(15,107,79,0.10)] backdrop-blur-sm">
                      <div className="aspect-[4/5] rounded-[1.2rem] border border-dashed border-[#b8cbbf] bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.18))]">
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-[#0f6b4f] shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                              <path d="M4 16L8.5 11.5L12 15L15.5 11.5L20 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8 8.25C8 7.01 9.01 6 10.25 6C11.49 6 12.5 7.01 12.5 8.25C12.5 9.49 11.49 10.5 10.25 10.5C9.01 10.5 8 9.49 8 8.25Z" stroke="currentColor" strokeWidth="1.7" />
                              <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                            </svg>
                          </div>

                          <p className="text-sm font-semibold text-[#183229]">Field Activity Visual</p>
                          <p className="mt-2 text-sm leading-6 text-[#5c6d66]">
                            Ready for a future beneficiary story, project photo, or documented distribution moment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1rem] border border-white/60 bg-white/45 px-4 py-3 text-sm text-[#486058] backdrop-blur-sm">
                    Image-ready, polished, and intentionally minimal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f4f5] py-28" id="impact">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 grid gap-8 border-b border-[#dde4df] pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#904d00]">Transparency Snapshot</p>
              <h2 className="text-4xl font-black tracking-tight text-[#003527] md:text-5xl">Financial visibility, presented with clarity.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4d5a55]">
                A concise view of Alokayon&apos;s published figures, so donors can understand scale, governance, and reporting coverage at a glance.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 self-start rounded-full border border-[#dce4df] bg-white px-5 py-3 shadow-[0_10px_24px_rgba(20,50,38,0.05)] lg:self-end">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-[#40504a]">Live ledger status updated from annual published records</span>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              {impactStats
                .filter((stat) => stat.featured)
                .map((stat) => (
                  <article
                    className="rounded-[2rem] border border-[#d9e1dc] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_100%)] p-7 shadow-[0_20px_60px_rgba(20,50,38,0.07)] transition hover:-translate-y-1"
                    key={stat.label}
                  >
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d9e6df] bg-[#eef5f1] text-[#003527] shadow-sm">
                        <StatIcon type={stat.icon} />
                      </div>
                      <span className="rounded-full bg-[#f6efe1] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#8a5a17]">
                        Featured
                      </span>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6a7a73]">{stat.label}</p>
                    <h3 className="mt-2 text-4xl font-black tracking-tight text-[#003527] md:text-5xl">{stat.value}</h3>
                    <p className="mt-3 text-sm font-medium text-[#596862]">{stat.note}</p>
                  </article>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto]">
              {impactStats
                .filter((stat) => !stat.featured)
                .map((stat) => (
                  <article
                    className="rounded-[1.75rem] border border-[#dde4df] bg-white p-6 shadow-[0_16px_42px_rgba(20,50,38,0.05)] transition hover:-translate-y-0.5"
                    key={stat.label}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f4f1] text-[#003527]">
                      <StatIcon type={stat.icon} />
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7b74]">{stat.label}</p>
                    <h3 className="mt-2 text-4xl font-black tracking-tight text-[#003527]">{stat.value}</h3>
                    <p className="mt-3 text-sm font-medium text-[#60706a]">{stat.note}</p>
                  </article>
                ))}

              <div className="rounded-[1.75rem] border border-dashed border-[#d6dfda] bg-[#f8faf9] px-5 py-4 text-sm leading-6 text-[#5d6b66] lg:max-w-[280px]">
                Source: Alokayon annual report and financial statement.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-24" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#904d00]">Published impact visuals</p>
              <h2 className="mb-3 text-4xl font-black tracking-tight text-[#003527] md:text-5xl" id="gallery-title">Impact in Action</h2>
              <p className="max-w-2xl text-lg leading-8 text-[#404944]">Real moments from Alokayon&apos;s published reports, showing how support reaches people, families, and communities.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dfdb] bg-white text-xl font-black text-[#003527] shadow-[0_10px_24px_rgba(20,50,38,0.06)] transition hover:-translate-y-0.5 hover:bg-[#eef3f0]"
                type="button"
                onClick={prevSlide}
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dfdb] bg-white text-xl font-black text-[#003527] shadow-[0_10px_24px_rgba(20,50,38,0.06)] transition hover:-translate-y-0.5 hover:bg-[#eef3f0]"
                type="button"
                onClick={nextSlide}
                aria-label="Next image"
              >
                →
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#e5e9e6] bg-white p-4 shadow-[0_18px_50px_rgba(20,50,38,0.06)]">
            <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="relative aspect-video overflow-hidden rounded-[1.75rem] border border-[#dfe7e2] bg-[#edf2ef] shadow-[0_18px_50px_rgba(20,50,38,0.08)]">
                <img className="h-full w-full object-cover object-center" src={carouselImages[currentSlide].src} alt={carouselImages[currentSlide].title} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,35,26,0)_25%,rgba(5,35,26,0.12)_100%)]" />
              </div>
              <div className="grid content-center gap-6 p-3">
                <div className="space-y-4">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#904d00]">Slide {currentSlide + 1} / {carouselImages.length}</p>
                  <div className="inline-flex rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#0f6b4f]">
                    {carouselImages[currentSlide].category}
                  </div>
                  <h3 className="text-3xl font-black leading-tight text-[#003527]">{carouselImages[currentSlide].title}</h3>
                  <p className="text-[15px] leading-7 text-[#4f5d57]">Selected from Alokayon&apos;s annual published reports to show where Zakat and charitable support meet real people and real community needs.</p>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#73827b]">Source: Published annual report photography</p>
                </div>
                <div className="grid grid-cols-4 gap-3 lg:grid-cols-2">
                  {carouselImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:scale-[1.02] ${currentSlide === index ? 'border-[#07583f] ring-2 ring-[#07583f]/20 shadow-[0_14px_30px_rgba(15,107,79,0.12)]' : 'border-[#e5e9e6] hover:border-[#bfd6ca]'}`}
                      aria-label={`Go to image ${index + 1}`}
                    >
                      <img className="aspect-video w-full object-cover object-center" src={image.src} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-28" aria-labelledby="programs-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#904d00]">Programs</p>
            <h2 className="text-4xl font-black tracking-tight text-[#003527] md:text-5xl" id="programs-title">
              Our Programs
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#4f5d57]">
              Supporting communities through targeted initiatives in education, medical care, livelihood assistance, and local relief.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {programCards.map((program) => (
              <article
                className="group overflow-hidden rounded-[1.75rem] border border-[#e4e9e6] bg-white shadow-[0_16px_42px_rgba(20,50,38,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(20,50,38,0.10)]"
                key={program.title}
              >
                <div className="relative overflow-hidden">
                  <img
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    src={program.image}
                    alt={program.title}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),transparent_40%)]" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="inline-flex rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#0f6b4f]">
                    {program.tag}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#23322c]">
                      {program.title}
                    </h3>
                    <p className="text-sm leading-6 text-[#5a6762]">
                      {program.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <a
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#07583f] transition hover:gap-3"
              href="#transparency"
            >
              View All Programs
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="bg-[linear-gradient(to_bottom,#f8faf9,#ffffff)] py-28"
        aria-labelledby="beneficiaries-title"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#9a630d]">Voices of Impact</p>
            <h2 className="text-4xl font-black tracking-tight text-[#003527] md:text-5xl" id="beneficiaries-title">
              Real Stories, Real Impact
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#4f5d57]">
              Stories from people whose education, family stability, and daily dignity were strengthened through Alokayon&apos;s support.
            </p>
          </div>

          <div className="-mx-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
            <div className="flex snap-x gap-6 lg:grid lg:grid-cols-12">
              {beneficiaryOpinions.map((item) => (
                <article
                  className={`group relative min-w-[18rem] snap-start overflow-hidden rounded-[2rem] border p-7 shadow-[0_18px_46px_rgba(20,50,38,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(20,50,38,0.12)] lg:min-w-0 ${
                    item.featured
                      ? 'border-[#d9e6df] bg-[linear-gradient(180deg,#f7fbf8,#eef6f1)] lg:col-span-6'
                      : 'border-[#e6ebe8] bg-white lg:col-span-3'
                  }`}
                  key={item.name}
                >
                  <div className="pointer-events-none absolute right-6 top-5 text-[5rem] font-black leading-none text-[#0f6b4f]/[0.07]">
                    &ldquo;
                  </div>
                  <div className="relative flex h-full flex-col">
                    <div className="mb-5">
                      <div className="inline-flex rounded-full bg-[#eff5f0] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f6b4f]">
                        {item.tag}
                      </div>
                    </div>
                    <blockquote className={`${item.featured ? 'text-xl leading-8' : 'text-base leading-7'} max-w-xl font-medium text-[#23342d]`}>
                      “{item.quote}”
                    </blockquote>
                    <div className="mt-8 border-t border-[#e6ece8] pt-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold ${
                            item.featured
                              ? 'border-[#cfe1d7] bg-[#dcebe3] text-[#0b513d]'
                              : 'border-[#dfe8e3] bg-[#f5f8f6] text-[#1a4a3b]'
                          }`}
                        >
                          {item.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-[#163229]">{item.name}</p>
                          <p className="mt-1 text-sm text-[#61706a]">{item.role}</p>
                          <p className="text-sm text-[#7b8782]">{item.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm text-[#66736d]">
            All testimonials are collected from verified beneficiaries and published beneficiary accounts.
          </p>
        </div>
      </section>

      <section className="bg-[#f7f8f6] py-28" aria-labelledby="appeal-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.5rem] border border-[#e6ebe7] bg-[#fffdf9] shadow-[0_18px_56px_rgba(20,50,38,0.05)]">
            <div className="grid gap-10 px-8 py-10 lg:grid-cols-[0.88fr_1.35fr] lg:px-14 lg:py-16">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#9a630d]">
                    Appeal
                  </p>
                  <h2
                    className="max-w-xs text-4xl font-black leading-[1.02] tracking-tight text-[#003527] md:text-[2.7rem]"
                    id="appeal-title"
                  >
                    Collective giving can change lives.
                  </h2>
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-[#e3ebe6] bg-[linear-gradient(180deg,#f8fbf9,#f2f8f4)] p-6 shadow-[0_10px_24px_rgba(20,50,38,0.03)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f6b4f]">
                    Why it matters
                  </p>
                  <p className="mt-3 text-base leading-7 text-[#56635e]">
                    Your zakat becomes education, relief, and dignity through real community programs and published reporting.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="space-y-5 text-lg leading-8 text-[#44534d]">
                  <p>
                    We worship Allah through prayer, fasting, Hajj, and Zakat. Alongside these duties, we are also called to stand beside distressed neighbors, needy relatives, and vulnerable families in our communities.
                  </p>
                  <p>
                    When many people give together, even modest contributions can become education, relief, and dignity for those who need it most. We invite you to support Alokayon in serving vulnerable families with care and transparency.
                  </p>
                </div>

                <p className="mt-6 text-sm font-medium text-[#5d6d66]">
                  Every contribution supports real programs backed by published reporting.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    className="inline-flex items-center justify-center rounded-full bg-[#07583f] px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(7,88,63,0.18)] transition hover:bg-[#064532] active:scale-[0.98]"
                    href="#donate"
                  >
                    Donate Now
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-full border border-[#d9e3de] bg-white px-8 py-3.5 text-sm font-bold text-[#163229] transition hover:border-[#bfd0c8] hover:bg-[#fbfcfb]"
                    href="#transparency"
                  >
                    View Transparency
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(to_bottom,#fbfcfa,#f7f8f6)] py-28" aria-labelledby="founder-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.5rem] border border-[#e6ebe7] bg-white shadow-[0_20px_60px_rgba(20,50,38,0.05)]">
            <div className="grid items-center gap-12 px-8 py-12 lg:grid-cols-[0.72fr_1.28fr] lg:px-14 lg:py-16">
              <div className="mx-auto w-full max-w-sm lg:max-w-xs">
                <div className="overflow-hidden rounded-[1.75rem] border border-[#e4e9e6] bg-[#f3f6f4] shadow-[0_12px_30px_rgba(20,50,38,0.05)]">
                  <img
                    className="aspect-[4/5] w-full object-cover"
                    src={founderMessage.image}
                    alt={founderMessage.name}
                  />
                </div>
              </div>

              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#9a630d]">
                  Message from the Founder
                </p>
                <h2
                  className="max-w-3xl text-[2rem] font-black leading-[1.12] tracking-tight text-[#003527] md:text-[2.6rem] lg:text-[2.9rem]"
                  id="founder-title"
                >
                  “{founderMessage.quote}”
                </h2>

                <div className="mt-10 border-t border-[#e7ece8] pt-6">
                  <p className="text-lg font-bold text-[#163229]">{founderMessage.name}</p>
                  <p className="mt-1 text-sm font-medium text-[#66736d]">{founderMessage.title}</p>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    className="inline-flex items-center justify-center rounded-full bg-[#07583f] px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(7,88,63,0.22)] transition hover:bg-[#064532] hover:shadow-[0_22px_48px_rgba(7,88,63,0.26)] active:scale-[0.98]"
                    href="#donate"
                  >
                    Donate Now
                  </a>
                  <a
                    className="inline-flex items-center justify-center rounded-full border border-[#d9e3de] bg-white px-8 py-3.5 text-sm font-bold text-[#163229] transition hover:border-[#bfd0c8] hover:bg-[#fbfcfb]"
                    href="#about"
                  >
                    Read Full Message
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9f7] py-28" aria-labelledby="allocation-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#9a630d]">
              Transparent Allocation
            </p>
            <h2 className="text-4xl font-black tracking-tight text-[#003527] md:text-5xl" id="allocation-title">
              Where Your Zakat Goes
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#52615b]">
              The magazine publishes line-item spending rather than a pre-made category chart. This section shows the largest verified 2024-25 expenditure items and their share of the published total.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="rounded-[2.25rem] border border-[#e2e8e4] bg-white p-8 shadow-[0_20px_60px_rgba(20,50,38,0.05)] lg:p-10">
              <div
                className="mx-auto aspect-square w-full max-w-[22rem] rounded-full border border-[#edf2ee] shadow-inner"
                style={{
                  background: `conic-gradient(
                    ${zakatAllocation[0].color} 0% ${zakatAllocation[0].percentage}%,
                    ${zakatAllocation[1].color} ${zakatAllocation[0].percentage}% ${zakatAllocation[0].percentage + zakatAllocation[1].percentage}%,
                    ${zakatAllocation[2].color} ${zakatAllocation[0].percentage + zakatAllocation[1].percentage}% ${zakatAllocation[0].percentage + zakatAllocation[1].percentage + zakatAllocation[2].percentage}%,
                    ${zakatAllocation[3].color} ${zakatAllocation[0].percentage + zakatAllocation[1].percentage + zakatAllocation[2].percentage}% ${zakatAllocation[0].percentage + zakatAllocation[1].percentage + zakatAllocation[2].percentage + zakatAllocation[3].percentage}%,
                    ${zakatAllocation[4].color} ${zakatAllocation[0].percentage + zakatAllocation[1].percentage + zakatAllocation[2].percentage + zakatAllocation[3].percentage}% ${zakatAllocation.reduce((sum, item) => sum + item.percentage, 0)}%,
                    #edf2ee ${zakatAllocation.reduce((sum, item) => sum + item.percentage, 0)}% 100%
                  )`,
                }}
              >
                <div className="m-[16%] flex h-[68%] items-center justify-center rounded-full bg-[#fffdf9] text-center shadow-[0_10px_30px_rgba(20,50,38,0.06)]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f6b4f]">
                      Published 2024-25 Total
                    </p>
                    <p className="mt-3 text-4xl font-black tracking-tight text-[#003527]">
                      ৳1,132,388
                    </p>
                    <p className="mt-2 text-sm text-[#61706a]">
                      Top five line items shown here represent {zakatAllocation.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}% of the published expenditure.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-[#64726c]">
                Source: Alokayon annual report expenditure table for 2024-25, pages 34-35.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {zakatAllocation.map((item) => (
                <article
                  className="rounded-[1.75rem] border border-[#e4eae6] bg-white p-6 shadow-[0_14px_36px_rgba(20,50,38,0.04)]"
                  key={item.label}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      <StatIcon type={item.icon} />
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-sm font-black tracking-tight"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-[#20322b]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-lg font-bold tracking-tight text-[#0f6b4f]">
                    {item.amount}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5d6b65]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#07583f] px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(7,88,63,0.18)] transition hover:bg-[#064532] active:scale-[0.98]"
              href="#donate"
            >
              Donate Now
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f6f5] py-28" id="about">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#9a630d]">
              Transparency Process
            </p>
            <h2 className="mb-6 text-4xl font-black tracking-tight text-[#003527] md:text-5xl">
              How Your Zakat Is Handled
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-[#4f5d57]">
              A clear four-step process that shows how donations are reviewed, documented, delivered, and reflected back through published reporting.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {frameworkCards.map((card) => (
              <article
                className="relative overflow-hidden rounded-[2rem] border border-[#e2e8e4] bg-white p-8 shadow-[0_16px_40px_rgba(20,50,38,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(20,50,38,0.08)]"
                key={card.title}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5f1] text-[#0f6b4f]">
                      <StatIcon type={card.icon} />
                    </div>
                    <span className="rounded-full bg-[#f3f6f4] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#5f7169]">
                      {card.step}
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-2xl font-black tracking-tight text-[#143126]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#5a6762]">
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#66736d]">
              Every step is documented and reflected in our published reports.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-[#07583f] px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(7,88,63,0.18)] transition hover:bg-[#064532] active:scale-[0.98]"
                href="#donate"
              >
                Donate Now
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#d9e3de] bg-white px-8 py-3.5 text-sm font-bold text-[#163229] transition hover:border-[#bfd0c8] hover:bg-[#fbfcfb]"
                href="#reports"
              >
                View Reports
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-20 rounded-t-[3rem] bg-emerald-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-12 py-16 md:grid-cols-3">
          <div>
            <div className="mb-6 text-lg font-bold text-[#143126]">Alokayon</div>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#2f6b55]/60">
              A digital trust shell inspired by annual charitable reporting, transparent distribution, and donor clarity.
            </p>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003527]/5 text-[#003527]">○</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003527]/5 text-[#003527]">✉</div>
            </div>
          </div>

          <div className="md:pl-12">
            <h4 className="mb-6 font-bold text-[#143126]">Quick Links</h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a className="text-sm text-[#2f6b55]/60 transition hover:text-[#143126] hover:underline" href="#top">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div id="reports">
            <h4 className="mb-6 font-bold text-[#143126]">Global Headquarters</h4>
            <p className="mb-4 text-sm leading-relaxed text-[#2f6b55]/60">
              Community Care Center
              <br />
              Zakat Operations Desk
              <br />
              Dhaka, Bangladesh
            </p>
            <div className="flex items-center gap-4 rounded-xl border border-[#143126]/10 bg-white/60 p-4">
              <span className="text-[#003527]">✓</span>
              <span className="text-xs font-semibold text-[#003527]">Verified charitable reporting framework</span>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-[#143126]/5 px-12 py-8 text-center md:text-left">
          <p className="text-sm text-[#2f6b55]/60">© 2026 Alokayon. Adapted for Alokayon-inspired trust and impact reporting.</p>
        </div>
      </footer>
    </main>
  )
}

export default App
