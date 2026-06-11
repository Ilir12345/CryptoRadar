import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">◎</span>
        CryptoRadar
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>Markets</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
        <NavLink to="/guide">Guide</NavLink>
      </div>
    </nav>
  )
}
