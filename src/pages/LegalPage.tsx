import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/reusables/Breadcrumb'

export type PolicyKey = 'terms' | 'privacy' | 'refund'

type PolicySection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

const policyPaths: Record<PolicyKey, string> = {
  terms: '/terms-and-conditions',
  privacy: '/privacy-policy',
  refund: '/refund-policy',
}

const breadcrumbKeys: Record<PolicyKey, string> = {
  terms: 'common.breadcrumb.terms',
  privacy: 'common.breadcrumb.privacy',
  refund: 'common.breadcrumb.refund',
}

type LegalPageProps = {
  policy: PolicyKey
}

function LegalPage({ policy }: LegalPageProps) {
  const { t } = useTranslation()
  const sections = t(`legal.${policy}.sections`, { returnObjects: true }) as PolicySection[]
  const otherPolicies = (Object.keys(policyPaths) as PolicyKey[]).filter((key) => key !== policy)

  return (
    <div className="bg-white">
      <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)]">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:py-18">
          <Breadcrumb items={[{ label: t(breadcrumbKeys[policy]) }]} />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('legal.eyebrow')}
          </p>
          <h1 className="mt-4 font-serif text-[2.6rem] font-semibold leading-[1] tracking-[-0.04em] text-[#101d2b] sm:text-[3.4rem]">
            {t(`legal.${policy}.title`)}
          </h1>
          <p className="mt-4 text-[0.92rem] font-semibold text-[#5d6d78]">
            {t('legal.lastUpdatedLabel')}: {t('legal.lastUpdated')}
          </p>
          <p className="mt-6 max-w-3xl text-[1.04rem] leading-[1.85] text-[#5d6d78]">
            {t(`legal.${policy}.intro`)}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="font-serif text-[1.55rem] leading-tight tracking-[-0.02em] text-[#14324d]">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p className="mt-4 text-[1rem] leading-[1.85] text-[#4f6170]" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-4 space-y-2.5 pl-1">
                  {section.bullets.map((bullet) => (
                    <li className="flex gap-3 text-[1rem] leading-[1.75] text-[#4f6170]" key={bullet}>
                      <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#115b82]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-[1.4rem] border border-[#dbe7ee] bg-[#f7fbfd] p-6 sm:p-8">
          <h2 className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-[#14324d]">
            {t('legal.contact.title')}
          </h2>
          <p className="mt-3 text-[0.98rem] leading-[1.8] text-[#5d6d78]">{t('legal.contact.intro')}</p>
          <dl className="mt-5 grid gap-4 text-[0.96rem] leading-[1.7] sm:grid-cols-[10rem_1fr]">
            <dt className="font-semibold text-[#14324d]">{t('legal.contact.organizationLabel')}</dt>
            <dd className="text-[#4f6170]">{t('legal.contact.organization')}</dd>
            <dt className="font-semibold text-[#14324d]">{t('legal.contact.addressLabel')}</dt>
            <dd className="text-[#4f6170]">{t('footer.contact.address')}</dd>
            <dt className="font-semibold text-[#14324d]">{t('legal.contact.emailLabel')}</dt>
            <dd>
              <a className="text-[#115b82] underline-offset-4 hover:underline" href="mailto:alokayon2019@gmail.com">
                alokayon2019@gmail.com
              </a>
            </dd>
            <dt className="font-semibold text-[#14324d]">{t('legal.contact.phoneLabel')}</dt>
            <dd>
              <a className="text-[#115b82] underline-offset-4 hover:underline" href="tel:+8801925124019">
                01925124019
              </a>
            </dd>
          </dl>
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e4edf3] pt-6 text-[0.95rem]">
          <span className="font-semibold text-[#14324d]">{t('legal.relatedLabel')}</span>
          {otherPolicies.map((key) => (
            <Link className="text-[#115b82] underline-offset-4 hover:underline" key={key} to={policyPaths[key]}>
              {t(`legal.${key}.title`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LegalPage
