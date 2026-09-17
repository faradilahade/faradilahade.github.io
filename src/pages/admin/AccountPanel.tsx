import { useState, FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { site } from '../../lib/site'
import { IconCheck, IconLogout } from '../../components/Icons'

type Props = { email: string; onSignOut: () => void }

export default function AccountPanel({ email, onSignOut }: Props) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const username = email.endsWith(`@${site.adminEmailDomain}`) ? email.slice(0, -(site.adminEmailDomain.length + 1)) : email

  async function changePassword(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setErr('')
    if (pw.length < 8) { setErr('Use at least 8 characters.'); return }
    if (pw !== pw2) { setErr('The two passwords do not match.'); return }
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) setErr(error.message)
    else { setMsg('Password updated. Use it next time you sign in.'); setPw(''); setPw2('') }
  }

  const field = 'w-full border border-line rounded-lg px-3 py-2 bg-white text-ink focus:border-steel outline-none'

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <section className="bg-white border border-line rounded-2xl p-6">
        <h3 className="font-bold uppercase tracking-tight text-fl-sm">Account</h3>
        <dl className="mt-4 space-y-3 text-fl-sm">
          <div><dt className="label-caps">Username</dt><dd className="mt-0.5 font-mono">{username}</dd></div>
          <div><dt className="label-caps">Sign-in email</dt><dd className="mt-0.5 font-mono break-all">{email}</dd></div>
          <div><dt className="label-caps">Role</dt><dd className="mt-0.5">Administrator — can create, edit, translate, publish and delete projects and files.</dd></div>
        </dl>
        <button type="button" onClick={onSignOut} className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line text-[11px] font-semibold uppercase tracking-[.12em] text-slate hover:border-steel hover:text-ink"><IconLogout size={14} /> Sign out</button>
      </section>

      <section className="bg-white border border-line rounded-2xl p-6">
        <h3 className="font-bold uppercase tracking-tight text-fl-sm">Change password</h3>
        <p className="mt-2 text-fl-xs text-slate">Recommended after the first sign-in, and whenever the password has been shared or written down.</p>
        <form onSubmit={changePassword} className="mt-4 space-y-3">
          <div><label className="label-caps block mb-1">New password</label><input type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} className={field} /></div>
          <div><label className="label-caps block mb-1">Repeat new password</label><input type="password" autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} className={field} /></div>
          {err && <p className="text-fl-xs text-red-700">{err}</p>}
          {msg && <p className="text-fl-xs text-steel inline-flex items-center gap-1.5"><IconCheck size={13} /> {msg}</p>}
          <button type="submit" disabled={busy} className="px-4 py-2.5 rounded-lg bg-ink text-paper text-[11px] font-semibold uppercase tracking-[.12em] hover:bg-steel disabled:opacity-50">{busy ? 'Saving…' : 'Update password'}</button>
        </form>
      </section>
    </div>
  )
}
