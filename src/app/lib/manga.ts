import { unstable_cache } from 'next/cache';

export const getTopManga = unstable_cache(
    async () => {
        let allMangas: any[] = [];
        const totalPages = 8;

        for (let page = 1; page <= totalPages; page++) {
            const response = await fetch(`https://api.jikan.moe/v4/top/manga?page=${page}`);

            if (!response.ok) {
                console.error(`Erreur API Jikan : ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.data) {
                allMangas = [...allMangas, ...data.data];
            }

            await new Promise(resolve => setTimeout(resolve, 4000));
        }

        return allMangas;
    },
    ['top-manga'],
    {
        revalidate: 3600,
        tags: ['manga-data']
    }
);