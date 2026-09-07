"use client"

import Link from "next/link"
import { useState } from "react"

const links = [
  { href: "/", label: "Accueil", jp: "首頁" },
  { href: "/tri", label: "Mangas", jp: "漫画" },
  { href: "/anime", label: "Anime", jp: "アニメ" },
  { href: "/favoris", label: "Favoris", jp: "お気に入り" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b kami-line bg-[var(--kami-paper)]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-[76px] flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="kami-display text-[2rem] font-bold tracking-[-.09em] leading-none">KAMI<span className="text-[var(--kami-red)]">.</span></span>
          <span className="h-8 w-px bg-[var(--kami-line)]" />
          <span className="hidden sm:flex flex-col leading-none gap-1">
            <span className="text-[9px] uppercase tracking-[.32em] text-[var(--kami-ink)]">Manga / Anime</span>
            <span className="text-[8px] tracking-[.18em] text-[var(--kami-muted)]">漫画案内所</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 border border-[var(--kami-line)] px-1.5 py-1.5">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative flex items-center gap-2 px-4 py-2.5 text-[9px] uppercase tracking-[.22em] transition hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)]"
            >
              <span className="text-[8px] opacity-40">0{index + 1}</span>
              <span>{link.label}</span>
              <span className="hidden lg:inline text-[9px] opacity-40 group-hover:opacity-70">{link.jp}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--kami-red)]" />
          <span className="text-[8px] uppercase tracking-[.28em] text-[var(--kami-muted)]">Édition 2026</span>
        </div>

        <button aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden flex items-center gap-2 text-[9px] uppercase tracking-[.25em]">
          <span className="text-[var(--kami-red)]">{open ? "×" : "01"}</span>
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t kami-line bg-[var(--kami-paper)]">
          <div className="px-5 py-4 text-[8px] uppercase tracking-[.3em] text-[var(--kami-muted)]">Navigation / 案内</div>
          <div className="border-t kami-line">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex items-center justify-between px-5 py-5 border-b kami-line hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)] transition">
                <span className="flex items-center gap-4"><span className="text-[9px] text-[var(--kami-red)]">0{index + 1}</span><span className="text-xs uppercase tracking-[.22em]">{link.label}</span></span>
                <span className="text-[10px] opacity-40">{link.jp}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
