"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import MangaEditorialCard from "@/app/components/MangaEditorialCard"

interface Manga { mal_id: number; title: string; images: { jpg: { large_image_url: string } }; authors?: { name: string }[]; genres?: { name: string }[]; themes?: { name: string }[]; rank?: number }
const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function MangaList() { return <Suspense fallback={<main className="kami-paper-texture min-h-screen flex items-center justify-center"><span className="kami-vertical text-xs tracking-[.4em] text-[var(--kami-red)]">KAMI</span></main>}><MangaListContent /></Suspense> }

function MangaListContent() {
  const [mangas, setMangas] = useState<Manga[]>([]), [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState(""), [themes, setThemes] = useState(""), [author, setAuthor] = useState(""), [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const mangasPerPage = 18

  useEffect(() => { fetch("/api/manga").then(r => r.json()).then(d => setMangas(d.data || [])).catch(console.error).finally(() => setLoading(false)) }, [])
  useEffect(() => { setSearch(searchQuery); setCurrentPage(1) }, [searchQuery])

  const filtered = useMemo(() => mangas.filter(m => {
    const title = m.title?.toLowerCase() || "", a = m.authors?.map(x => x.name).join(" ").toLowerCase() || "", g = m.genres?.map(x => x.name).join(" ").toLowerCase() || "", t = m.themes?.map(x => x.name).join(" ").toLowerCase() || ""
    return title.includes(search.toLowerCase()) && a.includes(author.toLowerCase()) && g.includes(genre.toLowerCase()) && t.includes(themes.toLowerCase())
  }), [mangas, search, author, genre, themes])
  const totalPages = Math.max(1, Math.ceil(filtered.length / mangasPerPage)), current = filtered.slice((currentPage - 1) * mangasPerPage, currentPage * mangasPerPage)

  if (loading) return <main className="kami-paper-texture min-h-screen px-5 py-24"><div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-[var(--kami-paper-strong)] animate-pulse" />)}</div></main>

  return <main className="kami-paper-texture min-h-screen">
    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 pt-12 md:pt-20 pb-10">
      <div className="flex items-end justify-between border-b kami-line pb-5"><div><p className="text-[9px] uppercase tracking-[.4em] text-[var(--kami-red)]">Collection / 05</p><h1 className="kami-display text-5xl md:text-7xl mt-3">Tous les mangas</h1></div><span className="kami-vertical hidden md:block text-[10px] tracking-[.35em] text-[var(--kami-muted)]">漫画一覧</span></div>
      <p className="max-w-2xl mt-6 text-sm leading-6 text-[var(--kami-muted)]">Parcourez la collection KAMI et trouvez votre prochaine lecture.</p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border kami-line bg-[var(--kami-line)]">
        {[['search','Titre',search,setSearch],['author','Auteur',author,setAuthor],['genre','Genre',genre,setGenre],['theme','Thème',themes,setThemes]].map(([key,label,value,setter]) => <label key={key as string} className="bg-[var(--kami-paper)] p-4"><span className="block text-[8px] uppercase tracking-[.25em] text-[var(--kami-muted)] mb-2">{label as string}</span><input value={value as string} onChange={e => { (setter as (v:string)=>void)(e.target.value); setCurrentPage(1) }} placeholder={`Rechercher ${String(label).toLowerCase()}…`} className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--kami-muted)]" /></label>)}
      </div>
      <div className="mt-5 flex justify-between text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]"><span>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>{searchQuery && <Link href="/tri" className="kami-link">Réinitialiser la recherche</Link>}</div>
    </section>

    <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 pb-20">
      {current.length ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-10">{current.map((m, i) => <MangaEditorialCard key={m.mal_id} title={m.title} image={m.images?.jpg?.large_image_url} rank={m.rank || (currentPage - 1) * mangasPerPage + i + 1} href={`/card/${generateSlug(m.title)}`} eyebrow={m.genres?.[0]?.name || "Manga"} />)}</div> : <div className="border-y kami-line py-20 text-center"><p className="kami-vertical text-[10px] tracking-[.4em] text-[var(--kami-red)] mx-auto h-20">見つかりません</p><h2 className="kami-display text-4xl mt-5">Aucun résultat</h2><p className="text-xs text-[var(--kami-muted)] mt-3">Essayez un autre terme de recherche.</p></div>}
      <div className="mt-16 border-t kami-line pt-5 flex items-center justify-between"><button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="kami-link text-[9px] uppercase tracking-[.25em] disabled:opacity-30">← Précédent</button><span className="text-[9px] uppercase tracking-[.25em] text-[var(--kami-muted)]">{String(currentPage).padStart(2,"0")} / {String(totalPages).padStart(2,"0")}</span><button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="kami-link text-[9px] uppercase tracking-[.25em] disabled:opacity-30">Suivant →</button></div>
    </section>
  </main>
}
