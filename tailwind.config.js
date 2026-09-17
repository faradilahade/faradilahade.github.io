/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette (unchanged)
        ink: "#0E1B2C",
        paper: "#FAF9F6",
        steel: "#3E6B8F",
        brass: "#B08D4A",
        slate: "#4A5568",
        mist: "#E7E4DC",
        // Blue family used for the light theme
        night: "#070D18",
        graphite: "#172538",
        ocean: "#5C9DC9",
        tide: "#8FC3E3",
        frost: "#EEF3F8",   // tinted panels / hover fills
        line: "#DCE3EA",    // cool hairline borders
        sand: "#D8CBAE",
        fog: "#8A96A6",     // muted text on light
        clay: "#C4785A",
      },
      fontFamily: {
        display: ['"Newsreader"', 'Georgia', 'serif'],
        body: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
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
        glow: '0 0 0 1px rgba(62,107,143,.15), 0 20px 50px -24px rgba(62,107,143,.45)',
        lift: '0 14px 34px -20px rgba(14,27,44,.35)',
        modal: '0 40px 120px -30px rgba(7,13,24,.7)',
      },
      transitionTimingFunction: { smooth: 'cubic-bezier(.2,.7,.3,1)' },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        drift: { '0%': { transform: 'translate3d(0,0,0)' }, '100%': { transform: 'translate3d(-3%,1.5%,0)' } },
        pop: { from: { opacity: '0', transform: 'translateY(22px) scale(.985)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.2,.7,.3,1) both',
        fade: 'fade .45s ease both',
        drift: 'drift 26s ease-in-out infinite alternate',
        pop: 'pop .42s cubic-bezier(.2,.7,.3,1) both',
      },
    },
  },
  plugins: [],
}
