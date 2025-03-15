'use client'
import {useEffect, useState} from "react";
import Image from "next/image";

export default function MangaList() {
    const [mangas, setManga] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [theme, setTheme] = useState("");
    const [author, setAuthor] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchManga(){
            try {
                const res = await fetch('/api/manga')
                const data = await res.json()
                setManga(data.data || [])
                console.log(data.data)
            } catch (error){
                console.error(error)

            }finally {
                setLoading(false)
            }
        }
        fetchManga()
    },[])

    if (loading) {
        return (
            <div>
                <p>Ca charge tqt le S ....</p>
            </div>
        )
    }
    if (!Array.isArray(mangas) || mangas.length === 0) {
        return <h1>Aucun manga sale fdp retourne regarder Gattouz0 sale branleur</h1>;
    }

    const filtreMangas = mangas.filter((manga) => {

        const mangaTitle = manga?.title?.toLowerCase()||"";

        const mangaAuthor = manga?.authors?.[0]?.name?.toLowerCase()||"";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const mangaGenres = manga?.genres?.map((g) => g.name.toLowerCase()).join(", ")||"";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const mangaThemes = manga?.themes?.map((t) => t.name.toLowerCase()).join(", ")||"";

        return (
            mangaTitle.includes(search.toLowerCase())&&
            mangaAuthor.includes(author.toLowerCase())&&
            mangaGenres.includes(genre.toLowerCase())&&
            mangaThemes.includes(theme.toLowerCase())

        )
    })
    console.log(`tester voir le contenu de filtreMangas : ${filtreMangas}`)


    return(
        <main>
            {/*les input de recherche*/}
            <div className={`flex justify-around pb-25`}>
                <input type="text" placeholder={`Search Author`} value={author}
                       onChange={(e) => setAuthor(e.target.value)} className={`border-2 rounded-md p-2 text-center`}/>
                <input type="text" placeholder={`Search Name`} value={search}
                       onChange={(e) => setSearch(e.target.value)} className={`border-2 rounded-md p-2 text-center`}/>
            </div>
            <div className={`flex flex-wrap justify-around`}>
                {
                    filtreMangas.length > 0 ? (
                        filtreMangas.map((manga) => (
                            <div key={manga.mal_id} className="rounded-lg p-4 border-1">
                                <Image src={manga.images.jpg.large_image_url} alt="" width={100} height={100} />
                                <p>Auteur : {manga.authors?.[0]?.name || "Inconnu"}</p>
                            </div>
                                ))):(<div><p>Y a rien c'est la rue</p></div>)
                }
            </div>
            {/*<p>test voir si ca fonctionne</p>*/}
        </main>
    )
}