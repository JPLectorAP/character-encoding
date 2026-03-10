import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <div className="scanline" />

      <header>
        <h1>ENCODING EXPLORER</h1>
        <p>// CHARACTER ENCODING INTERACTIVE LAB — APWT IT ESSENTIALS //</p>
      </header>

      <nav className="tabs">
        <NavLink to="/encode" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          1. TEKST → BYTES
        </NavLink>
        <NavLink to="/ascii" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          2. ASCII TABEL
        </NavLink>
        <NavLink to="/mojibake" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          3. MOJIBAKE
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          4. QUIZ
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  )
}
