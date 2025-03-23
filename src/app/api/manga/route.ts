import { NextResponse } from "next/server";
import { getTopManga } from "@/app/lib/manga";

export async function GET() {
    try {
        const mangaData = await getTopManga();
        return NextResponse.json({ data: mangaData });
    } catch (error) {
        console.error("Erreur dans l'API Manga :", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}