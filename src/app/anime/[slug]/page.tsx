"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Récupérer le paramètre slug
import Image from "next/image";

// Définition des types pour les animes
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

// fonction pour générer un slug et retrouver le nom de la même manière
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

export default function AnimeDetails() {
    const { slug } = useParams();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        async function fetchAnime() {
            try {
                const res = await fetch("http://localhost:3000/api/anime");
                const data = await res.json();
                // recherche une correspondence
                const animeData = data.data.find((anime: Anime) => generateSlug(anime.title) === slug);
                setAnime(animeData || null);
            } catch (error) {
                console.error("Erreur dans l'API :", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnime();
    }, [slug]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!anime) {
        return <p>Anime non trouvé</p>;
    }

    return (
        <main className="p-6">
            <section className="flex">
                <Image
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    width={250}
                    height={375}
                    className="rounded-md"
                />
                <div className="ml-6">
                    <h1 className="text-3xl font-bold">{anime.title}</h1>
                    <p className="mt-4">{anime.synopsis}</p>
                    <p className="font-semibold text-lg mt-2">
                        <span className="text-gray-700">Genres :</span>{" "}
                        {anime.genres.map((g) => g.name).join(", ")}
                    </p>
                    <p className="font-semibold text-lg mt-2">
                        <span className="text-gray-700">Nombre d'épisodes :</span> {anime.episodes}
                    </p>
                    <p className="font-semibold text-lg mt-2">
                        <span className="text-gray-700">Année :</span> {anime.year}
                    </p>
                </div>
            </section>
        </main>
    );
}
