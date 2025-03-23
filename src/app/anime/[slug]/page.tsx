'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"

// Définition des types pour les animes
type Anime = {
    mal_id: number
    title: string
    synopsis: string
    images: {
        jpg: { large_image_url: string }
    }
    genres: { name: string }[]
    episodes: number
    year: number
}

// fonction pour générer un slug et retrouver le nom de la même manière
const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function AnimeDetails() {
    const { theme } = useTheme()
    const { slug } = useParams()
    const [anime, setAnime] = useState<Anime | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return

        async function fetchAnime() {
            try {
                const res = await fetch("http://localhost:3000/api/anime")
                const data = await res.json()
                // recherche une correspondence
                const animeData = data.data.find((anime: Anime) => generateSlug(anime.title) === slug)
                setAnime(animeData || null)
            } catch (error) {
                console.error("Erreur dans l'API :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnime()
    }, [slug])

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mx-auto" />
                    <h2 className={`${theme === "dark" ? "text-white" : "text-zinc-900"} mt-4 text-xl`}>Chargement...</h2>
                    <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                        Préparation des détails de l'anime
                    </p>
                </div>
            </div>
        )
    }

    if (!anime) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}
            >
                <div
                    className={`max-w-md w-full text-center p-8 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
                >
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold mb-4">Anime non trouvé</h2>
                    <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Nous n'avons pas pu trouver l'anime que vous recherchez.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        )
    }

    return (
        <main
            className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"} p-4 md:p-6`}
        >
            <div
                className={`max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
                <section className="flex flex-col md:flex-row p-4 md:p-6">
                    <div className="w-full md:w-auto flex justify-center md:justify-start mb-6 md:mb-0">
                        <div className="relative w-64 h-96 md:w-72 md:h-108 shadow-md rounded-md overflow-hidden border-2 border-red-500">
                            <Image
                                src={anime.images.jpg.large_image_url || "/placeholder.svg"}
                                alt={anime.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="md:ml-8 flex-1">
                        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-red-500">{anime.title}</h1>

                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2 mt-3 mb-4">
                                {anime.genres.map((genre) => (
                                    <span key={genre.name} className={`px-3 py-1 rounded-full text-sm ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                                        {genre.name}
                                      </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                <div className={`p-3 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                                  <span className={`font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
                                    Épisodes:
                                  </span>{" "}
                                    <span className="font-bold">{anime.episodes || "Inconnu"}</span>
                                </div>
                                <div className={`p-3 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <span className={`font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>Année:</span>{" "}
                                    <span className="font-bold">{anime.year || "Inconnue"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-md mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                            <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                {anime.synopsis || "Aucun synopsis disponible."}
                            </p>
                        </div>

                        <div className="mt-6">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors mr-3">
                                Ajouter aux favoris
                            </button>
                            <button className={`${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} font-medium py-2 px-6 rounded-md transition-colors`}>
                                Voir les épisodes
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

