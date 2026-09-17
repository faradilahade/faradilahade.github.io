import { useEffect } from 'react'

/**
 * Adds `.is-visible` to every `.reveal` element once it scrolls into view.
 * Re-runs whenever `deps` change and also watches the DOM, so cards that
 * appear later (tab switch, loaded data, translations) animate in as well.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'))
    if (!('IntersectionObserver' in window)) {
      pending().forEach(el => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 })
    const observeAll = () => pending().forEach(el => io.observe(el))
    observeAll()
    const mo = new MutationObserver(() => observeAll())
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
