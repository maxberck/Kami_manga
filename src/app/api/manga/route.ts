import { NextResponse} from "next/server";

export async function GET() {
    const resp = await fetch("https://api.jikan.moe/v4/manga");
    const json = await resp.json();

    return NextResponse.json(json);
}
