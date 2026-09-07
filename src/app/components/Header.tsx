"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b kami-line bg-[var(--kami-paper)]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-4" onClick={() => setOpen(false)}>
          <span className="kami-display text-3xl font-bold tracking-[-.08em]">KAMI<span className="text-[var(--kami-red)]">.</span></span>
          <span className="hidden sm:block h-6 w-px bg-[var(--kami-line)]" />
          <span className="hidden sm:block text-[9px] uppercase tracking-[.3em] text-[var(--kami-muted)]">漫画案内所</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[.25em]">
          <Link href="/" className="kami-link">Accueil</Link>
          <Link href="/tri" className="kami-link">Mangas</Link>
          <Link href="/anime" className="kami-link">Anime</Link>
          <Link href="/favoris" className="kami-link">Favoris</Link>
        </nav>

        <button aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden text-xs uppercase tracking-[.2em]">
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t kami-line px-5 py-6 bg-[var(--kami-paper)]">
          <div className="grid gap-5 text-xs uppercase tracking-[.25em]">
            <Link href="/" onClick={() => setOpen(false)}>Accueil</Link>
            <Link href="/tri" onClick={() => setOpen(false)}>Mangas</Link>
            <Link href="/anime" onClick={() => setOpen(false)}>Anime</Link>
            <Link href="/favoris" onClick={() => setOpen(false)}>Favoris</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
