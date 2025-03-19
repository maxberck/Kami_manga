"use client";
import { useEffect, useState } from "react";
import Nav from "@/app/components/Nav";
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

// Fonction pour générer un slug à partir du titre
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

export default function AnimePage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const animesPerPage = 18;
    const slidesToShow = 3;
    const totalSlides = 3;

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
        return <div>Chargement...</div>;
    }

    // pagination
    const indexOfLastAnime = currentPage * animesPerPage;
    const indexOfFirstAnime = indexOfLastAnime - animesPerPage;
    const currentAnimes = filteredAnimes.slice(indexOfFirstAnime, indexOfLastAnime);
    const totalPages = Math.ceil(filteredAnimes.length / animesPerPage);

    // carrousel
    const nextSlide = () => setCurrentIndex((prev) => (prev + slidesToShow) % (totalSlides * slidesToShow));
    const prevSlide = () => setCurrentIndex((prev) => (prev - slidesToShow + totalSlides * slidesToShow) % (totalSlides * slidesToShow));

    return (
        <main>
            <section className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Top Anime</h1>
                <div className="flex items-center">
                    <button onClick={prevSlide} className="px-4 py-2 bg-gray-300 rounded-md mx-2">◀</button>
                    <div className="flex gap-4 overflow-hidden w-[900px]">
                        {animes.slice(currentIndex, currentIndex + slidesToShow).map((anime) => (
                            <div key={anime.mal_id} className="w-60 text-center">
                                <Image src={anime.images.jpg.large_image_url} alt={anime.title} width={250} height={375} className="rounded-md" />
                                <h3 className="mt-2 text-lg font-semibold">{anime.title}</h3>
                                <Link href={`/anime/${generateSlug(anime.title)}`} className="text-blue-500">Voir plus</Link>
                            </div>
                        ))}
                    </div>
                    <button onClick={nextSlide} className="px-4 py-2 bg-gray-300 rounded-md mx-2">▶</button>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Filtrer les animes</h2>
                <div className="flex gap-4 mb-4">
                    <input type="text" placeholder="Nom" className="p-2 border rounded" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <input type="text" placeholder="Genre" className="p-2 border rounded" value={genre} onChange={(e) => setGenre(e.target.value)} />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Animes filtrés</h2>
                <div className="flex flex-wrap gap-6">
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
