import { useEffect, useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { useLang } from '../../contexts/LanguageContext'
import { useSeo } from '../../lib/seo'

function friendly(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email or password is incorrect. Check the user you created under Supabase → Authentication → Users.'
  if (m.includes('email not confirmed')) return 'This email is not confirmed yet. In Supabase → Authentication → Users, open the user and confirm the email (or disable "Confirm email" in Auth settings).'
  if (m.includes('invalid path')) return 'The Supabase URL is wrong: it must be the project URL (https://xxxx.supabase.co) without /rest/v1/.'
  if (m.includes('failed to fetch') || m.includes('networkerror')) return 'Could not reach Supabase. Check the project URL and your connection.'
  return msg
}

export default function Login() {
  const nav = useNavigate()
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useSeo({ title: 'Admin sign in', description: 'Portfolio admin', noindex: true })

  useEffect(() => {
    if (!supabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav('/admin/dashboard', { replace: true })
    })
  }, [nav])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) setError(friendly(error.message))
      else nav('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(friendly(err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  const field = 'w-full border border-mist rounded-lg px-3.5 py-2.5 bg-white text-ink focus:border-steel outline-none transition-colors'

  return (
    <section className="page-enter max-w-sm mx-auto px-gutter py-section">
      <h1 className="font-display text-fl-2xl text-ink">Admin sign in</h1>
      <p className="mt-2 text-fl-sm text-slate">Manage your portfolio content.</p>

      {!supabaseConfigured && (
        <p className="mt-6 rounded-lg border border-brass/40 bg-brass/10 text-ink text-fl-sm p-4 leading-relaxed">
          {t('admin.notConfigured')}
        </p>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <div>
          <label className="block text-fl-sm text-slate mb-1.5" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className={field} />
        </div>
        <div>
          <label className="block text-fl-sm text-slate mb-1.5" htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={field} />
        </div>
        {error && <p className="text-fl-sm text-red-700 leading-relaxed" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={loading || !supabaseConfigured}
          className="w-full bg-ink text-paper py-2.5 rounded-lg hover:bg-steel transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
