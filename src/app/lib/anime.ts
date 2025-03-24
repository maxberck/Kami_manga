import { unstable_cache } from 'next/cache';

// Define an interface for the Anime data structure based on the Jikan API response
interface AnimeData {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        }
    };
    type: string;
    episodes?: number;
    status: string;
    airing: boolean;
    score?: number;
    rank?: number;
    popularity?: number;
    synopsis?: string;
    genres?: Array<{
        mal_id: number;
        type: string;
        name: string;
        url: string;
    }>;
    aired?: {
        from?: string;
        to?: string;
    };
    duration?: string;
}

interface JikanApiResponse {
    data: AnimeData[];
    pagination?: {
        last_visible_page: number;
        has_next_page: boolean;
    };
}

export const getTopAnime = unstable_cache(
    async () => {
        // Explicitly type the array of anime
        let allAnime: AnimeData[] = [];
        const totalPages = 8;

        for (let page = 1; page <= totalPages; page++) {
            try {
                const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);

                if (!response.ok) {
                    console.error(`Erreur API Jikan : ${response.status} ${response.statusText}`);
                    continue; // Skip to next iteration if response is not ok
                }

                // Type the parsed data
                const data: JikanApiResponse = await response.json();

                if (data.data) {
                    allAnime = [...allAnime, ...data.data];
                }

                // Add a small delay to respect API rate limits
                await new Promise(resolve => setTimeout(resolve, 340));
            } catch (error) {
                console.error(`Erreur lors de la récupération de la page ${page}:`, error);
            }
        }

        return allAnime;
    },
    ['top-anime'],
    {
        revalidate: 3600,
        tags: ['anime-data']
    }
);