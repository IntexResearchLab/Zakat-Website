type InitialsAvatarProps = {
  name: string
  className?: string
  variant?: 'cover' | 'circle'
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

function InitialsAvatar({ name, className = '', variant = 'cover' }: InitialsAvatarProps) {
  const initials = getInitials(name)

  if (variant === 'circle') {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center bg-[linear-gradient(135deg,#115b82,#1a7fb0)] font-serif font-semibold text-white ${className}`}
      >
        {initials}
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-[radial-gradient(circle_at_top,#eef7fb,#d7e6ef)] ${className}`}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#115b82,#1a7fb0)] font-serif text-3xl font-semibold text-white shadow-[0_12px_30px_rgba(15,91,130,0.25)] sm:h-28 sm:w-28 sm:text-4xl">
        {initials}
      </div>
    </div>
  )
}

export default InitialsAvatar
