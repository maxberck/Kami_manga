import { unstable_cache } from 'next/cache';

export const getTopAnime = unstable_cache(
    async () => {
        let allAnime: any[] = [];
        const totalPages = 8;

        for (let page = 1; page <= totalPages; page++) {
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);

            if (!response.ok) {
                console.error(`Erreur API Jikan : ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.data) {
                allAnime = [...allAnime, ...data.data];
            }

            await new Promise(resolve => setTimeout(resolve, 4000));
        }

        return allAnime;
    },
    ['top-anime'],
    {
        revalidate: 3600,
        tags: ['anime-data']
    }
);
