'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Manga {
    mal_id: number
    title: string
    images: {
        jpg: {
            large_image_url: string
        }
    }
    rank: number
    authors: {
        name: string
    }
    status: string
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function ActionManga() {
    const [mangas, setMangas] = useState<Manga[]>([])
    const [loading, setLoading] = useState(true)
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99]
    const getFixedPrice = (id: number) => prices[id % prices.length]

    // charger les favoris depuis localStorage au montage du composant
    useEffect(() => {
        async function fetchMange() {
            try {
                const res = await fetch("/api/manga")
                const data = await res.json()

                if (Array.isArray(data.data)) {
                    const actionManga = data.data.filter((manga: any) =>
                        manga.genres.some((genre: any) => genre.name === "Action"),
                    )

                    const maxManga = actionManga.sort((a: any, b: any) => a.rank - b.rank).slice(0, 10)

                    setMangas(maxManga)
                }
            } catch (error) {
                console.error("Erreur dans l'API", error)
            } finally {
                setLoading(false)
            }
        }
        fetchMange()
    }, [])

    // fonction pour basculer un manga dans les favoris

    const addToFav = (manga: Manga) => {
        if (!manga || !manga.mal_id) {
            console.error("Impossible d'ajouter un manga non défini aux favoris :", manga);
            return;
        }
        let fav = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (!fav.includes(manga.mal_id)) {
            fav.push(manga.mal_id);
        } else {
            fav = fav.filter((id: number) => id !== manga.mal_id);
        }
        localStorage.setItem("favorites", JSON.stringify(fav));
    };


    const addToCart = (manga: any, price: number) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        // Correction du bug: utiliser manga.mal_id au lieu de mangas.mal_id
        const existManga = cart.find((item: any) => item.id === manga.mal_id)

        if (existManga) {
            existManga.quantity += 1
        } else {
            cart.push({
                id: manga.mal_id,
                title: manga.title,
                image: manga.images?.jpg?.large_image_url,
                price: getFixedPrice(manga.mal_id),
                quantity: 1,
            })
        }

        localStorage.setItem("cart", JSON.stringify(cart))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div
                    className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-400">
                    <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-400">
                        <svg viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden="true" className="w-10 h-10 text-gray-200 dark:text-gray-600">
                            <path
                                d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                        </svg>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-48 mb-4"/>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"/>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"/>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-400"/>
                    <div className="flex items-center mt-4">
                        <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden="true" className="w-10 h-10 me-3 text-gray-200 dark:text-gray-400">
                            <path
                                d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                        </svg>
                        <div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-32 mb-2"/>
                            <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-400"/>
                        </div>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap justify-around pt-[2%] w-[90%]">
            {mangas.map((manga) => {
                const price = getFixedPrice(manga.mal_id)
                return (
                    <div key={manga.mal_id} className="w-[280px] relative mb-8">
                        <div className="relative">
                            <Link href={`/card/${generateSlug(manga.title)}`} className="text-blue-500 block">
                                <Image
                                    src={manga.images.jpg.large_image_url || "/placeholder.svg"}
                                    alt={manga.title}
                                    width={250}
                                    height={375}
                                    className="rounded-md w-[280px] h-[400px]"
                                />
                            </Link>

                            <button
                                onClick={() => addToFav(manga)}
                                className={`absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-red-500 focus:bg-red-500`}>
                                ♡
                            </button>
                        </div>

                        <p className="mt-2 text-lg font-semibold">{manga.title.substring(0, 31) || "Inconnu"}</p>
                        <div className="flex justify-between items-center pb-5">
                            <p className="text-[red] bg-red-100 px-3 py-2 rounded mt-2">Prix: {price.toFixed(2)}€</p>
                            <button
                                onClick={() => addToCart(manga, price)}
                                className="text-white bg-black px-3 py-2 rounded mt-2 hover:bg-gray-800 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

