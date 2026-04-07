import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useSession()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: undefined }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fe = validate(); setErrors(fe)
    if (Object.keys(fe).length) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.message || 'Login failed'); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`)
      login(data.token, data.user.role, data.user.id, `${data.user.firstName} ${data.user.lastName}`)
      navigate(data.user.role === 'client' ? '/customer/dashboard' : '/freelancer/dashboard')
    } catch { setApiError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="t-auth-wrap">
      <div className="t-auth-card">
        <div className="t-auth-logo">
          <div className="t-auth-logo-icon">
            <svg width="18" height="18" fill="none" stroke="var(--green)" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="t-auth-logo-text">FreeLance</span>
        </div>
        <p className="t-auth-eyebrow">Welcome back</p>
        <h1 className="t-auth-title">Log in to your account</h1>
        <p className="t-auth-sub">Enter your credentials to continue to the dashboard.</p>

        {apiError && <div className="t-alert t-alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="t-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="Enter email" className={`t-input${errors.email ? ' err' : ''}`} />
            {errors.email && <p className="t-field-err">{errors.email}</p>}
          </div>
          <div>
            <label className="t-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Enter password" className={`t-input${errors.password ? ' err' : ''}`} />
            {errors.password && <p className="t-field-err">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="t-btn t-btn-primary t-btn-lg t-btn-full" style={{ marginTop: 4 }}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
          New user?{' '}
          <Link to="/signup" style={{ color: 'var(--green-dark)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login