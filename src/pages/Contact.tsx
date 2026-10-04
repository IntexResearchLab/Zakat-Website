import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../components/reusables/Breadcrumb'

const topics = ['general', 'donation', 'zakat', 'volunteer', 'partnership', 'other'] as const
type Topic = (typeof topics)[number]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldClass =
  'w-full rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'
const labelClass = 'grid gap-2 text-[0.9rem] font-semibold text-[#14324d]'

type ErrorKey = 'name' | 'email' | 'message' | 'tooMany' | 'generic'

function Contact() {
  const { t, i18n } = useTranslation()
  // When the page opened; the server ignores forms sent within a few seconds (usually bots).
  const [startedAt] = useState(() => Date.now())
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'general' as Topic,
    message: '',
  })
  const [website, setWebsite] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null)

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setErrorKey('name')
      return
    }
    if (!emailPattern.test(form.email.trim())) {
      setErrorKey('email')
      return
    }
    if (form.message.trim().length < 10) {
      setErrorKey('message')
      return
    }

    setErrorKey(null)
    setIsSending(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          website,
          startedAt,
          language: i18n.language,
        }),
      })

      if (response.ok) {
        setIsSent(true)
      } else {
        setErrorKey(
          response.status === 429 ? 'tooMany' : response.status === 400 ? 'message' : 'generic',
        )
      }
    } catch {
      setErrorKey('generic')
    }

    setIsSending(false)
  }

  const details = [
    {
      label: t('contactPage.details.email'),
      value: 'alokayon2019@gmail.com',
      href: 'mailto:alokayon2019@gmail.com',
    },
    { label: t('contactPage.details.phone'), value: '01925124019', href: 'tel:+8801925124019' },
    { label: t('contactPage.details.phoneAlt'), value: '01779577828', href: 'tel:+8801779577828' },
  ]

  return (
    <div className="bg-white">
      <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <Breadcrumb items={[{ label: t('common.breadcrumb.contact') }]} />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('contactPage.eyebrow')}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1] tracking-[-0.04em] text-[#101d2b] sm:text-[3.4rem]">
            {t('contactPage.title')}
          </h1>
          <p className="mt-6 max-w-3xl text-[1.04rem] leading-[1.85] text-[#5d6d78]">
            {t('contactPage.intro')}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_20rem] lg:items-start">
        {isSent ? (
          <div className="rounded-[1.4rem] border border-[#cde7d8] bg-[#f5fbf7] p-8" role="status">
            <h2 className="font-serif text-[1.8rem] leading-tight tracking-[-0.03em] text-[#13703e]">
              {t('contactPage.sent.title')}
            </h2>
            <p className="mt-3 text-[1rem] leading-[1.8] text-[#4f6170]">
              {t('contactPage.sent.message', { email: form.email.trim() })}
            </p>
          </div>
        ) : (
          <form
            className="grid min-w-0 gap-5"
            noValidate
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                {t('contactPage.fields.name')}
                <input
                  autoComplete="name"
                  className={fieldClass}
                  id="contact-name"
                  onChange={(event) => update('name')(event.target.value)}
                  required
                  value={form.name}
                />
              </label>
              <label className={labelClass}>
                {t('contactPage.fields.email')}
                <input
                  autoComplete="email"
                  className={fieldClass}
                  id="contact-email"
                  onChange={(event) => update('email')(event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className={labelClass}>
                {t('contactPage.fields.phone')}
                <input
                  autoComplete="tel"
                  className={fieldClass}
                  id="contact-phone"
                  onChange={(event) => update('phone')(event.target.value)}
                  type="tel"
                  value={form.phone}
                />
              </label>
              <label className={labelClass}>
                {t('contactPage.fields.topic')}
                <select
                  className={fieldClass}
                  id="contact-topic"
                  onChange={(event) => update('topic')(event.target.value)}
                  value={form.topic}
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {t(`contactPage.topics.${topic}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className={labelClass}>
              {t('contactPage.fields.message')}
              <textarea
                className={`${fieldClass} min-h-[10rem]`}
                id="contact-message"
                maxLength={4000}
                onChange={(event) => update('message')(event.target.value)}
                required
                value={form.message}
              />
            </label>

            {/* Hidden from people and screen readers; only bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input
                  autoComplete="off"
                  id="contact-website"
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  value={website}
                />
              </label>
            </div>

            {errorKey ? (
              <p
                className="rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-[0.92rem] leading-[1.6] text-[#9e3342]"
                role="alert"
              >
                {t(`contactPage.errors.${errorKey}`)}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSending}
                type="submit"
              >
                {isSending ? t('contactPage.sending') : t('contactPage.send')}
              </button>
              <p className="text-[0.86rem] leading-[1.6] text-[#5d6d78]">
                {t('contactPage.replyNote')}
              </p>
            </div>
          </form>
        )}

        <aside className="rounded-[1.4rem] border border-[#dbe7ee] bg-[#f7fbfd] p-6">
          <h2 className="font-serif text-[1.4rem] leading-tight tracking-[-0.02em] text-[#14324d]">
            {t('contactPage.details.title')}
          </h2>
          <dl className="mt-5 grid gap-4 text-[0.95rem]">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#5d6d78]">
                  {item.label}
                </dt>
                <dd className="mt-1">
                  <a className="font-semibold text-[#115b82] hover:text-[#0d4f72]" href={item.href}>
                    {item.value}
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#5d6d78]">
                {t('contactPage.details.address')}
              </dt>
              <dd className="mt-1 leading-[1.7] text-[#4f6170]">{t('footer.contact.address')}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}

export default Contact
