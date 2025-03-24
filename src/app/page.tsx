"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import StatuManga from "@/app/components/StatuManga"
import ActionManga from "@/app/components/ActionManga"
import RomanceManga from "@/app/components/RomanceManga"
import { useTheme } from "next-themes"

// Define proper TypeScript interfaces
interface MangaImage {
    jpg: {
        large_image_url: string
    }
}

interface Manga {
    mal_id: number
    title: string
    synopsis: string
    rank: number
    images?: MangaImage
}
export default function Home() {
    const [manga, setManga] = useState<Manga[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
        }
        checkMobile()

        window.addEventListener("resize", checkMobile)

        return () => {
            window.removeEventListener("resize", checkMobile)
        }
    }, [])

    useEffect(() => {
        async function fetchManga() {
            try {
                const response = await fetch("/api/manga")
                const data = await response.json()

                console.log("Réponse l'API :", response)
                console.log("Données JSON :", data)

                // Properly typed filter and sort
                const rankManga = data.data
                    .filter((manga: Manga) => manga.rank !== null && manga.rank !== undefined)
                    .sort((a: Manga, b: Manga) => a.rank - b.rank)
                    .slice(0, 6)

                setManga(rankManga)
                console.log("Mangas rank :", rankManga)
            } catch (error) {
                console.error(`Erreur trouvé : ${error}`)
            } finally {
                setLoading(false)
            }
        }
        fetchManga()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="relative">
                    <div className="relative w-32 h-32">
                        <div
                            className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin"
                            style={{ animationDuration: "3s" }}
                        />
                        <div
                            className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#0ff] animate-spin"
                            style={{ animationDuration: "2s", animationDirection: "reverse" }}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm" />
                </div>
            </div>
        )
    }

    const cardCarousel = isMobile ? 1 : 3

    return (
        <main className={theme === "dark" ? "bg-gray-700 text-white" : "bg-[#f6f6f6] text-black"}>
            <section className={theme === "dark" ? "bg-gray-700" : "bg-[#f6f6f6]"}>
                <div className={`h-[40vh] w-[70%] md:w-[25%] relative ${theme === "dark" ? "bg-gray-800" : "bg-black"}`}>
                    <h1 className="text-3xl md:text-5xl font-black text-red-600 absolute md:left-[23%] left-[10%] bottom-[28%] transform scale-y-[1.75] tracking-tight">
                        BEST-SELLER
                    </h1>
                </div>
            </section>

            <section
                className={`flex w-full h-auto md:h-[80vh] justify-center pb-8 py-10 md:py-0 ${
                    theme === "dark" ? "bg-gray-700" : "bg-[#f6f6f6]"
                }`}
            >
                {manga.length > 0 && (
                    <div className="relative flex items-center justify-center gap-4 md:gap-15 bottom-15 px-4 md:px-0">
                        <button
                            onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? manga.length - 3 : prevIndex - 1))}
                            className="absolute left-0 md:left-[-50px] bg-black text-white p-2 rounded-full z-10 hover:bg-gray-800 transition-colors"
                            aria-label="Previous"
                        >
                            ◀
                        </button>

                        <button
                            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % (manga.length - 2))}
                            className="absolute right-0 md:right-[-50px] bg-black text-white p-2 rounded-full z-10 hover:bg-gray-800 transition-colors"
                            aria-label="Next"
                        >
                            ▶
                        </button>

                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            {manga.slice(currentIndex, currentIndex + cardCarousel).map((mangas) => {
                                const slug = mangas.title
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-|-$/g, "")
                                return (
                                    <Link key={mangas.mal_id} href={`/card/${slug}`}>
                                        <div
                                            className={`relative flex justify-center w-[300px] h-[450px] md:w-[450px] md:h-[700px] mx-auto md:mx-auto transition-transform hover:scale-[1.02] ${
                                                theme === "dark"
                                                    ? "shadow-[10px_10px_0px_3px_#1E2939] md:shadow-[20px_20px_0px_6px_#1E2939]"
                                                    : "shadow-[10px_10px_0px_3px_#000000] md:shadow-[20px_20px_0px_6px_#000000]"
                                            }`}
                                        >
                                            {mangas.images?.jpg?.large_image_url && (
                                                <Image
                                                    src={mangas.images.jpg.large_image_url || "/placeholder.svg"}
                                                    alt={mangas.title}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    priority={currentIndex === 0}
                                                />
                                            )}
                                            <div
                                                className={`absolute border-[black] border-2 w-[80%] h-[40%] bottom-[5%] left-[-5%] p-3 md:p-5 ${
                                                    theme === "dark" ? "bg-[#1E2939]" : "bg-white"
                                                }`}
                                            >
                                                <h2 className="text-3xl md:text-5xl font-black line-clamp-1">{mangas.title}</h2>
                                                <p className="text-xs md:text-lg w-[90%] pt-2 line-clamp-3 md:line-clamp-4">
                                                    {mangas.synopsis}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </section>

            <section
                className="h-[75vh] w-full bg-cover bg-center flex justify-center items-center gap-2 pb-8"
                style={{ backgroundImage: "url('/vague-rouge.jpeg')" }}
            >
                <StatuManga />
            </section>

            <section className="pt-45">
                <div
                    className={`relative flex items-center w-full h-[2vh] ${theme === "dark" ? "bg-gray-800" : "bg-[#111111]"}`}
                >
                    <div
                        className={`absolute h-[15vh] md:h-[25vh] w-[80%] flex items-center justify-center ${
                            theme === "dark" ? "bg-gray-800" : "bg-[#111111]"
                        }`}
                    >
                        <h2 className="text-4xl md:text-8xl font-black text-red-600 absolute transform scale-y-[2.5] scale-x-[1.5] tracking-tight right-[12%] bottom-3 drop-shadow-lg">
                            TENDANCE
                        </h2>
                    </div>
                </div>
            </section>

            <section className="flex flex-col w-full pt-[10vh] md:pt-[20vh] pb-[5vh] md:pb-[10vh]">
                <div>
                    <div className="pl-5 md:pl-20 overflow-hidden">
                        <h2
                            className={`text-3xl md:text-5xl font-black pl-[18%] md:pl-[15%] transform scale-y-[1.5] scale-x-[1.5] ${
                                theme === "dark" ? "text-white" : "text-[#2B3A67]"
                            }`}
                        >
                            ACTION
                        </h2>
                    </div>
                    <div
                        className={`text-sm md:text-md font-black transform text-right ${
                            theme === "dark" ? "text-white" : "text-[#2B3A67]"
                        }`}
                    >
                        <Link href="/tri">
                            <p className="text-right pr-[5%] md:pr-[10%] hover:underline">see more --- </p>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center px-4 md:px-0">
                    <ActionManga />
                </div>

                <div className="pt-5 md:pt-10 overflow-hidden">
                    <div className="pl-5 md:pl-20">
                        <h2
                            className={`text-3xl md:text-5xl font-black pl-[18%] md:pl-[15%] transform scale-y-[1.5] scale-x-[1.5] ${
                                theme === "dark" ? "text-white" : "text-[#2B3A67]"
                            }`}
                        >
                            ROMANCE
                        </h2>
                    </div>
                    <div
                        className={`text-sm md:text-md font-black transform text-right ${
                            theme === "dark" ? "text-white" : "text-[#2B3A67]"
                        }`}
                    >
                        <Link href="/tri">
                            <p className="text-right pr-[5%] md:pr-[10%] hover:underline">see more --- </p>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center px-4 md:px-0">
                    <RomanceManga />
                </div>
            </section>
        </main>
    )
}

