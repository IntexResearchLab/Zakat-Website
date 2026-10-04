import { useEffect, useRef } from 'react'

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Shared behaviour for the site's pop-up dialogs: closes on Escape, stops the page behind
// from scrolling, moves keyboard focus into the dialog and keeps it there, then returns focus
// to whatever opened the dialog when it closes. Attach the returned ref to the dialog element.
export const useModalDialog = (isOpen: boolean, onClose: () => void) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const opener = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const getFocusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])

    ;(getFocusable()[0] ?? dialog)?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = getFocusable()
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      opener?.focus?.()
    }
  }, [isOpen])

  return dialogRef
}
