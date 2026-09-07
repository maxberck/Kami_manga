import { unstable_cache } from 'next/cache';

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

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTopAnime = unstable_cache(
    async () => {
        const allAnime: AnimeData[] = [];
        const totalPages = 8;
        const batchSize = 2;

        for (let start = 1; start <= totalPages; start += batchSize) {
            const pages = Array.from(
                { length: Math.min(batchSize, totalPages - start + 1) },
                (_, index) => start + index
            );

            const results = await Promise.allSettled(
                pages.map(async page => {
                    const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`, {
                        next: { revalidate: 3600 },
                    });

                    if (!response.ok) {
                        throw new Error(`Jikan ${response.status} ${response.statusText}`);
                    }

                    const data: JikanApiResponse = await response.json();
                    return data.data || [];
                })
            );

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    allAnime.push(...result.value);
                } else {
                    console.error(`Erreur lors de la récupération de la page ${pages[index]}:`, result.reason);
                }
            });

            if (start + batchSize <= totalPages) {
                await wait(700);
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