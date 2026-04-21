import { NavLink } from 'react-router-dom'

function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'border-b-[3px] border-[#115b82] pb-2 text-[0.98rem] font-semibold text-[#115b82]'
      : 'pb-2 text-[0.98rem] font-medium text-[#587189]'

  return (
    <header className="border-b border-[#c5d8e5] bg-[#f7fcff] px-8 py-3 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <NavLink
          className="font-serif text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-[#115b82]"
          to="/"
        >
          Alokayon
        </NavLink>

        <nav className="hidden items-center gap-11 md:flex">
          <NavLink className={linkClass} to="/">
            Home
          </NavLink>
          <NavLink className={linkClass} to="/about">
            About
          </NavLink>
          <a className="pb-2 text-[0.98rem] font-medium text-[#587189]" href="#">
            Programs
          </a>
          <a className="pb-2 text-[0.98rem] font-medium text-[#587189]" href="#">
            Transparency
          </a>
        </nav>

        <button className="rounded-full bg-[#115b82] px-8 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0c4c6d]">
          Donate
        </button>
      </div>
    </header>
  )
}

export default Header
