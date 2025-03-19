import Image from "next/image"
import Nav from "@/app/components/Nav";
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
    console.log(findManga.genres?.[1]?.names)
    const price = getFixedPrice(findManga.mal_id);
    return (
        <main className={`bg-gray-100`}>
            <section className="flex justify-evenly gap-5 w-full items-center pb-10 pt-5">
                <div className="flex-1 flex justify-center">
                    <Image key={findManga.mal_id} src={findManga.images.jpg.large_image_url} width={400} height={400} className="h-[84vh] w-auto border-[#111111] border-2" alt={findManga.title}/>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-8xl font-black[">{findManga.title}</h1>
                    <p className="w-[80%] pt-5 text-lg font-medium">{findManga.synopsis}</p>
                    <div className="flex gap-2 flex-wrap pt-5">
                        {findManga.genres?.map((genre: any) => (
                            <button key={genre.mal_id} className="rounded-full border-2 px-4 py-2 text-black hover:bg-black hover:text-white">
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <section className={'flex'}>
                <div className={`bg-black h-[25vh] w-[25%] flex text-left pl-[6%] justify-center flex-col`}>
                    <p className={`text-white text-xl`}>STATUS&nbsp;&nbsp; {findManga.status}</p>
                    <p className={`text-white text-xl`}>&nbsp;&nbsp;GENRE&nbsp;&nbsp; {findManga.genres?.[0]?.name}</p>
                    <p className={`text-white text-xl`}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DATE&nbsp;&nbsp; {findManga.published?.prop?.from.year}</p>
                </div>
                <div className={`bg-red-300 h-[25vh] w-[100%] flex flex-col p-2 pl-[10%] justify-center`}>
                    <h1 className={`font-black text-7xl mb-5`}>L&#39;AUTEUR</h1>
                    <div className={`flex gap-20`}>
                        <div>
                            <p className={`text-lg font-black`}>dessin</p>
                            <p className={`text-3xl font-black`}>{findManga.authors?.[0]?.name}</p>
                        </div>
                        <div>
                            <p className={`text-lg font-black`}>scénario</p>
                            <p className={`text-3xl font-black`}>{findManga.authors?.[0]?.name}</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}