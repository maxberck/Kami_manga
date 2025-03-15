import Image from "next/image"
const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
const getFixedPrice = (id: number) => prices[id % prices.length];

async function getManga() {
    const resp = await fetch('http://localhost:3000/api/manga')
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
    const price = getFixedPrice(findManga.mal_id);
    return (
        <main>
            <section>
                <Image key={findManga.mal_id} src={findManga.images.jpg.large_image_url} width={100} height={100}
                       alt={""}/>
                <h1>stp {findManga.title}</h1>
                <p className="text-lg font-bold text-red-600 mt-2">Prix: {price}€</p>
            </section>
        </main>
    )
}