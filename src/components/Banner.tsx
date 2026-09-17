/**
 * Profile banner: soft "data bands" drawn in SVG — a quiet nod to the
 * Behance references without shipping a heavy image. Drifts very slowly;
 * motion is disabled for users who prefer reduced motion.
 */
export default function Banner({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-night grain ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_10%,rgba(92,157,201,.28),transparent_55%),radial-gradient(90%_80%_at_10%_90%,rgba(176,141,74,.18),transparent_60%)]" />
      <svg
        className="absolute inset-0 w-full h-full animate-drift [animation-duration:32s]"
        viewBox="0 0 1600 420"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bandA" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8FC3E3" stopOpacity="0" />
            <stop offset=".35" stopColor="#8FC3E3" stopOpacity=".9" />
            <stop offset=".7" stopColor="#5C9DC9" stopOpacity=".8" />
            <stop offset="1" stopColor="#5C9DC9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bandB" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#B08D4A" stopOpacity="0" />
            <stop offset=".5" stopColor="#D8CBAE" stopOpacity=".7" />
            <stop offset="1" stopColor="#B08D4A" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="glowSoft" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* blurred halo bands */}
        <g filter="url(#glow)" opacity=".55">
          <path d="M-100 260 C 200 160, 420 360, 720 250 S 1200 120, 1700 230" stroke="url(#bandA)" strokeWidth="26" fill="none" />
          <path d="M-100 330 C 260 250, 520 420, 860 320 S 1300 200, 1700 300" stroke="url(#bandB)" strokeWidth="18" fill="none" />
        </g>
        {/* crisp bands */}
        <g filter="url(#glowSoft)" strokeLinecap="round" fill="none">
          <path d="M-100 260 C 200 160, 420 360, 720 250 S 1200 120, 1700 230" stroke="url(#bandA)" strokeWidth="2.5" />
          <path d="M-100 290 C 230 200, 470 380, 780 285 S 1240 160, 1700 262" stroke="url(#bandA)" strokeWidth="1.2" opacity=".7" />
          <path d="M-100 330 C 260 250, 520 420, 860 320 S 1300 200, 1700 300" stroke="url(#bandB)" strokeWidth="1.6" opacity=".8" />
          <path d="M-100 120 C 300 60, 600 200, 900 130 S 1350 20, 1700 90" stroke="url(#bandA)" strokeWidth="1" opacity=".35" />
        </g>
        {/* scattered data points */}
        <g fill="#8FC3E3" opacity=".7">
          {[
            [140, 262, 1.8], [380, 300, 1.2], [620, 262, 2.2], [910, 208, 1.4], [1130, 176, 2.6], [1390, 200, 1.5],
            [260, 120, 1.1], [760, 150, 1.6], [1210, 70, 1.3], [1480, 300, 2], [520, 356, 1.1], [1020, 300, 1.2],
          ].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-night" />
    </div>
  )
}
