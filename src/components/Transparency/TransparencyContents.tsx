import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import type { MagazineIssue } from './types'

type TransparencyContentsProps = {
  selectedIssue: MagazineIssue
}

function TransparencyContents({ selectedIssue }: TransparencyContentsProps) {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('transparency.contents.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('transparency.contents.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" delay={120}>
          {selectedIssue.sections.map((section, index) => (
            <div
              className="flex items-center gap-4 rounded-[1rem] border border-[#dbe7ee] bg-[#fbfdfe] p-4"
              key={section}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf7fc] text-sm font-bold text-[#115b82]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[0.96rem] font-semibold leading-[1.45] text-[#14324d]">
                {section}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyContents
