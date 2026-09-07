"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function Dark() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const dark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Passer au mode clair" : "Passer au mode sombre"}
      className="group flex h-11 items-center gap-2 border kami-line px-3 text-[8px] uppercase tracking-[.18em] transition hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)]"
    >
      <span className="flex h-5 w-5 items-center justify-center border border-current">
        {dark ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.5 8.5 0 1111.2 3a6.8 6.8 0 009.8 9.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="3.5" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </span>
      <span className="hidden xl:inline">{dark ? "Dark" : "Light"}</span>
      <span className="text-[var(--kami-red)]">{dark ? "02" : "01"}</span>
    </button>
  )
}
