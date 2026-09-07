import Link from "next/link"

const links = [
  { href: "/", label: "Accueil", jp: "ホーム" },
  { href: "/tri", label: "Mangas", jp: "漫画" },
  { href: "/anime", label: "Anime", jp: "アニメ" },
  { href: "/favoris", label: "Favoris", jp: "お気に入り" },
]

export default function Footer() {
  return (
    <footer className="border-t kami-line bg-[var(--kami-paper)] text-[var(--kami-ink)]">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:py-16">
          <div>
            <div className="flex items-start gap-4">
              <div>
                <p className="kami-display text-5xl font-bold tracking-[-.09em] leading-none">
                  KAMI<span className="text-[var(--kami-red)]">.</span>
                </p>
                <p className="mt-3 text-[8px] uppercase tracking-[.34em] text-[var(--kami-muted)]">
                  Manga / Anime
                </p>
              </div>
              <span className="kami-vertical border-l kami-line pl-3 text-[9px] tracking-[.2em] text-[var(--kami-muted)]">
                漫画案内所
              </span>
            </div>
            <p className="mt-7 max-w-sm text-sm leading-6 text-[var(--kami-muted)]">
              Une bibliothèque éditoriale dédiée aux mangas et anime, pensée pour découvrir de nouvelles œuvres.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[8px] uppercase tracking-[.32em] text-[var(--kami-red)]">01 / Navigation</p>
            <div className="border-t kami-line">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between border-b kami-line py-3 transition hover:px-2"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[8px] text-[var(--kami-muted)]">0{index + 1}</span>
                    <span className="text-[10px] uppercase tracking-[.2em]">{link.label}</span>
                  </span>
                  <span className="text-[9px] text-[var(--kami-muted)] transition group-hover:text-[var(--kami-red)]">{link.jp}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[8px] uppercase tracking-[.32em] text-[var(--kami-red)]">02 / Réseaux</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Facebook", "https://facebook.com"],
                ["Instagram", "https://instagram.com"],
                ["GitHub", "https://github.com"],
                ["Twitter", "https://twitter.com"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border kami-line px-3 py-4 text-[8px] uppercase tracking-[.18em] transition hover:border-[var(--kami-ink)] hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)]"
                >
                  {label} ↗
                </a>
              ))}
            </div>
            <p className="mt-5 text-[8px] leading-5 tracking-[.12em] text-[var(--kami-muted)]">
              漫画 · アニメ · 発見
              <br />
              Discover something new.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t kami-line py-5 text-[7px] uppercase tracking-[.28em] text-[var(--kami-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>KAMI. — Édition 2026 · Bruxelles</span>
          <span>漫画案内所 / Manga &amp; Anime</span>
        </div>
      </div>
    </footer>
  )
}
