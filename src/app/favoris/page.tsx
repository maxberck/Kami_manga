'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes";

interface Manga {
    mal_id: number
    title: string
    images: {
        jpg: {
            large_image_url: string
        }
    }
    rank?: number
    authors?: {
        name: string
    }[]
    status?: string
    genres?: {
        name: string
    }[]
    synopsis?: string
    price?: number
}

// Define a type for cart items
interface CartItem {
    id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<number[]>([])
    const [favoriteManga, setFavoriteManga] = useState<Manga[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [allManga, setAllManga] = useState<Manga[]>([])
    const {theme} = useTheme()

    const prices = [5.99, 7.49, 9.99, 12.99, 14.99]
    const getFixedPrice = (id: number) => prices[id % prices.length]

    useEffect(() => {
        // Safely check for localStorage
        if (typeof window !== 'undefined') {
            const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]") as number[];
            setFavorites(storedFavorites);
        }
    }, []);

    // Modify the localStorage effect to check for window
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fav", JSON.stringify(favorites))
        }
    }, [favorites])

    // charger les favoris et les données manga
    useEffect(() => {
        async function fetchAllManga() {
            try {
                const res = await fetch("/api/manga")
                const data = await res.json()

                if (Array.isArray(data.data)) {
                    setAllManga(data.data)
                }
            } catch (error) {
                console.error("Erreur dans l'API", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAllManga()
    }, [])

    // filtrer les mangas favoris quand les données sont chargées
    useEffect(() => {
        if (allManga.length > 0 && favorites.length > 0) {
            const mangaFavorites = allManga.filter((manga) => favorites.includes(manga.mal_id))
            setFavoriteManga(mangaFavorites)
        } else {
            setFavoriteManga([])
        }
    }, [allManga, favorites])

    const toggleFavorite = (mangaId: number) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.includes(mangaId)
                ? prevFavorites.filter((id) => id !== mangaId)
                : [...prevFavorites, mangaId];

            // Safely set localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            }

            return updatedFavorites;
        });
    };

    const addToCart = (manga: Manga, price: number) => {
        // Safely handle localStorage
        if (typeof window !== 'undefined') {
            const cartString = localStorage.getItem("cart") || "[]";
            const cart: CartItem[] = JSON.parse(cartString);

            const existManga = cart.find((item) => item.id === manga.mal_id);

            if (existManga) {
                existManga.quantity += 1;
            } else {
                cart.push({
                    id: manga.mal_id,
                    title: manga.title,
                    image: manga.images?.jpg?.large_image_url || '',
                    price: price,
                    quantity: 1,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }

    // Rest of the component remains the same...
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"/>
                    <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Your adventure is about to begin
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`min-h-screen py-10 px-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold mb-2">Mes Favoris</h1>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {favoriteManga.length > 0
                            ? `Vous avez ${favoriteManga.length} manga${favoriteManga.length > 1 ? "s" : ""} en favoris`
                            : "Vous n'avez pas encore de favoris"}
                    </p>
                </div>

                {favoriteManga.length === 0 ? (
                    <div
                        className={`rounded-lg shadow-md p-8 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <div className="text-6xl mb-4">💔</div>
                        <h2 className="text-2xl font-semibold mb-4">Aucun manga en favoris</h2>
                        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            Explorez notre collection et ajoutez des mangas à vos favoris pour les retrouver ici.
                        </p>
                        <Link href="/" className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
                            Découvrir des mangas
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {favoriteManga.map((manga) => {
                            const price = getFixedPrice(manga.mal_id)
                            const isFavorite = favorites.includes(manga.mal_id)

                            return (
                                <div key={manga.mal_id} className={`rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                                    <div className="relative">
                                        <Link href={`/card/${generateSlug(manga.title)}`}>
                                            <div className="relative h-[400px] w-full">
                                                <Image
                                                    src={manga.images.jpg.large_image_url || "/placeholder.svg"}
                                                    alt={manga.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        <button
                                            onClick={() => toggleFavorite(manga.mal_id)}
                                            className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full 
                                                ${
                                                isFavorite
                                                    ? "bg-red-500 text-white"
                                                    : "bg-black bg-opacity-50 text-white hover:bg-red-500"
                                            } 
                                                transition-all duration-300 transform ${isFavorite ? "scale-110" : "scale-100"}`}
                                            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
                                            {isFavorite ? "❤️" : "♡"}
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{manga.title}</h3>

                                        {manga.genres && (
                                            <div className="mb-3 flex flex-wrap gap-1">
                                                {manga.genres.slice(0, 2).map((genre) => (
                                                    <span key={genre.name} className={`inline-block text-xs px-2 py-1 rounded ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                                                        {genre.name}
                                                      </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-3">
                                            <p className="text-red-500 font-bold">{price.toFixed(2)}€</p>
                                            <button onClick={() => addToCart(manga, price)} className={`${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-800"} text-white px-3 py-2 rounded-md text-sm transition-colors`}>
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

