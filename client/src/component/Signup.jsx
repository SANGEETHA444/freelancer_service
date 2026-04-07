import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', role: 'freelancer' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Need uppercase, lowercase & number'
    if (!form.confirm) e.confirm = 'Confirm password is required'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.role) e.role = 'Select a role'
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
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, role: form.role }),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.errors?.[0]?.message || data.message || 'Signup failed'); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', form.role)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`)
      navigate(form.role === 'client' ? '/customer/dashboard' : '/freelancer/dashboard')
    } catch { setApiError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="t-auth-wrap">
      <div className="t-auth-card" style={{ maxWidth: 500 }}>
        <div className="t-auth-logo">
          <div className="t-auth-logo-icon">
            <svg width="18" height="18" fill="none" stroke="var(--green)" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="t-auth-logo-text">FreeLance</span>
        </div>
        <p className="t-auth-eyebrow">Create account</p>
        <h1 className="t-auth-title">Sign up for a new account</h1>
        <p className="t-auth-sub">Complete the form below and log in to continue.</p>

        {apiError && <div className="t-alert t-alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="t-label">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={`t-input${errors.firstName ? ' err' : ''}`} />
              {errors.firstName && <p className="t-field-err">{errors.firstName}</p>}
            </div>
            <div>
              <label className="t-label">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={`t-input${errors.lastName ? ' err' : ''}`} />
              {errors.lastName && <p className="t-field-err">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="t-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" className={`t-input${errors.email ? ' err' : ''}`} />
            {errors.email && <p className="t-field-err">{errors.email}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="t-label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" className={`t-input${errors.password ? ' err' : ''}`} />
              {errors.password && <p className="t-field-err">{errors.password}</p>}
            </div>
            <div>
              <label className="t-label">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Confirm password" className={`t-input${errors.confirm ? ' err' : ''}`} />
              {errors.confirm && <p className="t-field-err">{errors.confirm}</p>}
            </div>
          </div>
          <div>
            <label className="t-label">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="t-select">
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
            {errors.role && <p className="t-field-err">{errors.role}</p>}
          </div>
          <button type="submit" disabled={loading} className="t-btn t-btn-primary t-btn-lg t-btn-full" style={{ marginTop: 4 }}>
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 18 }}>
          Already a user?{' '}
          <Link to="/login" style={{ color: 'var(--green-dark)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
