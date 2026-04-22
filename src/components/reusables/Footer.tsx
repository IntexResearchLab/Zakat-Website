import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'

function Footer() {
  const { t } = useTranslation()
  const navLinks = t('footer.navigation.links', {
    returnObjects: true,
  }) as Array<{ label: string; href: string; external?: boolean }>
  const programLinks = t('footer.programs.links', {
    returnObjects: true,
  }) as Array<{ label: string; href: string; external?: boolean }>
  const contactLinks = t('footer.contact.links', {
    returnObjects: true,
  }) as Array<{ label: string; href: string; external?: boolean }>

  const renderLink = (link: { label: string; href: string; external?: boolean }, key: string) => {
    if (link.external) {
      return (
        <a
          className="text-[0.95rem] leading-[1.7] text-[#c4d5df] transition hover:text-white"
          href={link.href}
          key={key}
        >
          {link.label}
        </a>
      )
    }

    return (
      <Link
        className="text-[0.95rem] leading-[1.7] text-[#c4d5df] transition hover:text-white"
        key={key}
        to={link.href}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <footer className="mt-0 border-t border-white/5 bg-[#0f2740] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.8fr_0.95fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <p className="font-serif text-[2rem] font-semibold tracking-[-0.04em] text-white">
              {t('nav.brand')}
            </p>
            <p className="mt-5 text-[1rem] leading-[1.85] text-[#d5e2ea]">
              {t('footer.brand.description')}
            </p>
            <p className="mt-5 text-[0.88rem] font-semibold leading-[1.8] text-[#91aec0]">
              {t('footer.brand.trustLine')}
            </p>

            <Link
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#1b6b96] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#155a80]"
              to="/"
            >
              {t('common.actions.donateNow')}
            </Link>
          </div>

          <div>
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-white">
              {t('footer.navigation.title')}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => renderLink(link, `nav-${link.label}`))}
            </div>
          </div>

          <div>
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-white">
              {t('footer.programs.title')}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {programLinks.map((link) => renderLink(link, `program-${link.label}`))}
            </div>
          </div>

          <div>
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-white">
              {t('footer.contact.title')}
            </p>
            <div className="mt-5 space-y-3 text-[0.95rem] leading-[1.75] text-[#c4d5df]">
              <p>{t('footer.contact.address')}</p>
              <p>{t('footer.contact.note')}</p>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {contactLinks.map((link) => renderLink(link, `contact-${link.label}`))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-[0.82rem] leading-[1.7] text-[#9ab3c1]">
              {t('footer.bottom.copyright')}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a className="text-[0.82rem] text-[#9ab3c1] transition hover:text-white" href="#">
                {t('footer.bottom.privacy')}
              </a>
              <a className="text-[0.82rem] text-[#9ab3c1] transition hover:text-white" href="#">
                {t('footer.bottom.terms')}
              </a>
              <p className="text-[0.82rem] text-[#9ab3c1]">{t('footer.bottom.designed')}</p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
