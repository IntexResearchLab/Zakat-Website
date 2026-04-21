export const impactStats = [
  { value: '2011', label: 'Established' },
  { value: '100+', label: 'Students Supported' },
  { value: '100+', label: 'Families Assisted' },
  { value: '6+', label: 'Programs Running' },
]

export const programs = [
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

export const timeline = [
  { year: '2011', title: 'Started as a small initiative' },
  { year: '2019', title: 'Officially registered as Alokayon' },
  { year: 'Today', title: 'Supporting communities across Bangladesh' },
]

export const testimonials = [
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

export const trustPoints = [
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

export const committeeMembers = Array.from({ length: 14 }, (_, index) => ({
  name: `Executive Member ${String(index + 1).padStart(2, '0')}`,
  role:
    index === 0
      ? 'Committee Chair'
      : index === 1
        ? 'Executive Advisor'
        : 'Executive Committee',
  image: committeeImages[index % committeeImages.length],
}))

export const purposeSections = [
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
