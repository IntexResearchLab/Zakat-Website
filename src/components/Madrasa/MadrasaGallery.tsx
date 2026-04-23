import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getMadrasaGallery } from './data'

function MadrasaGallery() {
  const { t } = useTranslation()
  const madrasaGallery = getMadrasaGallery(t)

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            {t('madrasa.gallery.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#1f382a] sm:text-[3.1rem]">
            {t('madrasa.gallery.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {madrasaGallery.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group overflow-hidden rounded-[1.5rem] border border-[#dde5de] bg-white shadow-[0_16px_34px_rgba(18,28,22,0.05)]"
            >
              <div className="relative">
                <img
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  src={item.image}
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(18,28,22,0.78)_100%)] p-4 text-white">
                  <p className="text-[0.95rem] font-medium leading-[1.5]">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaGallery
