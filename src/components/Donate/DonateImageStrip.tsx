import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateImageStrip() {
  const { t } = useTranslation()
  const images = t('donate.gallery.items', {
    returnObjects: true,
  }) as Array<{ image: string; title: string; caption: string }>

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.gallery.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.gallery.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-3" delay={100}>
          {images.map((item) => (
            <article
              className="group overflow-hidden rounded-[1.35rem] border border-[#dbe7ee] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
              key={item.title}
            >
              <div className="overflow-hidden">
                <img
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  src={item.image}
                />
              </div>
              <div className="p-5">
                <p className="text-[0.84rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                  {item.title}
                </p>
                <p className="mt-3 text-[0.95rem] leading-[1.75] text-[#5e707c]">{item.caption}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default DonateImageStrip
