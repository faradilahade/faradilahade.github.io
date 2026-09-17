import { useEffect, useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { site } from '../../lib/site'
import { useSeo } from '../../lib/seo'
import { IconEye, IconArrowLeft, IconUser } from '../../components/Icons'

/** "admin-fara" → "admin-fara@<adminEmailDomain>"; a full email is used as typed. */
export function usernameToEmail(input: string): string {
  const v = input.trim().toLowerCase()
  if (!v) return ''
  return v.includes('@') ? v : `${v}@${site.adminEmailDomain}`
}

function friendly(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Username or password is incorrect. The admin user must exist in Supabase → Authentication → Users (see supabase/admin-user.sql).'
  if (m.includes('email not confirmed')) return 'This user is not confirmed yet. In Supabase → Authentication → Users open it and confirm the email.'
  if (m.includes('invalid path')) return 'The Supabase URL is wrong: it must be the project URL (https://xxxx.supabase.co) without /rest/v1/.'
  if (m.includes('failed to fetch') || m.includes('networkerror')) return 'Could not reach Supabase. Check the project URL and your connection.'
  return msg
}

export default function Login() {
  const nav = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
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
      const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(user), password })
      if (error) setError(friendly(error.message))
      else nav('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(friendly(err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  const field = 'w-full border border-line rounded-lg px-3.5 py-2.5 bg-white text-ink focus:border-steel outline-none transition-colors'

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col">
      <div className="px-gutter h-14 flex items-center justify-between border-b border-line bg-white/70 backdrop-blur">
        <Link to="/" className="font-bold uppercase tracking-tight text-fl-base">{site.name}<span className="text-ocean">.</span> <span className="text-fog font-medium normal-case tracking-normal">· Admin</span></Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-slate hover:text-ink"><IconArrowLeft size={14} /> View site</Link>
      </div>

      <section className="flex-1 flex items-center justify-center px-gutter py-12">
        <div className="w-full max-w-sm">
          <div className="w-12 h-12 rounded-full bg-ink text-paper flex items-center justify-center mb-5"><IconUser size={22} /></div>
          <h1 className="h-display text-fl-2xl">Sign in</h1>
          <p className="mt-2 text-fl-sm text-slate">Manage your portfolio: add, edit, translate and publish work.</p>

          {!supabaseConfigured && (
            <p className="mt-6 rounded-lg border border-steel/40 bg-steel/10 text-ink text-fl-sm p-4 leading-relaxed">
              Supabase is not configured for this build. Set <code className="font-mono text-[12px]">VITE_SUPABASE_URL</code> and <code className="font-mono text-[12px]">VITE_SUPABASE_ANON_KEY</code> (GitHub → Settings → Secrets) and redeploy.
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-4 bg-white border border-line rounded-2xl p-6 shadow-sm">
            <div>
              <label className="label-caps block mb-1.5" htmlFor="user">Username or email</label>
              <input id="user" type="text" required autoComplete="username" autoCapitalize="none" spellCheck={false} value={user} onChange={e => setUser(e.target.value)} className={field} placeholder="admin-fara" />
              {user && !user.includes('@') && (
                <p className="mt-1.5 text-[11px] text-fog">Signs in as <span className="font-mono">{usernameToEmail(user)}</span></p>
              )}
            </div>
            <div>
              <label className="label-caps block mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" type={show ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={`${field} pr-11`} />
                <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center ${show ? 'text-steel' : 'text-fog'} hover:text-ink`}>
                  <IconEye size={16} />
                </button>
              </div>
            </div>
            {error && <p className="text-fl-sm text-red-700 leading-relaxed" role="alert">{error}</p>}
            <button type="submit" disabled={loading || !supabaseConfigured} className="w-full bg-ink text-paper py-3 rounded-lg text-[11px] font-semibold uppercase tracking-[.16em] hover:bg-steel transition-colors disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-[11px] text-fog leading-relaxed">
            First time? Create the admin user once in Supabase (Authentication → Users, or run <span className="font-mono">supabase/admin-user.sql</span>). Username <span className="font-mono">admin-fara</span> maps to <span className="font-mono">admin-fara@{site.adminEmailDomain}</span>.
          </p>
        </div>
      </section>
    </main>
  )
}
