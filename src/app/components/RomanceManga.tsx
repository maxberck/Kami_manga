"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import MangaEditorialCard from "./MangaEditorialCard"

interface Manga { mal_id: number; title: string; images: { jpg: { large_image_url: string } }; rank: number; genres: Array<{ name: string }> }
const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function RomanceManga() {
  const [mangas, setMangas] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch("/api/manga").then((res) => res.json()).then((data) => {
      const items = Array.isArray(data.data) ? data.data.filter((m: Manga) => m.genres?.some((g) => g.name === "Romance")).sort((a: Manga, b: Manga) => a.rank - b.rank).slice(0, 6) : []
      setMangas(items)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])
  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full animate-pulse"><div className="aspect-[3/4] bg-[var(--kami-paper-strong)]" /><div className="aspect-[3/4] bg-[var(--kami-paper-strong)]" /><div className="hidden md:block aspect-[3/4] bg-[var(--kami-paper-strong)]" /></div>
  return <div className="w-full"><div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10">{mangas.map((manga, index) => <MangaEditorialCard key={manga.mal_id} title={manga.title} image={manga.images?.jpg?.large_image_url} rank={index + 1} href={`/card/${generateSlug(manga.title)}`} eyebrow="Romance / Sélection" />)}</div><div className="mt-10 text-right"><Link href="/tri" className="kami-link text-[10px] uppercase tracking-[.25em]">Toute la sélection →</Link></div></div>
}
