import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AF = { navy: '#1a1f2e', orange: '#e8a838', orangeDark: '#d4922a', bg: '#f0f2f8', border: '#e4e7f0', muted: '#6b7280' }

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', role: 'freelancer' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 6) e.password = 'Min 6 characters'
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Need uppercase, lowercase & number'
    if (!form.confirm) e.confirm = 'Required'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
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

  const inp = (name, err) => ({
    style: { width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${err ? '#ef4444' : AF.border}`, background: '#f8f9fc', fontSize: 14, color: AF.navy, outline: 'none' },
    onFocus: e => e.target.style.borderColor = AF.orange,
    onBlur: e => e.target.style.borderColor = err ? '#ef4444' : AF.border,
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Left panel */}
      <div style={{ width: '40%', background: AF.navy, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px' }} className="hidden lg:flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: AF.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>AgentForge</span>
        </div>
        <div>
          <h1 style={{ color: 'white', fontSize: 34, fontWeight: 800, lineHeight: 1.25, marginBottom: 14 }}>
            Start your journey<br /><span style={{ color: AF.orange }}>today for free</span>
          </h1>
          <p style={{ color: '#8b92a9', fontSize: 15, lineHeight: 1.7 }}>Join thousands of freelancers and clients building great things together.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['No hidden fees', 'Secure payments', 'Top-rated talent', 'Fast hiring'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(232,168,56,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" fill={AF.orange} viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              </div>
              <span style={{ color: '#b0b7c9', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: AF.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 460, paddingBlock: 32 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '36px 32px', boxShadow: '0 4px 24px rgba(26,31,46,0.08)', border: `1px solid ${AF.border}` }}>
            <p style={{ color: AF.orange, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Get started</p>
            <h2 style={{ color: AF.navy, fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create your account</h2>
            <p style={{ color: AF.muted, fontSize: 14, marginBottom: 24 }}>Fill in the details below to join AgentForge.</p>

            {apiError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 18, color: '#dc2626', fontSize: 13 }}>{apiError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['firstName', 'First Name', 'John'], ['lastName', 'Last Name', 'Doe']].map(([n, l, ph]) => (
                  <div key={n}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: AF.navy, marginBottom: 5 }}>{l}</label>
                    <input name={n} value={form[n]} onChange={handleChange} placeholder={ph} {...inp(n, errors[n])} />
                    {errors[n] && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 3 }}>{errors[n]}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: AF.navy, marginBottom: 5 }}>Email address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" {...inp('email', errors.email)} />
                {errors.email && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 3 }}>{errors.email}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['password', 'Password', 'password'], ['confirm', 'Confirm Password', 'password']].map(([n, l, t]) => (
                  <div key={n}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: AF.navy, marginBottom: 5 }}>{l}</label>
                    <input name={n} type={t} value={form[n]} onChange={handleChange} placeholder="••••••••" {...inp(n, errors[n])} />
                    {errors[n] && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 3 }}>{errors[n]}</p>}
                  </div>
                ))}
              </div>

              {/* Role selector */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: AF.navy, marginBottom: 8 }}>I am a…</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[['freelancer', 'Freelancer', 'Looking for work'], ['client', 'Client', 'Hiring talent']].map(([val, label, sub]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', border: `2px solid ${form.role === val ? AF.orange : AF.border}`, background: form.role === val ? 'rgba(232,168,56,0.06)' : '#f8f9fc', transition: 'all 0.15s' }}>
                      <input type="radio" name="role" value={val} checked={form.role === val} onChange={handleChange} style={{ display: 'none' }} />
                      <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${form.role === val ? AF.orange : '#c4c9d8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {form.role === val && <div style={{ width: 8, height: 8, borderRadius: '50%', background: AF.orange }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: AF.navy }}>{label}</div>
                        <div style={{ fontSize: 11, color: AF.muted }}>{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '12px', borderRadius: 10, background: loading ? '#f0c060' : AF.orange, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', marginTop: 4 }}
                onMouseEnter={e => { if (!loading) e.target.style.background = AF.orangeDark }}
                onMouseLeave={e => { if (!loading) e.target.style.background = AF.orange }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: AF.muted, marginTop: 18 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: AF.orange, fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
