import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav('/admin/dashboard')
    })
  }, [nav])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else nav('/admin/dashboard')
  }

  return (
    <section className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-slate">Manage your portfolio content.</p>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-slate mb-1" htmlFor="email">Email</label>
          <input
            id="email" type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-mist rounded-md px-3 py-2 bg-white focus:border-steel"
          />
        </div>
        <div>
          <label className="block text-sm text-slate mb-1" htmlFor="password">Password</label>
          <input
            id="password" type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-mist rounded-md px-3 py-2 bg-white focus:border-steel"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full bg-ink text-paper py-2.5 rounded-md hover:bg-steel transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
