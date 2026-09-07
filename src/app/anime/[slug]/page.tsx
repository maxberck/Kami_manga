"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

type Anime = { mal_id: number; title: string; synopsis: string; images: { jpg: { large_image_url: string } }; genres: { name: string }[]; episodes: number; year: number }
const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function AnimeDetails() {
  const { slug } = useParams<{ slug: string }>()
  const [animes, setAnimes] = useState<Anime[]>([]), [loading, setLoading] = useState(true)
  useEffect(() => { if (!slug) return; fetch("/api/anime").then(r => r.json()).then(d => setAnimes(d.data || [])).catch(console.error).finally(() => setLoading(false)) }, [slug])
  const anime = animes.find(a => generateSlug(a.title) === slug)
  const related = animes.filter(a => a.mal_id !== anime?.mal_id).slice(0, 4)

  if (loading) return <main className="kami-paper-texture min-h-screen flex items-center justify-center"><div className="text-center"><span className="kami-vertical text-xs tracking-[.4em] text-[var(--kami-red)]">KAMI</span><p className="mt-5 text-[10px] uppercase tracking-[.3em] text-[var(--kami-muted)]">Chargement de la fiche</p></div></main>
  if (!anime) return <main className="kami-paper-texture min-h-screen flex items-center justify-center px-6"><div className="text-center"><p className="text-[9px] uppercase tracking-[.4em] text-[var(--kami-red)]">Erreur 404</p><h1 className="kami-display text-5xl mt-3">Anime introuvable</h1><Link href="/anime" className="kami-link inline-block mt-8 text-xs uppercase tracking-[.25em]">Retour aux anime</Link></div></main>

  return <main className="kami-paper-texture min-h-screen">
    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-12 md:py-20">
      <Link href="/anime" className="kami-link text-[9px] uppercase tracking-[.3em] text-[var(--kami-muted)]">← Catalogue anime</Link>
      <div className="grid lg:grid-cols-[minmax(280px,430px)_1fr] gap-10 lg:gap-20 mt-10 items-start">
        <div className="relative"><div className="absolute -left-5 top-5 hidden md:block kami-vertical text-[9px] tracking-[.3em] text-[var(--kami-red)]">作品 / {String(anime.mal_id).padStart(3,"0")}</div><div className="relative aspect-[3/4] border kami-line overflow-hidden bg-[var(--kami-paper-strong)]"><Image src={anime.images?.jpg?.large_image_url || "/placeholder.svg"} alt={anime.title} fill priority className="object-cover" /></div></div>
        <div className="pt-2 md:pt-8"><p className="text-[9px] uppercase tracking-[.4em] text-[var(--kami-red)]">Fiche / Anime</p><h1 className="kami-display text-5xl md:text-7xl lg:text-8xl leading-[.88] mt-4 max-w-4xl">{anime.title}</h1><div className="flex flex-wrap gap-x-5 gap-y-2 mt-8 border-y kami-line py-4 text-[9px] uppercase tracking-[.2em] text-[var(--kami-muted)]"><span>{anime.year || "Année inconnue"}</span><span>•</span><span>{anime.episodes || "—"} épisodes</span><span>•</span><span>Animation</span></div><p className="max-w-2xl mt-8 text-sm md:text-base leading-7 text-[var(--kami-muted)]">{anime.synopsis || "Aucun synopsis disponible pour cette œuvre."}</p><div className="mt-8 flex flex-wrap gap-2">{anime.genres?.map(g => <span key={g.name} className="border kami-line px-3 py-2 text-[9px] uppercase tracking-[.18em]">{g.name}</span>)}</div></div>
      </div>
    </section>
    <section className="border-y kami-line bg-[var(--kami-paper-strong)]"><div className="max-w-7xl mx-auto grid md:grid-cols-3"><div className="p-7 md:p-12 border-b md:border-b-0 md:border-r kami-line"><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">01 / Format</p><h2 className="kami-display text-4xl mt-3">Série animée</h2></div><div className="p-7 md:p-12 border-b md:border-b-0 md:border-r kami-line"><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">02 / Épisodes</p><h2 className="kami-display text-4xl mt-3">{anime.episodes || "—"}</h2></div><div className="p-7 md:p-12"><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">03 / Diffusion</p><h2 className="kami-display text-4xl mt-3">{anime.year || "—"}</h2></div></div></section>
    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-16 md:py-24"><div className="flex items-end justify-between border-b kami-line pb-4 mb-8"><div><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">04 / À découvrir</p><h2 className="kami-display text-4xl md:text-5xl mt-2">Autres séries</h2></div><span className="hidden md:block text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]">Sélection KAMI</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{related.map(item => <Link key={item.mal_id} href={`/anime/${generateSlug(item.title)}`} className="group"><div className="relative aspect-[3/4] overflow-hidden border kami-line"><Image src={item.images.jpg.large_image_url} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" /></div><h3 className="kami-display text-xl mt-3 leading-tight">{item.title}</h3><p className="text-[8px] uppercase tracking-[.2em] text-[var(--kami-muted)] mt-2">Voir la fiche →</p></Link>)}</div></section>
  </main>
}
