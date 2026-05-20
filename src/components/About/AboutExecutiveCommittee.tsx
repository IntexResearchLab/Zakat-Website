import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getCommitteeMembers } from './data'
import {
  getCachedExecutiveMembers,
  loadExecutiveMembers,
  type ExecutiveMember,
} from '../../lib/executives'

type DisplayExecutiveMember = {
  id: string
  name: string
  role: string
  image: string
  email: string
  phone: string
}

function AboutExecutiveCommittee() {
  const { t } = useTranslation()
  const [committeePage, setCommitteePage] = useState(0)
  const [committeeVisibleCount, setCommitteeVisibleCount] = useState(3)
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false)
  const [remoteMembers, setRemoteMembers] = useState<ExecutiveMember[]>(
    () => getCachedExecutiveMembers() ?? [],
  )

  const fallbackMembers = getCommitteeMembers(t)
  const officeEmail = t('about.executive.officeEmail')
  const officePhone = t('about.executive.officePhone')

  useEffect(() => {
    let isMounted = true

    const syncExecutiveMembers = async () => {
      try {
        const rows = await loadExecutiveMembers()
        if (isMounted) {
          setRemoteMembers(rows)
        }
      } catch {
        // The public fallback content is kept in translations, so we stay quiet here.
      }
    }

    void syncExecutiveMembers()

    return () => {
      isMounted = false
    }
  }, [])

  const committeeMembers = useMemo<DisplayExecutiveMember[]>(
    () =>
      remoteMembers.length
        ? remoteMembers.map((member, index) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            image:
              member.image_url || fallbackMembers[index % fallbackMembers.length]?.image || '/assets/about/person-1.jpg',
            email: member.email || officeEmail,
            phone: member.phone || officePhone,
          }))
        : fallbackMembers.map((member, index) => ({
            id: `fallback-${index + 1}`,
            name: member.name,
            role: member.role,
            image: member.image || '/assets/about/person-1.jpg',
            email: member.email || officeEmail,
            phone: member.phone || officePhone,
          })),
    [fallbackMembers, officeEmail, officePhone, remoteMembers],
  )

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) {
        setCommitteeVisibleCount(4)
        return
      }
      if (window.innerWidth >= 768) {
        setCommitteeVisibleCount(2)
        return
      }
      setCommitteeVisibleCount(1)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const committeeTotalPages = Math.max(
    1,
    Math.ceil(committeeMembers.length / committeeVisibleCount),
  )
  const currentCommitteePage = Math.min(committeePage, committeeTotalPages - 1)

  useEffect(() => {
    if (isDirectoryOpen) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setCommitteePage((current) => (current + 1) % committeeTotalPages)
    }, 5500)

    return () => window.clearInterval(interval)
  }, [committeeTotalPages, isDirectoryOpen])

  useEffect(() => {
    if (!isDirectoryOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDirectoryOpen(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDirectoryOpen])

  const currentMembers = useMemo(
    () =>
      committeeMembers.slice(
        currentCommitteePage * committeeVisibleCount,
        currentCommitteePage * committeeVisibleCount + committeeVisibleCount,
      ),
    [committeeMembers, currentCommitteePage, committeeVisibleCount],
  )

  return (
    <>
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('about.executive.eyebrow')}
              </p>
              <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                {t('about.executive.title')}
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#5d6f7b] sm:text-[1.04rem]">
                {t('about.executive.description')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[#dce7ee] bg-[#f8fbfd] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                {t('about.executive.badge', { count: committeeMembers.length })}
              </div>
              <button
                className="inline-flex items-center justify-center rounded-full bg-[#14324d] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#115b82]"
                onClick={() => setIsDirectoryOpen(true)}
                type="button"
              >
                {t('about.executive.viewAll')}
              </button>
            </div>
          </Reveal>

          <Reveal className="mt-10" delay={120}>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {currentMembers.map((member) => (
                <article
                  className="group rounded-[1.15rem] border border-[#dbe7ee] bg-white p-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                  key={member.id}
                >
                  <div className="overflow-hidden rounded-[0.95rem] bg-[#f2f7fa]">
                    <img
                      alt={member.name}
                      className="aspect-[4/4.6] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      src={member.image}
                    />
                  </div>
                  <h3 className="mt-4 font-serif text-[1.28rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-[0.88rem] font-medium leading-[1.55] text-[#6a7c87]">
                    {member.role}
                  </p>
                  <div className="mt-3 rounded-[0.9rem] bg-[#f7fbfd] px-3.5 py-3 ring-1 ring-[#dce7ee]">
                    <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                      {t('about.executive.contactLabel')}
                    </p>
                    <div className="mt-2.5 space-y-2 text-[0.85rem] text-[#5d6f7b]">
                      <a
                        className="flex items-center gap-2 transition hover:text-[#115b82]"
                        href={`mailto:${member.email}`}
                      >
                        <span className="material-symbols-outlined text-[1rem]">mail</span>
                        <span>{member.email}</span>
                      </a>
                      <a
                        className="flex items-center gap-2 transition hover:text-[#115b82]"
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                      >
                        <span className="material-symbols-outlined text-[1rem]">call</span>
                        <span>{member.phone}</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.95rem] leading-[1.7] text-[#627581]">
                {t('about.executive.footer')}
              </p>

              <div className="flex items-center gap-3">
                <button
                  aria-label={t('about.executive.previous')}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce7ee] bg-white text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f5fafe]"
                  onClick={() =>
                    setCommitteePage((current) =>
                      current === 0 ? committeeTotalPages - 1 : current - 1,
                    )
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[1.15rem]">west</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: committeeTotalPages }, (_, index) => (
                    <button
                      aria-label={t('about.executive.showSlide', { index: index + 1 })}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentCommitteePage
                          ? 'w-8 bg-[#115b82]'
                          : 'w-2.5 bg-[#d3e1ea] hover:bg-[#b8cddd]'
                      }`}
                      key={`committee-dot-${index + 1}`}
                      onClick={() => setCommitteePage(index)}
                      type="button"
                    />
                  ))}
                </div>

                <button
                  aria-label={t('about.executive.next')}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce7ee] bg-white text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f5fafe]"
                  onClick={() =>
                    setCommitteePage((current) => (current + 1) % committeeTotalPages)
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[1.15rem]">east</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {isDirectoryOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#09131ccc]/82 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsDirectoryOpen(false)}
          role="dialog"
        >
          <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label={t('about.executive.closeModal')}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#14324d] shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition hover:bg-white"
              onClick={() => setIsDirectoryOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">close</span>
            </button>

            <div className="max-h-[86vh] overflow-y-auto rounded-[1.45rem] border border-[#dce7ee] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('about.executive.eyebrow')}
              </p>
              <h3 className="mt-4 font-serif text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[2.8rem]">
                {t('about.executive.modalTitle')}
              </h3>
              <p className="mt-4 max-w-3xl text-[1rem] leading-[1.8] text-[#647783]">
                {t('about.executive.modalDescription')}
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {committeeMembers.map((member) => (
                  <article
                    className="rounded-[1.15rem] border border-[#dbe7ee] bg-[#fbfdff] p-4"
                    key={`directory-${member.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        alt={member.name}
                        className="h-24 w-20 rounded-[0.85rem] object-cover"
                        src={member.image}
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-[1.2rem] leading-[1.1] tracking-[-0.03em] text-[#14324d]">
                          {member.name}
                        </h4>
                        <p className="mt-1 text-[0.92rem] leading-[1.5] text-[#6a7c87]">
                          {member.role}
                        </p>
                        <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                          {t('about.executive.contactLabel')}
                        </p>
                        <div className="mt-2 space-y-1.5 text-[0.85rem] text-[#5d6f7b]">
                          <a className="block transition hover:text-[#115b82]" href={`mailto:${member.email}`}>
                            {member.email}
                          </a>
                          <a
                            className="block transition hover:text-[#115b82]"
                            href={`tel:${member.phone.replace(/\s+/g, '')}`}
                          >
                            {member.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default AboutExecutiveCommittee
