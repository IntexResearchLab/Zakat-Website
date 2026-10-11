import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { emailPattern, fieldClass, labelClass } from './formStyles'

type ErrorKey = 'email' | 'message' | 'tooMany' | 'generic'

// Suggestions from members abroad. Sent through the contact form endpoint with the
// "suggestion" topic, so they get the same spam protection and land in Admin → Messages.
function SuggestionBox() {
  const { t, i18n } = useTranslation()
  // When the page opened; the server ignores forms sent within a few seconds (usually bots).
  const [startedAt] = useState(() => Date.now())
  const [form, setForm] = useState({ name: '', email: '', country: '', message: '' })
  const [website, setWebsite] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null)

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
          topic: 'suggestion',
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

  return (
    <section
      aria-labelledby="suggestion-box-title"
      className="scroll-mt-24 border-t border-[#d8e5ec] bg-[#f7fbfd]"
      id="suggestion-box"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[20rem_1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('suggestionBox.eyebrow')}
          </p>
          <h2
            className="mt-4 font-serif text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#101d2b]"
            id="suggestion-box-title"
          >
            {t('suggestionBox.title')}
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.8] text-[#5d6d78]">{t('suggestionBox.intro')}</p>
        </div>

        {isSent ? (
          <div className="rounded-[1.4rem] border border-[#cde7d8] bg-[#f5fbf7] p-8" role="status">
            <h3 className="font-serif text-[1.6rem] leading-tight tracking-[-0.03em] text-[#13703e]">
              {t('suggestionBox.sent.title')}
            </h3>
            <p className="mt-3 text-[1rem] leading-[1.8] text-[#4f6170]">
              {t('suggestionBox.sent.message')}
            </p>
          </div>
        ) : (
          <form
            className="grid min-w-0 gap-5 rounded-[1.4rem] border border-[#dbe7ee] bg-white p-6 sm:p-8"
            noValidate
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                <span>
                  {t('suggestionBox.fields.name')}{' '}
                  <span className="font-normal text-[#627581]">{t('suggestionBox.optional')}</span>
                </span>
                <input
                  autoComplete="name"
                  className={fieldClass}
                  id="suggestion-name"
                  onChange={(event) => update('name')(event.target.value)}
                  value={form.name}
                />
              </label>
              <label className={labelClass}>
                {t('suggestionBox.fields.email')}
                <input
                  autoComplete="email"
                  className={fieldClass}
                  id="suggestion-email"
                  onChange={(event) => update('email')(event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                <span>
                  {t('suggestionBox.fields.country')}{' '}
                  <span className="font-normal text-[#627581]">{t('suggestionBox.optional')}</span>
                </span>
                <input
                  autoComplete="country-name"
                  className={fieldClass}
                  id="suggestion-country"
                  maxLength={60}
                  onChange={(event) => update('country')(event.target.value)}
                  value={form.country}
                />
              </label>
            </div>
            <label className={labelClass}>
              {t('suggestionBox.fields.message')}
              <textarea
                className={`${fieldClass} min-h-[9rem]`}
                id="suggestion-message"
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
                  id="suggestion-website"
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

            <div>
              <button
                className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSending}
                type="submit"
              >
                {isSending ? t('contactPage.sending') : t('suggestionBox.send')}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default SuggestionBox
