import type { TFunction } from 'i18next'

type ErrorLike = {
  message?: string
  status?: number
  statusCode?: number | string
  code?: string
} | null | undefined

// Turns raw Supabase / network errors into messages a non-technical admin can act on.
// The original error is still logged so it can be found in the browser console.
export const getFriendlyErrorMessage = (
  t: TFunction,
  error: ErrorLike,
  fallbackKey = 'admin.errors.generic',
) => {
  if (error) {
    console.error(error)
  }

  const message = (error?.message ?? '').toLowerCase()
  const status = Number(error?.status ?? error?.statusCode)
  const code = error?.code ?? ''

  if (message.includes('failed to fetch') || message.includes('network') || message.includes('load failed')) {
    return t('admin.errors.network')
  }

  if (message.includes('invalid login credentials')) {
    return t('admin.errors.invalidCredentials')
  }

  if (message.includes('email not confirmed')) {
    return t('admin.errors.emailNotConfirmed')
  }

  if (message.includes('different from the old password')) {
    return t('admin.errors.samePassword')
  }

  if (message.includes('password should') || message.includes('weak password')) {
    return t('admin.errors.weakPassword')
  }

  if (message.includes('rate limit') || status === 429) {
    return t('admin.errors.rateLimited')
  }

  if (
    message.includes('row-level security') ||
    message.includes('permission denied') ||
    message.includes('not authorized') ||
    message.includes('unauthorized') ||
    status === 403 ||
    code === '42501' ||
    // .single() after an update that row level security blocked: zero rows came back.
    code === 'PGRST116'
  ) {
    return t('admin.errors.permission')
  }

  if (message.includes('jwt') || message.includes('session') || status === 401) {
    return t('admin.errors.sessionExpired')
  }

  if (
    message.includes('payload too large') ||
    message.includes('maximum allowed size') ||
    status === 413
  ) {
    return t('admin.errors.fileTooLarge')
  }

  if (message.includes('already exists') || code === '23505') {
    return t('admin.errors.duplicate')
  }

  return t(fallbackKey)
}

// Row level security blocks an update or delete silently: no error, just zero rows changed.
// Treating that as a permission error stops the admin being told a change was saved when it wasn't.
const noRowsChangedError = { code: '42501', message: 'permission denied: no rows were changed' }

export const requireChangedRows = ({ data, error }: { data: unknown[] | null; error: ErrorLike }) =>
  error ?? (data?.length ? null : noRowsChangedError)
