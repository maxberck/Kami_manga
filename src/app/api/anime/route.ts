import { NextResponse } from "next/server";

// création d'une variable pour stocker les mangas récupérés et l'initialisé comme null
let cachedAnime: any = null;
// variable qui stocke la dernière fois que je fais appel à l'API
let lastFetchTime = 0;

export async function GET() {
    // Ici la fonction sert à vérifier de quand date le dernière appel API si c'est plus petit que 1h alors on utilise le cache
    if (cachedAnime && Date.now() - lastFetchTime < 3600000) {
        return NextResponse.json({ data: cachedAnime });  // Retourne une réponse JSON avec les mangas en cache.
    }

    try {
        let allAnimes: any[] = [];
        const totalPages = 8;

        // je fais une boucle fori avec page à la place de i pour pas me perdre
        for (let page = 1; page <= totalPages; page++) {
            // appel de l'API avec la pagination
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);

            // si l'API à un problème alors on envoie un console.error
            if (!response.ok) {
                console.error(`Erreur API Jikan : ${response.status} ${response.statusText}`);
            }

            // mettre en dossier json
            const data = await response.json();

            // je récupère les mangas de la boucle et je les stockent dans allMangas
            if (data.data) {
                allAnimes = [...allAnimes, ...data.data];
            }

            // pause de 3secondes entre les appels API pour éviter une erreur 429 (trop de demande à l'API)
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // quand la boucle fini je mets tous les mangas dans les cachedManga
        cachedAnime = allAnimes;
        lastFetchTime = Date.now();  //et je mets à jour l'heure comme ca lastFetchManga attends pendant 1h

        // renvoi la reponse des mangas mis en cache
        return NextResponse.json({ data: cachedAnime });
    } catch (error) {

        console.error("Erreur dans l'API Manga :", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
