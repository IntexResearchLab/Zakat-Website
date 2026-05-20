import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabase'

function AdminAuthPanel() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const trustPoints = t('admin.auth.trust', {
    returnObjects: true,
  }) as string[]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message || t('admin.auth.genericError'))
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative overflow-hidden bg-[linear-gradient(145deg,#14324d,#0d2236)] px-6 py-16 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 opacity-10">
          <img
            alt=""
            className="h-full w-full object-cover"
            src="/assets/home/carousel-3.jpg"
          />
        </div>
        <div className="relative mx-auto flex h-full max-w-2xl flex-col justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f1c75b]">
              {t('admin.auth.eyebrow')}
            </p>
            <h1 className="mt-6 font-serif text-[2.8rem] leading-[0.96] tracking-[-0.04em] text-white sm:text-[3.8rem]">
              {t('admin.auth.title')}
            </h1>
            <p className="mt-6 max-w-xl text-[1rem] leading-[1.85] text-[#d7e4ec] sm:text-[1.08rem]">
              {t('admin.auth.description')}
            </p>
          </div>

          <div className="mt-12 space-y-4 rounded-[1.35rem] border border-white/12 bg-white/6 p-6 backdrop-blur-md">
            {trustPoints.map((point) => (
              <div className="flex items-start gap-3" key={point}>
                <span className="material-symbols-outlined mt-0.5 text-[#9be0b7]">
                  verified
                </span>
                <p className="text-[0.98rem] leading-[1.7] text-[#e5eef4]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#f7fbfd] px-6 py-14 sm:px-10">
        <div className="w-full max-w-md rounded-[1.5rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('admin.auth.formTitle')}
          </p>
          <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#627581]">
            {t('admin.auth.formDescription')}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.auth.emailLabel')}
              </label>
              <input
                className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('common.form.emailPlaceholder')}
                type="email"
                value={email}
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.auth.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 pr-14 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t('admin.auth.passwordPlaceholder')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? t('admin.auth.hidePassword') : t('admin.auth.showPassword')}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-[#6c8390] transition hover:text-[#14324d]"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[1.2rem]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-[#627581]">
                <input className="h-4 w-4 rounded border-[#cfe0ea]" type="checkbox" />
                <span>{t('admin.auth.rememberMe')}</span>
              </label>
              <button className="font-semibold text-[#115b82]" type="button">
                {t('admin.auth.forgotPassword')}
              </button>
            </div>

            <button
              className="w-full rounded-full bg-[#13703e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#74a889]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? t('admin.auth.signingIn') : t('admin.auth.signIn')}
            </button>

            {errorMessage ? (
              <p className="rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]">
                {errorMessage}
              </p>
            ) : null}

            <Link
              className="flex w-full items-center justify-center rounded-full border border-[#d8e5ec] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#abcbe0] hover:bg-[#edf7fc]"
              to="/admin/dashboard"
            >
              {t('admin.auth.previewDashboard')}
            </Link>
          </form>

          <p className="mt-6 text-center text-[0.84rem] leading-[1.7] text-[#7b909d]">
            {t('admin.auth.helpText')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminAuthPanel
