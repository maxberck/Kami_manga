import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};
export default function ActionManga() {
    const [mangas, setMangas] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
    const getFixedPrice = (id: number) => prices[id % prices.length];

    useEffect(() => {
        async function fetchMange(){
            try{
                const res = await fetch('/api/manga');
                const data = await res.json();
                // console.log(data.data.genres);

                if (Array.isArray(data.data)) {
                    const actionManga = data.data.filter((manga: any) =>
                        manga.genres.some((genre: any) => genre.name === "Action")
                    );

                    const maxManga = actionManga.sort((a: any, b: any) => a.rank - b.rank).slice(0, 10);

                    setMangas(maxManga);
                }
            }catch (error){
                console.error("Erreur dans l'API", error)
            }finally {
                setLoading(false);
            }
        }
        fetchMange();
    }, []);

    const addToCart = (mangas: any, price: number) => {
        let cart = JSON.parse(localStorage.getItem("cart")|| '[]');
        const existManga = cart.find((mangas: any) => mangas.id === mangas.mal_id);
        if (existManga) {
            existManga.quantity += 1;
        }else{
            cart.push({id : mangas.mal_id, title: mangas.title, image : mangas.images?.jpg?.large_image_url, price : getFixedPrice(mangas.mal_id), quantity: 1});
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    if (loading){
        return (
            <div className="flex justify-center items-center">
                <p>tqt ca arrive le s attends un peu</p>
            </div>
        )
    }
    return (
        <div className="flex flex-wrap justify-around pt-[2%] w-[90%]">
            {mangas.map((manga) => {
                const price = getFixedPrice(manga.mal_id);
                return (
                    <div key={manga.mal_id} className="w-[280px]">
                        <Link href={`/card/${generateSlug(manga.title)}`} className="text-blue-500">
                            <Image src={manga.images.jpg.large_image_url} alt="" width={250} height={375} className="rounded-md w-[280px] h-[400px]"/>
                        </Link>
                        <p className="mt-2 text-lg font-semibold">{manga.title.substring(0, 31) || "Inconnu"}</p>
                        <div className={`flex justify-around items-center pb-5`}>
                            <p className="text-lg font-bold text-red-600 mt-2">Prix: {price}€</p>
                            {/*ici on envoie les données avec le clique*/}
                            <button onClick={() => addToCart(manga, price)}
                                    className="text-white bg-black px-3 py-2 rounded mt-2">
                                Payer
                            </button>
                        </div>
                    </div>
                )

            })}
        </div>
    )
}