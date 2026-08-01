import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabase'

function AdminResetPasswordPanel() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isCheckingLink, setIsCheckingLink] = useState(true)
  const [hasValidLink, setHasValidLink] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (isMounted) {
        setHasValidLink(Boolean(session))
        setIsCheckingLink(false)
      }
    }

    void checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasValidLink(true)
        setIsCheckingLink(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password.length < 8) {
      setErrorMessage(t('admin.resetPassword.tooShortError'))
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('admin.resetPassword.mismatchError'))
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message || t('admin.resetPassword.genericError'))
      return
    }

    setSuccessMessage(t('admin.resetPassword.successMessage'))
    window.setTimeout(() => navigate('/admin/dashboard'), 1500)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative overflow-hidden bg-[linear-gradient(145deg,#14324d,#0d2236)] px-6 py-16 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 opacity-10">
          <img alt="" className="h-full w-full object-cover" src="/assets/home/carousel-3.jpg" />
        </div>
        <div className="relative mx-auto flex h-full max-w-2xl flex-col justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f1c75b]">
              {t('admin.resetPassword.eyebrow')}
            </p>
            <h1 className="mt-6 font-serif text-[2.8rem] leading-[0.96] tracking-[-0.04em] text-white sm:text-[3.8rem]">
              {t('admin.resetPassword.title')}
            </h1>
            <p className="mt-6 max-w-xl text-[1rem] leading-[1.85] text-[#d7e4ec] sm:text-[1.08rem]">
              {t('admin.resetPassword.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#f7fbfd] px-6 py-14 sm:px-10">
        <div className="w-full max-w-md rounded-[1.5rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-9">
          {isCheckingLink ? (
            <p className="text-sm font-semibold tracking-[0.08em] text-[#4f6473]">
              {t('admin.auth.checkingAccess')}
            </p>
          ) : !hasValidLink ? (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('admin.resetPassword.eyebrow')}
              </p>
              <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#627581]">
                {t('admin.resetPassword.invalidLinkMessage')}
              </p>
              <Link
                className="mt-6 flex w-full items-center justify-center rounded-full border border-[#d8e5ec] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#abcbe0] hover:bg-[#edf7fc]"
                to="/admin"
              >
                {t('admin.resetPassword.backToLogin')}
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('admin.resetPassword.eyebrow')}
              </p>
              <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#627581]">
                {t('admin.resetPassword.description')}
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                    {t('admin.resetPassword.newPasswordLabel')}
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 pr-14 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                      onChange={(event) => setPassword(event.target.value)}
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

                <div>
                  <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                    {t('admin.resetPassword.confirmPasswordLabel')}
                  </label>
                  <input
                    className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                  />
                </div>

                <button
                  className="w-full rounded-full bg-[#13703e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#74a889]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? t('admin.resetPassword.submitting') : t('admin.resetPassword.submit')}
                </button>

                {errorMessage ? (
                  <p className="rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]">
                    {errorMessage}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="rounded-[1rem] border border-[#d7ecdf] bg-[#f3faf5] px-4 py-3 text-sm leading-[1.7] text-[#256a41]">
                    {successMessage}
                  </p>
                ) : null}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminResetPasswordPanel
