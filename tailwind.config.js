/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // One blue family, light-to-dark. No warm accents so nothing clashes.
        ink: "#0E1B2C",
        paper: "#F6F8FB",
        steel: "#3E6B8F",
        slate: "#4A5568",
        mist: "#E3E9F0",
        night: "#070D18",
        graphite: "#172538",
        ocean: "#5C9DC9",
        tide: "#8FC3E3",
        frost: "#EEF3F8",   // tinted panels / hover fills
        line: "#DCE3EA",    // cool hairline borders
        fog: "#8A96A6",     // muted text on light
        // Legacy names kept as blues so nothing falls back to a warm colour
        brass: "#5C9DC9",
        clay: "#3E6B8F",
        sand: "#8FC3E3",
      },
      fontFamily: {
        // One family everywhere: display, body and code share Plus Jakarta Sans so type stays uniform.
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fl-xs': 'var(--fs-xs)',
        'fl-sm': 'var(--fs-sm)',
        'fl-base': 'var(--fs-base)',
        'fl-lg': 'var(--fs-lg)',
        'fl-xl': 'var(--fs-xl)',
        'fl-2xl': 'var(--fs-2xl)',
        'fl-3xl': 'var(--fs-3xl)',
        'fl-4xl': 'var(--fs-4xl)',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section)',
      },
      maxWidth: { site: '1320px' },
      boxShadow: {
        glow: '0 0 0 1px rgba(143,195,227,.18), 0 24px 60px -28px rgba(92,157,201,.55)',
        lift: '0 14px 34px -20px rgba(14,27,44,.35)',
        card: '0 1px 0 rgba(255,255,255,.04) inset, 0 30px 80px -40px rgba(0,0,0,.8)',
        modal: '0 40px 120px -30px rgba(7,13,24,.7)',
        float: '0 30px 70px -30px rgba(14,27,44,.35), 0 0 0 1px rgba(14,27,44,.04)',
      },
      transitionTimingFunction: { smooth: 'cubic-bezier(.2,.7,.3,1)' },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        drift: { '0%': { transform: 'translate3d(0,0,0)' }, '100%': { transform: 'translate3d(-3%,1.5%,0)' } },
        pop: { from: { opacity: '0', transform: 'translateY(22px) scale(.985)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        float: { '0%,100%': { transform: 'translate3d(0,0,0) rotate(0deg)' }, '50%': { transform: 'translate3d(0,-10px,0) rotate(-.4deg)' } },
        floatAlt: { '0%,100%': { transform: 'translate3d(0,0,0) rotate(0deg)' }, '50%': { transform: 'translate3d(0,8px,0) rotate(.4deg)' } },
        draw: { to: { strokeDashoffset: '0' } },
        grow: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        orbit: { '0%': { transform: 'translate3d(0,0,0) scale(1)' }, '33%': { transform: 'translate3d(4%,-6%,0) scale(1.06)' }, '66%': { transform: 'translate3d(-5%,3%,0) scale(.97)' }, '100%': { transform: 'translate3d(0,0,0) scale(1)' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.2,.7,.3,1) both',
        fade: 'fade .45s ease both',
        drift: 'drift 26s ease-in-out infinite alternate',
        pop: 'pop .42s cubic-bezier(.2,.7,.3,1) both',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-alt': 'floatAlt 8.5s ease-in-out infinite',
        blink: 'blink 1.1s steps(1) infinite',
        orbit: 'orbit 28s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
