"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/", label: "Accueil", jp: "首頁" },
  { href: "/tri", label: "Mangas", jp: "漫画" },
  { href: "/anime", label: "Anime", jp: "アニメ" },
  { href: "/favoris", label: "Favoris", jp: "お気に入り" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b kami-line bg-[var(--kami-paper)]/96 backdrop-blur-md">
      <div className="hidden md:flex h-7 items-center justify-between border-b kami-line px-10 text-[7px] uppercase tracking-[.32em] text-[var(--kami-muted)]">
        <span>KAMI — Manga &amp; Anime</span>
        <span className="flex items-center gap-3">
          <span className="h-1 w-1 rounded-full bg-[var(--kami-red)]" />
          Édition 2026 · Bruxelles
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 h-[82px] flex items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="kami-display text-[2.15rem] font-bold tracking-[-.1em] leading-none">
            KAMI<span className="text-[var(--kami-red)]">.</span>
          </span>
          <span className="h-9 w-px bg-[var(--kami-line)]" />
          <span className="hidden sm:flex flex-col leading-none gap-1.5">
            <span className="text-[9px] uppercase tracking-[.34em] text-[var(--kami-ink)]">
              Manga / Anime
            </span>
            <span className="text-[8px] tracking-[.2em] text-[var(--kami-muted)]">
              漫画案内所
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex h-full items-center gap-0 border-l kami-line">
          {links.map((link, index) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex h-full min-w-[106px] items-center justify-center border-r kami-line px-4 transition duration-200 hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)] ${
                  active ? "bg-[var(--kami-ink)] text-[var(--kami-paper)]" : ""
                }`}
              >
                <span className="absolute left-3 top-3 text-[7px] tracking-[.1em] opacity-40">
                  0{index + 1}
                </span>
                <span className="flex flex-col items-center gap-1 leading-none">
                  <span className="text-[9px] uppercase tracking-[.2em]">{link.label}</span>
                  <span className="text-[8px] opacity-40 group-hover:opacity-70">{link.jp}</span>
                </span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--kami-red)]" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3 pl-2">
          <span className="text-[7px] uppercase tracking-[.3em] text-[var(--kami-muted)] [writing-mode:vertical-rl]">
            作品を探す
          </span>
          <span className="h-8 w-8 border kami-line flex items-center justify-center text-[10px]">
            ↗
          </span>
        </div>

        <button
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center gap-2 text-[9px] uppercase tracking-[.25em]"
        >
          <span className="text-[var(--kami-red)]">{open ? "×" : "01"}</span>
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t kami-line bg-[var(--kami-paper)]">
          <div className="flex items-end justify-between px-5 py-4 text-[8px] uppercase tracking-[.3em] text-[var(--kami-muted)]">
            <span>Navigation / 案内</span>
            <span className="kami-vertical text-[9px] text-[var(--kami-red)]">漫画案内所</span>
          </div>
          <div className="border-t kami-line">
            {links.map((link, index) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center justify-between px-5 py-5 border-b kami-line transition hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)] ${
                    active ? "bg-[var(--kami-ink)] text-[var(--kami-paper)]" : ""
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[9px] text-[var(--kami-red)]">0{index + 1}</span>
                    <span className="text-xs uppercase tracking-[.22em]">{link.label}</span>
                  </span>
                  <span className="text-[10px] opacity-40">{link.jp}</span>
                  {active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--kami-red)]" />}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center justify-between px-5 py-4 text-[7px] uppercase tracking-[.28em] text-[var(--kami-muted)]">
            <span>KAMI. · 2026</span>
            <span>漫画 / アニメ</span>
          </div>
        </nav>
      )}
    </header>
  )
}
