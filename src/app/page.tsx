"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import StatuManga from "@/app/components/StatuManga"
import ActionManga from "@/app/components/ActionManga"
import RomanceManga from "@/app/components/RomanceManga"
import { useTheme } from "next-themes"

interface MangaImage { jpg: { large_image_url: string } }
interface Manga { mal_id: number; title: string; synopsis: string; rank: number; images?: MangaImage }

const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function SectionHeading({ index, title, description }: { index: string; title: string; description: string }) {
    return (
        <div className="flex items-end justify-between border-b kami-line pb-4 mb-8">
            <div className="flex items-end gap-5">
                <span className="text-xs tracking-[0.35em] text-[var(--kami-red)]">{index}</span>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--kami-muted)] mb-1">Collection</p>
                    <h2 className="kami-display text-4xl md:text-6xl font-semibold">{title}</h2>
                </div>
            </div>
            <p className="hidden md:block max-w-xs text-xs leading-5 text-[var(--kami-muted)] text-right">{description}</p>
        </div>
    )
}

export default function Home() {
    const [manga, setManga] = useState<Manga[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const { theme } = useTheme()

    useEffect(() => {
        async function fetchManga() {
            try {
                const response = await fetch("/api/manga")
                const data = await response.json()
                const ranked = data.data
                    .filter((item: Manga) => item.rank !== null && item.rank !== undefined)
                    .sort((a: Manga, b: Manga) => a.rank - b.rank)
                    .slice(0, 6)
                setManga(ranked)
            } catch (error) {
                console.error("Erreur lors du chargement des mangas :", error)
            } finally { setLoading(false) }
        }
        fetchManga()
    }, [])

    if (loading) {
        return <main className="kami-paper-texture min-h-screen flex items-center justify-center"><div className="text-center"><p className="kami-vertical text-xs tracking-[0.4em] text-[var(--kami-red)] mx-auto h-24">KAMI</p><div className="mt-5 h-px w-24 bg-[var(--kami-ink)] animate-pulse" /><p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[var(--kami-muted)]">Chargement</p></div></main>
    }

    const current = manga[currentIndex]
    const next = () => setCurrentIndex((i) => (i + 1) % manga.length)
    const previous = () => setCurrentIndex((i) => (i - 1 + manga.length) % manga.length)

    return (
        <main className={`kami-paper-texture min-h-screen ${theme === "dark" ? "dark" : ""}`}>
            <section className="relative min-h-[78vh] px-5 md:px-12 lg:px-20 py-10 flex items-center overflow-hidden">
                <div className="absolute left-5 top-10 kami-vertical text-[10px] tracking-[0.5em] text-[var(--kami-muted)]">MANGA / CULTURE / DISCOVERY</div>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 kami-vertical text-xs tracking-[0.35em] text-[var(--kami-red)]">漫画を読む</div>
                <div className="absolute left-0 bottom-0 w-full border-t kami-line" />
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center w-full max-w-7xl mx-auto">
                    <div className="kami-fade-up pt-10 md:pt-0">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--kami-red)] mb-7">01 — Édition du moment</p>
                        <h1 className="kami-display text-[18vw] lg:text-[10rem] leading-[0.78] font-semibold">KAMI<span className="text-[var(--kami-red)]">.</span></h1>
                        <p className="mt-8 max-w-md text-sm md:text-base leading-7 text-[var(--kami-muted)]">Une bibliothèque manga pensée comme une revue : découvrir, parcourir et retrouver les histoires qui méritent votre attention.</p>
                        <div className="mt-9 flex items-center gap-6"><Link href="/tri" className="kami-link text-xs uppercase tracking-[0.25em] font-semibold">Explorer la collection</Link><span className="h-px w-16 bg-[var(--kami-ink)]" /></div>
                    </div>
                    {current && (
                        <div className="relative kami-fade-up" style={{ animationDelay: "120ms" }}>
                            <Link href={`/card/${slugify(current.title)}`} className="group block relative aspect-[4/5] max-w-lg ml-auto overflow-hidden border kami-line bg-[var(--kami-paper-strong)]">
                                <Image src={current.images?.jpg?.large_image_url || "/placeholder.svg"} alt={current.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" priority />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute top-5 left-5 bg-[var(--kami-red)] text-white text-[9px] tracking-[0.3em] uppercase px-3 py-2">N° {String(current.rank).padStart(2, "0")}</div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                                    <p className="text-[9px] uppercase tracking-[0.35em] opacity-70 mb-2">Best-seller</p>
                                    <h2 className="kami-display text-3xl md:text-5xl leading-none">{current.title}</h2>
                                </div>
                            </Link>
                            <div className="flex justify-between items-center mt-5 max-w-lg ml-auto">
                                <span className="text-[10px] tracking-[0.2em] text-[var(--kami-muted)]">{String(currentIndex + 1).padStart(2, "0")} / {String(manga.length).padStart(2, "0")}</span>
                                <div className="flex gap-2"><button onClick={previous} aria-label="Manga précédent" className="border kami-line w-10 h-10 hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)] transition">←</button><button onClick={next} aria-label="Manga suivant" className="border kami-line w-10 h-10 hover:bg-[var(--kami-ink)] hover:text-[var(--kami-paper)] transition">→</button></div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="px-5 md:px-12 lg:px-20 py-20 md:py-28 max-w-7xl mx-auto">
                <SectionHeading index="02" title="Tendance" description="Les séries qui attirent actuellement le regard des lecteurs." />
                <div className="border-y kami-line py-4 mb-16 flex justify-between text-[9px] uppercase tracking-[0.3em] text-[var(--kami-muted)]"><span>Dernières découvertes</span><span>Popularité / 2026</span></div>
                <StatuManga />
            </section>

            <section className="px-5 md:px-12 lg:px-20 py-20 md:py-28 max-w-7xl mx-auto">
                <SectionHeading index="03" title="Action" description="Combat, aventure et énergie brute sélectionnés pour la collection KAMI." />
                <div className="flex justify-center"><ActionManga /></div>
            </section>

            <section className="px-5 md:px-12 lg:px-20 py-20 md:py-28 max-w-7xl mx-auto border-t kami-line">
                <SectionHeading index="04" title="Romance" description="Des histoires où les personnages et leurs liens occupent le premier plan." />
                <div className="flex justify-center"><RomanceManga /></div>
            </section>

            <section className="px-5 md:px-12 lg:px-20 py-20 max-w-7xl mx-auto border-t kami-line flex flex-col md:flex-row justify-between gap-8">
                <div><p className="text-[9px] uppercase tracking-[0.35em] text-[var(--kami-red)]">KAMI / 2026</p><p className="kami-display text-2xl mt-2">Lire. Découvrir. Recommencer.</p></div>
                <Link href="/tri" className="kami-link self-start text-xs uppercase tracking-[0.25em]">Voir tous les mangas →</Link>
            </section>
        </main>
    )
}
