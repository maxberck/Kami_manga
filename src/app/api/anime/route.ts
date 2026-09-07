import { NextResponse } from "next/server";
import { getTopAnime } from "@/app/lib/anime";

export async function GET() {
    try {
        const animeData = await getTopAnime();
        return NextResponse.json({ data: animeData });
    } catch (error) {
        console.error("Erreur dans l'API Anime :", error);
        return NextResponse.json({ error: "Impossible de récupérer les anime." }, { status: 500 });
    }
}
