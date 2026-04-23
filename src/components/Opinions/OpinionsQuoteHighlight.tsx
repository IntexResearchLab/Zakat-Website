import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function OpinionsQuoteHighlight() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-18 sm:py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="font-serif text-[2.3rem] leading-[1.2] tracking-[-0.04em] text-[#14324d] sm:text-[3.3rem]">
            “{t('opinions.quote.text')}”
          </p>
          <p className="mt-5 text-[1rem] font-semibold text-[#6f846f]">
            {t('opinions.quote.author')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default OpinionsQuoteHighlight
