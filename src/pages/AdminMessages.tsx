import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { getFriendlyErrorMessage, requireChangedRows } from '../lib/adminErrors'
import { supabase } from '../utils/supabase'

type MessageStatus = 'new' | 'replied' | 'archived'

type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  topic: string
  message: string
  language: string | null
  status: MessageStatus
  handled_at: string | null
  created_at: string
}

type Filter = MessageStatus | 'all'
const filters: Filter[] = ['new', 'replied', 'archived', 'all']

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const statusClass: Record<MessageStatus, string> = {
  new: 'border-[#f1dfb8] bg-[#fffaf0] text-[#8a5a00]',
  replied: 'border-[#cde7d8] bg-[#f5fbf7] text-[#13703e]',
  archived: 'border-[#dbe7ee] bg-[#f6f9fb] text-[#4f6473]',
}

const actionClass =
  'inline-flex items-center gap-1.5 rounded-full border border-[#dbe7ee] bg-white px-3.5 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60'

function AdminMessages() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('new')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const loadMessages = async () => {
    setIsLoading(true)
    setErrorMessage('')
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id, name, email, phone, topic, message, language, status, handled_at, created_at')
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      setMessages((data ?? []) as ContactMessage[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void loadMessages()
    // Load once on open; the Refresh button reloads on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const counts = useMemo(
    () =>
      Object.fromEntries(
        filters.map((key) => [
          key,
          key === 'all'
            ? messages.length
            : messages.filter((message) => message.status === key).length,
        ]),
      ) as Record<Filter, number>,
    [messages],
  )
  const visible =
    filter === 'all' ? messages : messages.filter((message) => message.status === filter)

  const setStatus = async (message: ContactMessage, status: MessageStatus) => {
    setBusyId(message.id)
    setErrorMessage('')
    const handledAt = status === 'new' ? null : new Date().toISOString()
    const error = requireChangedRows(
      await supabase
        .from('contact_messages')
        .update({ status, handled_at: handledAt })
        .eq('id', message.id)
        .select('id'),
    )

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, status, handled_at: handledAt } : item,
        ),
      )
    }
    setBusyId(null)
  }

  const handleDelete = async (message: ContactMessage) => {
    if (!window.confirm(t('admin.messages.deleteConfirm', { name: message.name }))) {
      return
    }

    setBusyId(message.id)
    const error = requireChangedRows(
      await supabase.from('contact_messages').delete().eq('id', message.id).select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      setMessages((current) => current.filter((item) => item.id !== message.id))
    }
    setBusyId(null)
  }

  const replyHref = (message: ContactMessage) => {
    const subject = t('admin.messages.replySubject')
    const quoted = message.message
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n')
    return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `${t('admin.messages.replyGreeting', { name: message.name })}\n\n\n\n${quoted}`,
    )}`
  }

  return (
    <AdminShellLayout
      description={t('admin.messages.description')}
      eyebrow={t('admin.messages.eyebrow')}
      title={t('admin.messages.title')}
    >
      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-[#edf3f7] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t('admin.messages.filterLabel')}
          >
            {filters.map((key) => (
              <button
                aria-pressed={filter === key}
                className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition ${
                  filter === key
                    ? 'border-[#115b82] bg-[#115b82] text-white'
                    : 'border-[#dbe7ee] bg-white text-[#4f6473] hover:border-[#bfd5e4]'
                }`}
                key={key}
                onClick={() => setFilter(key)}
                type="button"
              >
                {t(`admin.messages.filters.${key}`)} ({counts[key]})
              </button>
            ))}
          </div>
          <button className={actionClass} onClick={() => void loadMessages()} type="button">
            <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
              refresh
            </span>
            {t('admin.stats.refresh')}
          </button>
        </div>

        {errorMessage ? (
          <p
            className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t('admin.messages.loading')}
          </p>
        ) : !visible.length ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t(filter === 'new' ? 'admin.messages.emptyNew' : 'admin.messages.empty')}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {visible.map((message) => {
              const isBusy = busyId === message.id
              return (
                <li
                  className="rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-5"
                  key={message.id}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-[1.25rem] leading-tight text-[#14324d]">
                      {message.name}
                    </p>
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] ${statusClass[message.status]}`}
                    >
                      {t(`admin.messages.status.${message.status}`)}
                    </span>
                    <span className="rounded-full border border-[#dbe7ee] bg-white px-3 py-1 text-[0.72rem] font-semibold text-[#4f6473]">
                      {t(`contactPage.topics.${message.topic}`, { defaultValue: message.topic })}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-[0.9rem] text-[#5d6d78]">
                    {message.email}
                    {message.phone ? ` · ${message.phone}` : ''} · {formatDate(message.created_at)}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap break-words text-[0.98rem] leading-[1.75] text-[#14324d]">
                    {message.message}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[#edf3f7] pt-4">
                    <a className={actionClass} href={replyHref(message)}>
                      <span aria-hidden="true" className="material-symbols-outlined text-[0.95rem]">
                        mail
                      </span>
                      {t('admin.messages.reply')}
                    </a>
                    {message.status !== 'replied' ? (
                      <button
                        className={actionClass}
                        disabled={isBusy}
                        onClick={() => void setStatus(message, 'replied')}
                        type="button"
                      >
                        {t('admin.messages.markReplied')}
                      </button>
                    ) : null}
                    {message.status !== 'archived' ? (
                      <button
                        className={actionClass}
                        disabled={isBusy}
                        onClick={() => void setStatus(message, 'archived')}
                        type="button"
                      >
                        {t('admin.messages.archive')}
                      </button>
                    ) : null}
                    {message.status !== 'new' ? (
                      <button
                        className={actionClass}
                        disabled={isBusy}
                        onClick={() => void setStatus(message, 'new')}
                        type="button"
                      >
                        {t('admin.messages.markNew')}
                      </button>
                    ) : null}
                    <button
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#9e3342] transition hover:bg-[#fff6f7] disabled:opacity-60"
                      disabled={isBusy}
                      onClick={() => void handleDelete(message)}
                      type="button"
                    >
                      {t('admin.messages.delete')}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </AdminShellLayout>
  )
}

export default AdminMessages
