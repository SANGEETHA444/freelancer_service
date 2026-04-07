import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    role: 'freelancer',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const fieldErrors = {}

    if (!form.username.trim()) fieldErrors.username = 'Username is required'
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

    if (!form.confirm) {
      fieldErrors.confirm = 'Confirm password is required'
    } else if (form.password !== form.confirm) {
      fieldErrors.confirm = 'Passwords do not match'
    }

    if (!form.role) fieldErrors.role = 'Select a role'

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
      localStorage.setItem('userRole', form.role)
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign up for a new account</h1>
          <p className="mt-3 text-sm text-slate-600">Complete the form below and log in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter username"
            />
            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
          </label>

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

          <div className="grid gap-5 sm:grid-cols-2">
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

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Confirm password</span>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="Confirm password"
              />
              {errors.confirm && <p className="mt-2 text-sm text-red-600">{errors.confirm}</p>}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
            {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
          </label>

          <button
            type="submit"
            className="w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already a user?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
