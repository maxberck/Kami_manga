"use client"

import Image from "next/image"
import { useEffect, useState, use } from "react"
import Link from "next/link"

interface Manga {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  synopsis?: string
  status?: string
  genres?: Array<{ mal_id: number; name: string }>
  authors?: Array<{ name: string }>
  published?: { prop?: { from?: { year?: number } } }
  rank?: number
}

const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function MangaDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [manga, setManga] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/manga").then((res) => res.json()).then((data) => setManga(data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  const findManga = manga.find((item) => generateSlug(item.title) === slug)
  const related = manga.filter((item) => item.mal_id !== findManga?.mal_id).sort(() => Math.random() - 0.5).slice(0, 4)

  if (loading) return <main className="kami-paper-texture min-h-screen flex items-center justify-center"><div className="text-center"><span className="kami-vertical text-xs tracking-[.4em] text-[var(--kami-red)]">KAMI</span><p className="mt-5 text-[10px] uppercase tracking-[.3em] text-[var(--kami-muted)]">Chargement de la fiche</p></div></main>

  if (!findManga) return <main className="kami-paper-texture min-h-screen flex items-center justify-center px-6"><div className="text-center"><p className="text-[9px] uppercase tracking-[.4em] text-[var(--kami-red)]">Erreur 404</p><h1 className="kami-display text-5xl mt-3">Manga introuvable</h1><Link href="/tri" className="kami-link inline-block mt-8 text-xs uppercase tracking-[.25em]">Retour à la collection</Link></div></main>

  return <main className="kami-paper-texture min-h-screen">
    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-12 md:py-20">
      <Link href="/tri" className="kami-link text-[9px] uppercase tracking-[.3em] text-[var(--kami-muted)]">← Collection</Link>
      <div className="grid lg:grid-cols-[minmax(280px,430px)_1fr] gap-10 lg:gap-20 mt-10 items-start">
        <div className="relative">
          <div className="absolute -left-5 top-5 hidden md:block kami-vertical text-[9px] tracking-[.3em] text-[var(--kami-red)]">作品 / {String(findManga.rank || findManga.mal_id).padStart(3, "0")}</div>
          <div className="relative aspect-[3/4] border kami-line overflow-hidden bg-[var(--kami-paper-strong)]">
            <Image src={findManga.images?.jpg?.large_image_url || "/placeholder.svg"} alt={findManga.title} fill priority className="object-cover" />
          </div>
        </div>
        <div className="pt-2 md:pt-8">
          <p className="text-[9px] uppercase tracking-[.4em] text-[var(--kami-red)]">Fiche / Manga</p>
          <h1 className="kami-display text-5xl md:text-7xl lg:text-8xl leading-[.88] mt-4 max-w-4xl">{findManga.title}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8 border-y kami-line py-4 text-[9px] uppercase tracking-[.2em] text-[var(--kami-muted)]">
            <span>{findManga.status || "Statut inconnu"}</span><span>•</span><span>{findManga.published?.prop?.from?.year || "—"}</span><span>•</span><span>Rang {findManga.rank || "—"}</span>
          </div>
          <p className="max-w-2xl mt-8 text-sm md:text-base leading-7 text-[var(--kami-muted)]">{findManga.synopsis || "Aucun synopsis disponible pour cette œuvre."}</p>
          <div className="mt-8 flex flex-wrap gap-2">{findManga.genres?.map((genre) => <span key={genre.mal_id} className="border kami-line px-3 py-2 text-[9px] uppercase tracking-[.18em]">{genre.name}</span>)}</div>
        </div>
      </div>
    </section>

    <section className="border-y kami-line bg-[var(--kami-paper-strong)]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">
        <div className="p-7 md:p-12 border-b md:border-b-0 md:border-r kami-line"><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">01 / Auteur</p><h2 className="kami-display text-4xl md:text-5xl mt-3">{findManga.authors?.[0]?.name || "Inconnu"}</h2><p className="text-[10px] uppercase tracking-[.2em] text-[var(--kami-muted)] mt-3">Créateur de l'œuvre</p></div>
        <div className="p-7 md:p-12"><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">02 / Informations</p><dl className="mt-5 grid grid-cols-2 gap-y-5 text-xs"><div><dt className="text-[9px] uppercase tracking-[.2em] text-[var(--kami-muted)]">Statut</dt><dd className="mt-1">{findManga.status || "—"}</dd></div><div><dt className="text-[9px] uppercase tracking-[.2em] text-[var(--kami-muted)]">Publication</dt><dd className="mt-1">{findManga.published?.prop?.from?.year || "—"}</dd></div><div><dt className="text-[9px] uppercase tracking-[.2em] text-[var(--kami-muted)]">Genre principal</dt><dd className="mt-1">{findManga.genres?.[0]?.name || "—"}</dd></div><div><dt className="text-[9px] uppercase tracking-[.2em] text-[var(--kami-muted)]">Identifiant</dt><dd className="mt-1">#{findManga.mal_id}</dd></div></dl></div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-16 md:py-24"><div className="flex items-end justify-between border-b kami-line pb-4 mb-8"><div><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">03 / À découvrir</p><h2 className="kami-display text-4xl md:text-5xl mt-2">Lectures voisines</h2></div><span className="hidden md:block text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]">Sélection KAMI</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{related.map((item) => <Link key={item.mal_id} href={`/card/${generateSlug(item.title)}`} className="group"><div className="relative aspect-[3/4] overflow-hidden border kami-line bg-[var(--kami-paper-strong)]"><Image src={item.images?.jpg?.large_image_url || "/placeholder.svg"} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" /></div><p className="kami-display text-xl mt-3 leading-tight">{item.title}</p><p className="text-[8px] uppercase tracking-[.2em] text-[var(--kami-muted)] mt-2">Découvrir →</p></Link>)}</div></section>
  </main>
}
