"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"

type Anime = { mal_id: number; title: string; synopsis: string; images: { jpg: { large_image_url: string } }; genres: { name: string }[]; episodes: number; year: number }
const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function AnimePage() {
  const [animes, setAnimes] = useState<Anime[]>([]), [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState(""), [search, setSearch] = useState(""), [currentPage, setCurrentPage] = useState(1), [currentIndex, setCurrentIndex] = useState(0)
  const perPage = 18
  useEffect(() => { fetch("/api/anime").then(r => r.json()).then(d => setAnimes(d.data || [])).catch(console.error).finally(() => setLoading(false)) }, [])
  const filtered = useMemo(() => animes.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) && (genre === "" || a.genres.some(g => g.name.toLowerCase().includes(genre.toLowerCase())))), [animes, search, genre])
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage)), current = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
  const featured = animes.slice(currentIndex, currentIndex + 3)
  const next = () => setCurrentIndex(i => (i + 3) % Math.max(1, animes.length))
  const previous = () => setCurrentIndex(i => (i - 3 + animes.length) % Math.max(1, animes.length))

  if (loading) return <main className="kami-paper-texture min-h-screen px-5 py-24"><div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-5">{Array.from({length: 6}).map((_, i) => <div key={i} className="aspect-[3/4] bg-[var(--kami-paper-strong)] animate-pulse" />)}</div></main>

  return <main className="kami-paper-texture min-h-screen">
    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 pt-12 md:pt-20 pb-16">
      <div className="flex items-end justify-between border-b kami-line pb-5"><div><p className="text-[9px] uppercase tracking-[.4em] text-[var(--kami-red)]">Animation / 06</p><h1 className="kami-display text-6xl md:text-8xl mt-3">Anime</h1></div><span className="kami-vertical hidden md:block text-[10px] tracking-[.35em] text-[var(--kami-muted)]">アニメ案内</span></div>
      <div className="grid lg:grid-cols-[1fr_auto] gap-8 mt-10 items-end"><p className="max-w-xl text-sm leading-7 text-[var(--kami-muted)]">Les adaptations animées à découvrir, présentées dans le même langage éditorial que la collection manga.</p><div className="flex gap-2"><button onClick={previous} aria-label="Anime précédents" className="border kami-line w-10 h-10">←</button><button onClick={next} aria-label="Anime suivants" className="border kami-line w-10 h-10">→</button></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">{featured.map((anime, i) => <Link key={anime.mal_id} href={`/anime/${generateSlug(anime.title)}`} className="group relative aspect-[3/4] overflow-hidden border kami-line"><Image src={anime.images.jpg.large_image_url} alt={anime.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><span className="absolute top-3 left-3 bg-[var(--kami-red)] text-white px-2 py-1 text-[8px] tracking-[.25em]">0{i + 1}</span><div className="absolute bottom-0 p-5 text-white"><p className="text-[8px] uppercase tracking-[.3em] opacity-70">Sélection anime</p><h2 className="kami-display text-2xl md:text-3xl mt-1 leading-none">{anime.title}</h2></div></Link>)}</div>
    </section>

    <section className="border-y kami-line bg-[var(--kami-paper-strong)]"><div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-10"><div className="grid sm:grid-cols-2 gap-px border kami-line bg-[var(--kami-line)]"><label className="bg-[var(--kami-paper-strong)] p-4"><span className="block text-[8px] uppercase tracking-[.25em] text-[var(--kami-muted)] mb-2">Titre</span><input value={search} onChange={e => {setSearch(e.target.value); setCurrentPage(1)}} placeholder="Rechercher un anime…" className="w-full bg-transparent outline-none text-sm" /></label><label className="bg-[var(--kami-paper-strong)] p-4"><span className="block text-[8px] uppercase tracking-[.25em] text-[var(--kami-muted)] mb-2">Genre</span><input value={genre} onChange={e => {setGenre(e.target.value); setCurrentPage(1)}} placeholder="Action, romance…" className="w-full bg-transparent outline-none text-sm" /></label></div><p className="mt-4 text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]">{filtered.length} anime{filtered.length > 1 ? "s" : ""} dans la sélection</p></div></section>

    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-16"><div className="flex items-end justify-between border-b kami-line pb-4 mb-8"><div><p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">07 / Catalogue</p><h2 className="kami-display text-4xl md:text-5xl mt-2">Toutes les séries</h2></div><span className="hidden md:block text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]">{String(filtered.length).padStart(2,"0")} résultats</span></div>{current.length ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-10">{current.map((anime, i) => <Link key={anime.mal_id} href={`/anime/${generateSlug(anime.title)}`} className="group"><div className="relative aspect-[3/4] overflow-hidden border kami-line bg-[var(--kami-paper-strong)]"><Image src={anime.images.jpg.large_image_url} alt={anime.title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" /></div><h3 className="kami-display text-xl mt-3 leading-tight">{anime.title}</h3><p className="text-[8px] uppercase tracking-[.2em] text-[var(--kami-muted)] mt-2">{anime.year || "—"} · {anime.episodes || "—"} épisodes</p></Link>)}</div> : <div className="border-y kami-line py-20 text-center"><h3 className="kami-display text-4xl">Aucun anime trouvé</h3><p className="text-xs text-[var(--kami-muted)] mt-3">Essayez un autre terme.</p></div>}<div className="mt-16 border-t kami-line pt-5 flex justify-between"><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="kami-link text-[9px] uppercase tracking-[.25em] disabled:opacity-30">← Précédent</button><span className="text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]">{String(currentPage).padStart(2,"0")} / {String(totalPages).padStart(2,"0")}</span><button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} className="kami-link text-[9px] uppercase tracking-[.25em] disabled:opacity-30">Suivant →</button></div></section>
  </main>
}
