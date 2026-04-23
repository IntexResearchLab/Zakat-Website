import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import type { MagazineIssue, TransparencyDocument } from './types'

type TransparencyDocumentsProps = {
  selectedIssue: MagazineIssue
}

function TransparencyDocuments({ selectedIssue }: TransparencyDocumentsProps) {
  const { t } = useTranslation()
  const documents = t('transparency.documents.items', {
    returnObjects: true,
  }) as TransparencyDocument[]

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('transparency.documents.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('transparency.documents.title')}
          </h2>
          <p className="mt-5 text-[1rem] leading-[1.8] text-[#647783]">
            {t('transparency.documents.description')}
          </p>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-3" delay={120}>
          {documents.map((document) => (
            <article
              className="rounded-[1.2rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={document.title}
            >
              <span className="material-symbols-outlined text-[1.7rem] text-[#115b82]">
                {document.icon}
              </span>
              <h3 className="mt-4 font-serif text-[1.45rem] leading-[1.1] tracking-[-0.03em] text-[#14324d]">
                {document.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-[1.7] text-[#647783]">
                {document.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:text-[#0d4f72]"
                  href={selectedIssue.pdfUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('transparency.documents.view')}
                </a>
                <a
                  className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#647783] transition hover:text-[#14324d]"
                  download
                  href={selectedIssue.pdfUrl}
                >
                  {t('transparency.documents.download')}
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyDocuments
