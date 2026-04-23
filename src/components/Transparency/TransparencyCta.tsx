import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import type { MagazineIssue } from './types'

type TransparencyCtaProps = {
  latestIssue: MagazineIssue
}

function TransparencyCta({ latestIssue }: TransparencyCtaProps) {
  const { t } = useTranslation()

  return (
    <section className="border-t border-[#dfe8ee] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdfe_55%,#f8fbfd_100%)] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('transparency.cta.eyebrow')}
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-[2.65rem] leading-[0.98] tracking-[-0.05em] text-[#14324d] sm:text-[3.6rem]">
            {t('transparency.cta.title')}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-[1rem] leading-[1.85] text-[#5f7280] sm:text-[1.04rem]">
            {t('transparency.cta.description')}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              download
              href={latestIssue.pdfUrl}
            >
              {t('transparency.cta.downloadMagazine')}
            </a>
            <Link
              className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f6fbff]"
              to={`/transparency/${latestIssue.year}`}
            >
              {t('transparency.cta.readOnline')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyCta
