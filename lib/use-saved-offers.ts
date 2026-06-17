"use client"

import { useCallback, useEffect, useState } from "react"

// Tracks which offers the user has saved. Persisted to localStorage so the
// homepage "Offers for you" section and the dedicated offers page agree, and
// the choice survives a reload. When offers move server-side this hook is the
// single place to swap in a POST /api/offers/{id}/save call.
//
// We read storage in an effect rather than a lazy useState initializer on
// purpose: this hook runs in client components that are still server-rendered,
// so a lazy initializer would read localStorage only on the client and produce
// a hydration mismatch. Reading after mount keeps SSR and the first client
// render in agreement (both start empty), hence the targeted lint disable.

const STORAGE_KEY = "vero:consumer:savedOffers"

export function useSavedOffers() {
  const [saved, setSaved] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    let ids: string[]
    try {
      ids = JSON.parse(raw) as string[]
    } catch {
      // Corrupt/unavailable storage — leave the set empty rather than crash.
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above: reading persisted state post-mount avoids a hydration mismatch
    setSaved(new Set(ids))
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
        } catch {
          // Ignore persistence failures; in-memory state still updates.
        }
      }
      return next
    })
  }, [])

  return { saved, toggleSave }
}
