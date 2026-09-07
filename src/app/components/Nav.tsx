"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Dark from "@/app/components/Dark"

interface CartItem {
  quantity: number
}

const links = [
  { href: "/", label: "Accueil", jp: "ホーム", number: "01" },
  { href: "/anime", label: "Anime", jp: "アニメ", number: "02" },
  { href: "/tri", label: "Manga", jp: "漫画", number: "03" },
  { href: "/favoris", label: "Favoris", jp: "お気に入り", number: "04" },
]

export default function Nav() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLogin, setIsLogin] = useState(false)
  const [search, setSearch] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const loadState = () => {
    setIsLogin(localStorage.getItem("isLogin") === "true")

    const savedCart = localStorage.getItem("cart")
    if (!savedCart) {
      setCart([])
      return
    }

    try {
      const parsed = JSON.parse(savedCart)
      setCart(Array.isArray(parsed) ? parsed : [])
    } catch {
      setCart([])
    }
  }

  useEffect(() => {
    loadState()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "isLogin" || event.key === "cart") loadState()
    }

    const handleLocalStorageChange = () => loadState()

    window.addEventListener("storage", handleStorage)
    window.addEventListener("localStorageChange", handleLocalStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("localStorageChange", handleLocalStorageChange)
    }
  }, [])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = search.trim()
    if (!query) return
    router.push(`/tri?query=${encodeURIComponent(query)}`)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLogin")
    setIsLogin(false)
    window.dispatchEvent(new Event("localStorageChange"))
  }

  const itemCount = cart.reduce((total, item) => total + (item.quantity || 0), 0)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b kami-line bg-[var(--kami-paper)]/95 backdrop-blur-xl">
      <div className="hidden lg:flex h-7 items-center justify-between border-b kami-line px-8 xl:px-12 text-[7px] uppercase tracking-[.32em] text-[var(--kami-muted)]">
        <span>KAMI — Manga &amp; Anime</span>
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-[var(--kami-red)]" />
          <span>Édition 2026 · Bruxelles</span>
          <span className="opacity-40">/</span>
          <span>漫画案内所</span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="relative flex h-14 w-14 items-center justify-center border-2 border-[var(--kami-ink)] bg-[var(--kami-ink)] text-[var(--kami-paper)] transition-transform duration-200 group-hover:-translate-y-0.5">
            <span className="kami-display text-xl font-black tracking-[-.08em]">K</span>
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 bg-[var(--kami-red)]" />
          </div>
          <div className="hidden sm:block leading-none">
            <div className="kami-display text-[2rem] font-black tracking-[-.09em]">
              KAMI<span className="text-[var(--kami-red)]">.</span>
            </div>
            <div className="mt-1 text-[7px] uppercase tracking-[.34em] text-[var(--kami-muted)]">
              Manga / Anime
            </div>
          </div>
        </Link>

        <div className="hidden lg:block h-10 w-px bg-[var(--kami-line)]" />

        <nav className="hidden lg:flex self-stretch items-center">
          {links.map((link) => {
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex h-[58px] min-w-[100px] flex-col justify-center border-r kami-line px-5 transition-all duration-200 ${
                  active
                    ? "bg-[var(--kami-ink)] text-[var(--kami-paper)]"
                    : "hover:bg-[var(--kami-wash)]"
                }`}
              >
                <span className={`absolute left-2 top-2 text-[7px] tracking-[.1em] ${active ? "text-[var(--kami-red)]" : "text-[var(--kami-muted)]"}`}>
                  {link.number}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[.19em]">
                  {link.label}
                </span>
                <span className={`mt-1 text-[8px] ${active ? "opacity-60" : "text-[var(--kami-muted)]"}`}>
                  {link.jp}
                </span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--kami-red)] transition-all duration-200 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                <span className={`absolute right-2 top-2 text-[8px] transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                  ↗
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block flex-1" />

        <form onSubmit={handleSearch} className="hidden md:flex min-w-0 flex-1 max-w-[310px] lg:max-w-[250px] xl:max-w-[310px]">
          <label className="relative flex w-full items-center border kami-line bg-[var(--kami-wash)] transition-colors focus-within:border-[var(--kami-ink)] focus-within:bg-[var(--kami-paper)]">
            <span className="pointer-events-none flex h-11 w-10 items-center justify-center border-r kami-line text-[var(--kami-muted)]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[10px] tracking-[.06em] text-[var(--kami-ink)] outline-none placeholder:text-[var(--kami-muted)]"
              placeholder="Rechercher un manga..."
              aria-label="Rechercher un manga"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mr-1 flex h-8 w-8 items-center justify-center text-[var(--kami-muted)] hover:text-[var(--kami-red)]"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
            <button
              type="submit"
              className="mr-1 hidden xl:flex h-8 items-center border-l kami-line px-3 text-[7px] font-semibold uppercase tracking-[.18em] transition-colors hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)]"
            >
              OK
            </button>
          </label>
        </form>

        <div className="hidden md:flex items-center gap-1 border-l kami-line pl-3">
          <Link
            href="/cart"
            aria-label={`Panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`}
            className="group relative flex h-11 w-11 items-center justify-center border kami-line transition-colors hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 5h2l2.2 10.5h9.9L20 8H7" />
              <circle cx="10" cy="19" r="1" />
              <circle cx="17" cy="19" r="1" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-[var(--kami-red)] px-1 text-[7px] font-bold text-white">
              {itemCount}
            </span>
          </Link>

          {isLogin ? (
            <button
              onClick={handleLogout}
              className="flex h-11 items-center gap-2 border kami-line px-3 text-[8px] font-semibold uppercase tracking-[.16em] transition-colors hover:border-[var(--kami-red)] hover:bg-[var(--kami-red)] hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--kami-red)]" />
              Sortir
            </button>
          ) : (
            <Link
              href="/login"
              className="flex h-11 items-center gap-2 border kami-line px-3 text-[8px] font-semibold uppercase tracking-[.16em] transition-colors hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)]"
            >
              <span className="text-[var(--kami-red)]">+</span>
              Connexion
            </Link>
          )}

          <Dark />
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          className="ml-auto flex h-11 items-center gap-2 border kami-line px-3 text-[8px] font-semibold uppercase tracking-[.2em] md:hidden"
        >
          <span className="text-[var(--kami-red)]">{isMenuOpen ? "×" : "01"}</span>
          {isMenuOpen ? "Fermer" : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t kami-line bg-[var(--kami-paper)] md:hidden">
          <form onSubmit={handleSearch} className="border-b kami-line p-4">
            <label className="flex items-center border kami-line bg-[var(--kami-wash)]">
              <span className="flex h-12 w-11 items-center justify-center border-r kami-line text-[var(--kami-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 5 5" />
                </svg>
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 flex-1 bg-transparent px-3 text-[10px] outline-none placeholder:text-[var(--kami-muted)]"
                placeholder="Rechercher un manga..."
                aria-label="Rechercher un manga"
              />
              <button type="submit" className="h-10 mr-1 bg-[var(--kami-ink)] px-4 text-[8px] uppercase tracking-[.16em] text-[var(--kami-paper)]">
                Chercher
              </button>
            </label>
          </form>

          <div className="px-4 py-3 text-[7px] uppercase tracking-[.3em] text-[var(--kami-muted)]">
            Navigation / 案内
          </div>

          {links.map((link) => {
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`relative flex items-center justify-between border-t kami-line px-5 py-5 ${active ? "bg-[var(--kami-ink)] text-[var(--kami-paper)]" : "hover:bg-[var(--kami-wash)]"}`}
              >
                <span className="flex items-center gap-4">
                  <span className="text-[8px] text-[var(--kami-red)]">{link.number}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[.2em]">{link.label}</span>
                </span>
                <span className="text-[10px] opacity-50">{link.jp}</span>
                {active && <span className="absolute left-0 top-0 h-full w-0.5 bg-[var(--kami-red)]" />}
              </Link>
            )
          })}

          <div className="flex items-center gap-2 border-t kami-line p-4">
            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex h-11 flex-1 items-center justify-center gap-2 border kami-line text-[8px] uppercase tracking-[.15em]">
              Panier <span className="text-[var(--kami-red)]">{itemCount}</span>
            </Link>
            {isLogin ? (
              <button onClick={handleLogout} className="h-11 flex-1 border kami-line text-[8px] uppercase tracking-[.15em]">
                Déconnexion
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex h-11 flex-1 items-center justify-center border kami-line text-[8px] uppercase tracking-[.15em]">
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
