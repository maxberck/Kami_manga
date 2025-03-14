import Image from "next/image"
async function getManga() {
    const resp = await fetch('https://api.jikan.moe/v4/top/manga')
    const data = await resp.json();
    console.log(data.data)
    return(data.data)
}

export default async function MangaDetails({ params }: { params: { slug: string } }) {
    const manga = await getManga();
    console.log(manga);
    const findManga = manga.find((manga: any) => {
        const slug = manga.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return slug === params.slug;
    })
    console.log(params.slug)
    if(!findManga){
        return(
            <main className="flex justify-center">
                <div><p>Fuck</p></div>
            </main>
        )
    }

    return (
        <main>
            <section>
                <Image key={findManga.mal_id} src={findManga.images.jpg.large_image_url} width={100} height={100}
                       alt={""} />
                <h1>stp {findManga.title}</h1>
            </section>
        </main>
    )
}