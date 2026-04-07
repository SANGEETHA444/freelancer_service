import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/freelancer/dashboard',     label: 'Dashboard' },
  { path: '/freelancer/view-projects', label: 'View Projects' },
  { path: '/freelancer/my-activity',   label: 'My Activity' },
  { path: '/freelancer/reviews',       label: 'My Reviews & Feedbacks' },
  { path: '/freelancer/profile',       label: 'Profile' },
]

function FreelancerDashboard() {
  const userName = localStorage.getItem('userName') || 'Freelancer'
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="t-shell">
      <aside className="t-sidebar">
        <div className="t-logo">
          <div className="t-logo-icon">
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="t-logo-text">FreeLance</span>
        </div>

        <nav className="t-nav">
          <div className="t-nav-section">Main Menu</div>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `t-nav-link${isActive ? ' active' : ''}`}>
              <span className="t-dot" />{item.label}
            </NavLink>
          ))}
          <div className="t-nav-section" style={{ marginTop: 8 }}>Account</div>
          <NavLink to="/freelancer/logout"
            className={({ isActive }) => `t-nav-link${isActive ? ' active' : ''}`}>
            <span className="t-dot" />Logout
          </NavLink>
        </nav>

        <div className="t-sidebar-foot">
          <div className="t-avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ fontSize: 11, color: 'rgba(34,197,94,0.55)' }}>Freelancer</div>
          </div>
        </div>
      </aside>

      <div className="t-main">
        <header className="t-topbar">
          <span className="t-topbar-title">Freelancer Portal</span>
          <div className="t-topbar-right">
            <div className="t-avatar">{initials}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-dark)' }}>{userName}</span>
          </div>
        </header>
        <main className="t-content"><Outlet /></main>
      </div>
    </div>
  )
}

export default FreelancerDashboard
