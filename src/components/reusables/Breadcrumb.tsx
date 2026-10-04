import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type BreadcrumbItem = {
  label: string
  to?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  accentClassName?: string
}

function Breadcrumb({ items, accentClassName = 'text-[#946510]' }: BreadcrumbProps) {
  const { t } = useTranslation()
  const trail: BreadcrumbItem[] = [{ label: t('common.breadcrumb.home'), to: '/' }, ...items]

  return (
    <nav aria-label={t('common.aria.breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-2 text-[0.92rem] font-medium tracking-[-0.01em] text-[#5f7280]">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {isLast || !item.to ? (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? accentClassName : ''}>
                    {item.label}
                  </span>
                ) : (
                  <Link className="transition hover:text-[#14324d]" to={item.to}>
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <li aria-hidden="true" className="text-[#b2c3cf]">
                  /
                </li>
              ) : null}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
