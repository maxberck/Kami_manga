"use client"

import Image from "next/image"
import Link from "next/link"

interface Manga {
  mal_id: number
  title: string
  images?: { jpg?: { large_image_url?: string } }
  rank?: number
  score?: number
  type?: string
  chapters?: number
  status?: string
}

interface Props {
  manga: Manga[]
}

const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function StatuManga({ manga }: Props) {
  const selection = manga.slice(0, 3)

  return (
    <div className="border-y kami-line">
      <div className="grid md:grid-cols-[1.25fr_.75fr]">
        <div className="p-6 md:p-8 lg:p-10 border-b md:border-b-0 md:border-r kami-line">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">Sélection / 01</p>
              <h3 className="kami-display text-4xl md:text-5xl mt-2">Sélection du moment</h3>
            </div>
            <span className="kami-vertical text-[9px] tracking-[.3em] text-[var(--kami-muted)]">今月の一冊</span>
          </div>

          {selection.length > 0 ? (
            <div className="mt-8 grid grid-cols-3 gap-3 md:gap-5">
              {selection.map((item, index) => (
                <Link key={item.mal_id} href={`/card/${slugify(item.title)}`} className="group min-w-0">
                  <div className="relative aspect-[3/4] overflow-hidden border kami-line bg-[var(--kami-paper-strong)]">
                    <Image src={item.images?.jpg?.large_image_url || "/placeholder.svg"} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-2 top-2 bg-[var(--kami-red)] px-2 py-1 text-[8px] tracking-[.15em] text-white">0{index + 1}</span>
                  </div>
                  <p className="mt-3 text-[10px] font-semibold leading-4 line-clamp-2 group-hover:text-[var(--kami-red)] transition">{item.title}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[.18em] text-[var(--kami-muted)]">{item.score ? `${item.score} / 10` : "À découvrir"}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 border kami-line p-8 text-center text-[10px] uppercase tracking-[.25em] text-[var(--kami-muted)]">La sélection arrive bientôt.</div>
          )}
        </div>

        <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between min-h-[260px]">
          <div>
            <p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-muted)]">Édition temporaire</p>
            <p className="kami-display text-2xl md:text-3xl mt-3">À lire maintenant.</p>
            <p className="mt-3 text-xs leading-5 text-[var(--kami-muted)]">Trois titres choisis parmi les meilleures positions de notre sélection manga.</p>
          </div>
          <Link href="/tri" className="kami-link mt-8 self-start text-[9px] uppercase tracking-[.25em]">Explorer tous les titres →</Link>
        </div>
      </div>
    </div>
  )
}
