import { useEffect } from 'react'

/**
 * Adds `.is-visible` to every `.reveal` element once it scrolls into view.
 * Re-runs whenever `deps` change (e.g. after projects load) so new cards animate too.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'))
    if (els.length === 0) return
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
