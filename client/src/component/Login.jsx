import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const fieldErrors = {}

    if (!form.email.trim()) {
      fieldErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      fieldErrors.email = 'Enter a valid email'
    }

    if (!form.password) {
      fieldErrors.password = 'Password is required'
    } else if (form.password.length < 5) {
      fieldErrors.password = 'Password must be at least 5 characters'
    }

    return fieldErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const fieldErrors = validate()
    setErrors(fieldErrors)

    if (Object.keys(fieldErrors).length === 0) {
      navigate('/freedash')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Log in to your account</h1>
          <p className="mt-3 text-sm text-slate-600">Enter your credentials to continue to the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter email"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter password"
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </label>

          <button
            type="submit"
            className="w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New user?{' '}
          <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
