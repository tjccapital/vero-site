"use client"

import { useCallback, useEffect } from "react"

// The consumer layout puts its main column inside a <main> with its own
// overflow, so window.scrollY is always 0 — browser scroll restoration
// can't help. This hook saves <main>.scrollTop to sessionStorage on
// demand (call the returned saveScroll() before navigating away) and
// replays it once `ready` flips true (typically once the page's data
// has loaded so the scroller has enough height to scroll into).
//
// The saved value is consumed once and removed, so a later unrelated
// visit to the page doesn't get yanked back to a stale position.
export function useMainScrollRestore(key: string, ready: boolean) {
  useEffect(() => {
    if (!ready) return
    if (typeof window === "undefined") return
    const saved = sessionStorage.getItem(key)
    if (saved == null) return
    sessionStorage.removeItem(key)
    const top = Number(saved)
    if (!Number.isFinite(top)) return
    const scroller = document.querySelector("main")
    if (scroller) scroller.scrollTop = top
  }, [key, ready])

  const saveScroll = useCallback(() => {
    if (typeof window === "undefined") return
    const scroller = document.querySelector("main")
    if (scroller) sessionStorage.setItem(key, String(scroller.scrollTop))
  }, [key])

  return saveScroll
}
