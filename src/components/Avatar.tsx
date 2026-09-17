import { useState } from 'react'
import { site, asset } from '../lib/site'

/**
 * Shows public/avatar.jpg when present; otherwise a monogram on a brass ring.
 * Nothing breaks if the photo has not been added yet.
 */
export default function Avatar({ className = '', size = 128 }: { className?: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = site.name.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div
      className={`relative rounded-full p-[3px] bg-gradient-to-br from-brass via-sand to-ocean shadow-glow ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-graphite ring-4 ring-night flex items-center justify-center">
        {!failed ? (
          <img
            src={asset(site.avatar)}
            alt={`${site.name} portrait`}
            width={size}
            height={size}
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-display text-paper select-none" style={{ fontSize: size * 0.36 }} aria-label={site.name}>
            {initials}
          </span>
        )}
      </div>
    </div>
  )
}
