"use client"
import Image from "next/image"
import { useEffect, useState, use } from "react"
import Link from "next/link"
import {useTheme} from "next-themes";

const prices = [5.99, 7.49, 9.99, 12.99, 14.99]
const getFixedPrice = (id: number) => prices[id % prices.length]
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}


export default function MangaDetails({ params }: { params: Promise<{ slug: string }> }) {
    const unwrappedParams = use(params)
    const { slug } = unwrappedParams
    const { theme } = useTheme();
    const [manga, setManga] = useState<any[]>([])
    const [mangaHaz, setMangaHaz] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function fetchManga() {
            try {
                const resp = await fetch("/api/manga")
                const data = await resp.json()
                setManga(data.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchManga()
    }, [])

    // générer un manga au hasard
    useEffect(() => {
        if (manga.length > 0) {
            // créer une copie du tableau
            const mangaCopy = [...manga]

            for (let i = mangaCopy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[mangaCopy[i], mangaCopy[j]] = [mangaCopy[j], mangaCopy[i]]
            }
            // prendre les 5 premier
            setMangaHaz(mangaCopy.slice(0, 5))
        }
    }, [manga])

    // trouver le bon manga avec le slug
    const findManga = manga.find((manga: any) => {
        const mangaSlug = generateSlug(manga.title)
        return mangaSlug === slug
    })

    if (loading) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mx-auto"/>
                    <h2 className={`${theme === "dark" ? "text-white" : "text-zinc-900"} mt-4 text-xl`}>Chargement...</h2>
                    <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                        Préparation des détails du manga
                    </p>
                </div>
            </div>
        )
    }

    if (!findManga) {
        return (
            <main className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Manga pas trouvé</div>
            </main>
        )
    }

    return (
        <main className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <section
                className="flex flex-col md:flex-row justify-evenly gap-5 w-full items-center pb-10 pt-5 px-4 md:px-0">
                <div className="w-full md:flex-1 flex justify-center">
                    <Image
                        key={findManga.mal_id}
                        src={findManga.images.jpg.large_image_url || "/placeholder.svg"}
                        width={400}
                        height={400}
                        className="h-auto md:h-[84vh] w-full md:w-auto max-w-[300px] md:max-w-none border-[#111111] border-2"
                        alt={findManga.title}
                    />
                </div>
                <div className="w-full md:flex-1 flex flex-col justify-center mt-6 md:mt-0">
                    <h1 className="text-4xl md:text-8xl font-black">{findManga.title}</h1>
                    <p className="w-full md:w-[80%] pt-5 text-base md:text-lg font-medium">{findManga.synopsis}</p>
                    <div className="flex gap-2 flex-wrap pt-5">
                        {findManga.genres?.map((genre: any) => (
                            <button
                                key={genre.mal_id}
                                className={`rounded-full border-2 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base text-black hover:bg-black hover:text-white ${theme === 'dark'? 'text-white hover:bg-[bg-gray-800] hover:text-white border-[white]' : 'text-black hover:bg-black hover:text-white border-[black]' }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <section className={"flex flex-col md:flex-row"}>
                <div
                    className={`bg-black h-auto md:h-[25vh] w-full md:w-[25%] flex text-left pl-[6%] justify-center flex-col py-4 md:py-0`}
                >
                    <p className={`text-white text-lg md:text-xl`}>STATUS&nbsp;&nbsp; {findManga.status}</p>
                    <p className={`text-white text-lg md:text-xl`}>&nbsp;&nbsp;GENRE&nbsp;&nbsp; {findManga.genres?.[0]?.name}</p>
                    <p className={`text-white text-lg md:text-xl`}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DATE&nbsp;&nbsp; {findManga.published?.prop?.from?.year}
                    </p>
                </div>
                <div className={`bg-red-300 h-auto md:h-[25vh] w-full flex flex-col p-4 md:p-2 md:pl-[10%] justify-center`}>
                    <h1 className={`font-black text-4xl md:text-7xl mb-3 md:mb-5`}>L&#39;AUTEUR</h1>
                    <div className={`flex gap-10 md:gap-20`}>
                        <div>
                            <p className={`text-base md:text-lg font-black`}>dessin</p>
                            <p className={`text-xl md:text-3xl font-black`}>{findManga.authors?.[0]?.name}</p>
                        </div>
                        <div>
                            <p className={`text-base md:text-lg font-black`}>scénario</p>
                            <p className={`text-xl md:text-3xl font-black`}>{findManga.authors?.[0]?.name}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={`flex justify-center w-full py-8 md:py-12`}>
                <div className={`flex flex-wrap justify-center md:justify-between w-full md:w-[90%] px-4 md:px-0`}>
                    {mangaHaz.length > 0 ? (
                        mangaHaz.map((manga) => (
                            <div key={manga.mal_id} className="w-[280px]">
                                <Link href={`/card/${generateSlug(manga.title)}`} className="text-blue-500">
                                    <Image
                                        src={manga.images.jpg.large_image_url || "/placeholder.svg"}
                                        alt={manga.title}
                                        width={250}
                                        height={375}
                                        className="rounded-md w-[280px] h-[400px] object-cover"
                                    />
                                </Link>
                                <p className="mt-2 text-lg font-semibold">{manga.title.substring(0, 31) || "Inconnu"}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">Loading related manga...</div>
                    )}
                </div>
            </section>
        </main>
    )
}

