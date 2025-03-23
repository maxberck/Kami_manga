'use client'
import { useEffect, useState } from "react";
import { useTheme} from "next-themes";
import Link from "next/link";
import Image from "next/image";

// Définition du type Anime
type Anime = {
    mal_id: number;
    title: string;
    synopsis: string;
    images: {
        jpg: { large_image_url: string };
    };
    genres: { name: string }[];
    episodes: number;
    year: number;
};

// fonction pour générer un slug à partir du titre
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

export default function AnimePage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [search, setSearch] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const animesPerPage = 18;
    const totalSlides = 3;
    const {theme} = useTheme();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
        }
        checkMobile();

        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        }
    }, []);


    useEffect(() => {
        async function fetchAnimes() {
            try {
                const response = await fetch("/api/anime");
                const data = await response.json();
                setAnimes(data.data || []);
            } catch (error) {
                console.error("Erreur dans l'API :", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnimes();
    }, []);

    const handleFilter = () => {
        return animes.filter((anime) => {
            const title = anime.title.toLowerCase();
            const genreMatch = anime.genres.some((g) => g.name.toLowerCase().includes(genre.toLowerCase()));
            return title.includes(search.toLowerCase()) && (genreMatch || genre === "");
        });
    };

    const filteredAnimes = handleFilter();

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

    // pagination
    const indexOfLastAnime = currentPage * animesPerPage;
    const indexOfFirstAnime = indexOfLastAnime - animesPerPage;
    const currentAnimes = filteredAnimes.slice(indexOfFirstAnime, indexOfLastAnime);
    const totalPages = Math.ceil(filteredAnimes.length / animesPerPage);
    const cardCarousel = isMobile ? 1 : 3
    // carrousel
    const nextSlide = () => setCurrentIndex((prev) => (prev + cardCarousel) % (totalSlides * cardCarousel));
    const prevSlide = () => setCurrentIndex((prev) => (prev - cardCarousel + totalSlides * cardCarousel) % (totalSlides * cardCarousel));

    return (
        <main className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <section className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Top Anime</h1>
                <div className="flex items-center">
                    <button onClick={prevSlide} className="px-4 py-2 bg-gray-300 rounded-md mx-2">◀</button>
                    <div className="flex gap-4 overflow-hidden w-[90%]">
                        {animes.slice(currentIndex, currentIndex + cardCarousel).map((anime) => (
                            <div key={anime.mal_id} className="w-60 text-center">
                                <Image src={anime.images.jpg.large_image_url} alt={anime.title} width={250} height={375}
                                       className="rounded-md"/>
                                <h3 className="mt-2 text-lg font-semibold">{anime.title}</h3>
                                <Link href={`/anime/${generateSlug(anime.title)}`} className="text-blue-500">Voir
                                    plus</Link>
                            </div>
                        ))}
                    </div>
                    <button onClick={nextSlide} className="px-4 py-2 bg-gray-300 rounded-md mx-2">▶</button>
                </div>
            </section>

            <section className="mb-8 pl-8">
                <h2 className="text-2xl font-semibold mb-4">Filtrer les animes</h2>
                <div className="flex gap-4 mb-4 flex-wrap">
                    <input type="text" placeholder="Nom" className="p-2 border rounded" value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                    <input type="text" placeholder="Genre" className="p-2 border rounded" value={genre}
                           onChange={(e) => setGenre(e.target.value)}/>
                </div>
            </section>

            <section className={`mb-8`}>
                <h2 className="text-2xl font-semibold mb-4 pl-8">Animes filtrés</h2>
                <div className="flex flex-wrap gap-6 justify-evenly">
                    {currentAnimes.length > 0 ? (
                        currentAnimes.map((anime) => (
                            <div key={anime.mal_id} className="w-60">
                                <Image src={anime.images.jpg.large_image_url} alt={anime.title} width={250} height={375} className="rounded-md" />
                                <h3 className="mt-2 text-lg font-semibold">{anime.title}</h3>
                                <Link href={`/anime/${generateSlug(anime.title)}`} className="text-blue-500">Voir plus</Link>
                            </div>
                        ))
                    ) : (
                        <p>Aucun anime trouvé.</p>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded-md"
                    >
                        Précédent
                    </button>
                    <span>Page {currentPage} sur {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded-md"
                    >
                        Suivant
                    </button>
                </div>
            </section>
        </main>
    );
}
