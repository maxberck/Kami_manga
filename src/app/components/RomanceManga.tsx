import { useEffect, useState } from "react";
interface Manga {
    mal_id: number;
    title: string;
    images:{
        jpg:{
            large_image_url: string;
        }
    }
    rank: number;
    authors: {
        name: string;
    };
    status: string;
}

export default function RomanceManga() {
    const [mangas, setMangas] = useState<Manga[]>([]);
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
    const getFixedPrice = (id: number) => prices[id % prices.length];
    useEffect(() => {
        async function fetchMange(){
            const res = await fetch('/api/manga');
            const data = await res.json();

            if (Array.isArray(data.data)) {
                const actionManga = data.data.filter((manga: any) =>
                    manga.genres.some((genre: any) => genre.name === "Romance")
                );
                // console.log(data.data.genres.name)
                const maxManga = actionManga.sort((a: any, b: any) => a.rank - b.rank).slice(0, 10);

                setMangas(maxManga);
            }
        }
        fetchMange();
    }, []);
    return (
        <div className="flex flex-wrap justify-around pt-[20%] w-[90%]">
            {mangas.map((manga) => {
                const price = getFixedPrice(manga.mal_id);
                return (
                    <div key={manga.mal_id}>
                        <div
                            className="card shadow-[0px_4px_16px_px_#367E08] h-[400px] w-[280px] group gap-[0.5em]  relative flex justify-end flex-col p-[1.5em] z-[1] overflow-hidden mt-5">
                            <div className="absolute top-0 left-0 h-full w-full border-[#111111] border-5 bg-cover"
                                 style={{backgroundImage: `url(${manga.images.jpg.large_image_url})`}}></div>
                        </div>
                        <div className="pt-2">
                            <p className="text-xl font-black transform scale-y-175 tracking-tight max-w-[280px]">{manga.title}</p>
                            {/*By {manga.authors?.[0]?.name || "inconnu"}*/}
                            <p className="pt-8">{manga.rank}</p>
                            <p className="text-lg font-bold text-red-600 mt-2">Prix: {price}€</p>
                        </div>
                    </div>
                )

            })}
        </div>
    )
}