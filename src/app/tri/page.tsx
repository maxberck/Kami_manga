'use client'

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

// Interfaces restent les mêmes
interface MangaImage {
    jpg: {
        large_image_url: string;
    };
}

interface MangaAuthor {
    name: string;
}

interface MangaGenreTheme {
    name: string;
}

interface Manga {
    mal_id: number;
    title: string;
    images: MangaImage;
    authors?: MangaAuthor[];
    genres?: MangaGenreTheme[];
    themes?: MangaGenreTheme[];
}

interface CartItem {
    id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

export default function MangaList() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MangaListContent />
        </Suspense>
    )
}

function MangaListContent() {
    const [mangas, setManga] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [themes, setTheme] = useState("");
    const [author, setAuthor] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const mangasPerPage = 18;
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
    const getFixedPrice = (id: number) => prices[id % prices.length];
    const {theme} = useTheme();

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

    useEffect(() => {
        async function fetchManga(){
            try {
                const res = await fetch('/api/manga')
                const data = await res.json()
                setManga(data.data || [])
            } catch (error){
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchManga()
    },[])

    const addToFav = (manga: Manga) => {
        if (typeof window !== 'undefined') {
            if (!manga || !manga.mal_id) {
                console.error("Impossible d'ajouter un manga non défini aux favoris :", manga);
                return;
            }
            const favoritesStr = localStorage.getItem("favorites") || "[]";
            const fav: number[] = JSON.parse(favoritesStr);
            if (!fav.includes(manga.mal_id)) {
                fav.push(manga.mal_id);
            } else {
                const updatedFav = fav.filter((id) => id !== manga.mal_id);
                localStorage.setItem("favorites", JSON.stringify(updatedFav));
                return;
            }
            localStorage.setItem("favorites", JSON.stringify(fav));
        }
    };

    const addToCart = (manga: Manga) => {
        if (typeof window !== 'undefined') {
            const cartStr = localStorage.getItem("cart") || "[]";
            const cart: CartItem[] = JSON.parse(cartStr);
            const price = getFixedPrice(manga.mal_id);

            const existMangaIndex = cart.findIndex((item) => item.id === manga.mal_id);

            if (existMangaIndex !== -1) {
                cart[existMangaIndex].quantity += 1;
            } else {
                cart.push({
                    id: manga.mal_id,
                    title: manga.title,
                    image: manga.images.jpg.large_image_url,
                    price: price,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-400">
                    <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-400">
                        <svg viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden="true" className="w-10 h-10 text-gray-200 dark:text-gray-600">
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                        </svg>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    if (!Array.isArray(mangas) || mangas.length === 0) {
        return <h1>Aucun manga disponible</h1>;
    }

    const filtreMangas = mangas.filter((manga) => {
        const mangaTitle = manga.title?.toLowerCase() || "";
        const mangaAuthor = manga.authors?.[0]?.name?.toLowerCase() || "";
        const mangaGenres = manga.genres?.map((g) => g.name.toLowerCase()).join(", ") || "";
        const mangaThemes = manga.themes?.map((t) => t.name.toLowerCase()).join(", ") || "";

        return (
            mangaTitle.includes(searchQuery.toLowerCase()) &&
            mangaTitle.includes(search.toLowerCase()) &&
            mangaAuthor.includes(author.toLowerCase()) &&
            mangaGenres.includes(genre.toLowerCase()) &&
            mangaThemes.includes(themes.toLowerCase())
        )
    })

    const indexOfLastManga = currentPage * mangasPerPage;
    const indexOfFirstManga = indexOfLastManga - mangasPerPage;
    const currentManga = filtreMangas.slice(indexOfFirstManga, indexOfLastManga);
    const totalPages = Math.ceil(filtreMangas.length / mangasPerPage);

    return(
        <main className={`${theme === 'dark'? 'bg-gray-700': 'bg-gray-100'}`}>
            <div className={`flex justify-center pb-25 pt-5 gap-2 md:gap-10 flex-wrap ${theme === 'dark'?'text-gray-300':'text-black border-black'}`}>
                <input type="text" placeholder={`Search Author`} value={author} onChange={(e) => setAuthor(e.target.value)} className={`border-2 rounded-md md:p-2 text-center`}/>
                <input type="text" placeholder={`Search Name`} value={search} onChange={(e) => setSearch(e.target.value)} className={`border-2 rounded-md md:p-2 text-center`}/>
                <input type="text" placeholder={`Search Genre`} value={genre} onChange={(e) => setGenre(e.target.value)} className={`border-2 rounded-md md:p-2 text-center`}/>
                <input type="text" placeholder={`Search Theme`} value={themes} onChange={(e) => setTheme(e.target.value)} className={`border-2 rounded-md md:p-2 text-center`}/>
            </div>
            <div className={`flex flex-wrap justify-around`}>
                {
                    currentManga.length > 0 ? (
                        currentManga.map((manga) => {
                            const price = getFixedPrice(manga.mal_id);
                            return (
                                <div key={manga.mal_id} className="w-40 md:w-60">
                                    <div className={`relative`}>
                                        <Link href={`/card/${generateSlug(manga.title)}`}>
                                            <Image src={manga.images.jpg.large_image_url} alt="" width={250}
                                                   height={375}
                                                   className="rounded-md w-[150px] h-[225px] md:w-[250px] md:h-[375px]"/>
                                        </Link>
                                        <button
                                            onClick={() => addToFav(manga)}
                                            className={`absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-red-500 focus:bg-red-500`}>
                                            ♡
                                        </button>
                                    </div>
                                    <p className="mt-2 text-lg font-semibold">{manga.title || "Inconnu"}</p>
                                    <div className={`flex justify-between items-center pb-5`}>
                                        <p className="text-[red] bg-red-100 px-3 py-2 rounded mt-2 text-[9px] md:text-lg">Prix: {price}€</p>
                                        <button onClick={() => addToCart(manga)} className="text-white bg-black px-3 py-2 rounded mt-2 text-[9px] md:text-lg">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            )
                        })) : (<div><p>Y a rien c&#39;est la rue</p></div>)
                }
            </div>
            <div className="flex justify-center mt-6 gap-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded-md">
                    Précédent
                </button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded-md">
                    Suivant
                </button>
            </div>
        </main>
    )
}