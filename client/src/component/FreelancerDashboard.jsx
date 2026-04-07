import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/freedash', label: 'Dashboard' },
  { path: '/freeviewprojects', label: 'View Projects' },
  { path: '/freemyactivity', label: 'My Activity' },
  { path: '/freereviews', label: 'My Reviews & Feedbacks' },
  { path: '/freeprofile', label: 'Profile' },
  { path: '/logout', label: 'Logout' },
]

function FreelancerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <nav className="flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/15'
                      : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mt-6">
          <section className="rounded-[32px] bg-white p-6 shadow-xl shadow-slate-200/50">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}

export default FreelancerDashboard
