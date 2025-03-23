import { NextResponse } from "next/server";
import { getTopAnime } from "@/app/lib/anime";

export async function GET() {
    try {
        const animeData = await getTopAnime();
        return NextResponse.json({ data: animeData });
    } catch (error) {
        console.error("Erreur dans l'API Manga :", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}