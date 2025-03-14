let cachedManga: any = null;
let lastFetchTime = 0;


export async function GET() {

    // vérifier si les données sont en cache et qu'elles datent de moins de 1 heure
    if (cachedManga && Date.now() - lastFetchTime < 3600000) {
        return Response.json({ data: cachedManga });
    }

    try {
        const response = await fetch('https://api.jikan.moe/v4/top/manga');
        if (!response.ok) {
            throw new Error(`Erreur avec l'API Jikan : ${response.status}`);
        }

        const data = await response.json();
        cachedManga = data.data;
        lastFetchTime = Date.now();

        return Response.json({ data: cachedManga });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return Response.json({ error: error.message }, { status: 500 });
    }
}
