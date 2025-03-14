'use client'
import {useEffect, useState} from "react";

export default function MangaList() {
    const [manga, setManga] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [theme, setTheme] = useState("");

    useEffect(() => {
        async function fetchManga(){
            try {
                const res = await fetch('https://api.jikan.moe/v4/top/manga')
                const data = await res.json()
                setManga(data.data)
                console.log(data.data)
            } catch (error){
                console.error(error)

            }finally {
                setLoading(false)
            }
        }
        fetchManga()
    })

    if (loading) {
        return (
            <div>
                <p>Ca charge tqt le S ....</p>
            </div>
        )
    }
    const filtreMangas = manga.filter((manga) => {
        const mangaTitle = manga.title.toLowerCase()||"";
        const mangaAuthor = manga.author?.[0]?.name?.toLowerCase()||"";
        const mangaGenres = manga.genres?.map((genre) => {genre.name.toLowerCase().join(", ")||""});
        const mangaThemes = manga.themes?.map((theme) => {theme.name.toLowerCase().join(", ")||""});

    })

    return(
        <main>

        </main>
    )
}