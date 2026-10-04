// localStorage throws in some private-browsing modes, when site data is blocked, or when it
// is full. These wrappers treat that as "nothing stored" so caching never breaks a page.

export const readStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export const writeStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // The in-memory copy still works for this visit.
  }
}

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
