"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "favorite_publication_ids" 

function readFavoriteIds(): Set<string> {
  if (typeof window === "undefined") return new Set<string>()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set<string>()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set<string>()
  }
}

function writeFavoriteIds(ids: Set<string>) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
    window.dispatchEvent(new CustomEvent("favorites:changed"))
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => readFavoriteIds())

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds])

  const setFavorite = useCallback((id: string, shouldBeFavorite: boolean) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (shouldBeFavorite) next.add(id)
      else next.delete(id)
      writeFavoriteIds(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      writeFavoriteIds(next)
      return next
    })
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavoriteIds(readFavoriteIds())
    }
    const onCustom = () => setFavoriteIds(readFavoriteIds())
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage)
      window.addEventListener("favorites:changed", onCustom as EventListener)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", onStorage)
        window.removeEventListener("favorites:changed", onCustom as EventListener)
      }
    }
  }, [])

  return useMemo(() => ({ favoriteIds, isFavorite, toggleFavorite, setFavorite }), [favoriteIds, isFavorite, toggleFavorite, setFavorite])
}


