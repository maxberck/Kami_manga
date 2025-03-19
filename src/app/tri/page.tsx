'use client'
import {useEffect, useState} from "react";
import Image from "next/image";
import {useSearchParams} from "next/navigation";

export default function MangaList() {
    const [mangas, setManga] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [genre, setGenre] = useState("");
    const [theme, setTheme] = useState("");
    const [author, setAuthor] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const mangasPerPage = 18;
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
    const getFixedPrice = (id: number) => prices[id % prices.length];

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

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
            mangaTitle.includes(searchQuery.toLowerCase())&&
            mangaTitle.includes(search.toLowerCase())&&
            mangaAuthor.includes(author.toLowerCase())&&
            mangaGenres.includes(genre.toLowerCase())&&
            mangaThemes.includes(theme.toLowerCase())

        )
    })

    const addToCart =  (manga: any, price: number) => {
        // ici JSON.parse permet de récupérer un objet à partir d'un JSON (API)
        // le getItem permet de récupérer les données associé à la clef cart et si c'est null alors c'est un tableau vide
        let cart = JSON.parse(localStorage.getItem("cart")|| "[]");
        // ici j'utilise find car elle ressort la première correspondance
        // le "(item : any) => item.id === manga.mal_id" est une fonction de callback ( fonction de rappel ) elle va comparer l'id des élément du panier avec les id de l'API
        const existManga = cart.find((item : any) => item.id === manga.mal_id);
        // si la correspondance est trouvé
        if (existManga) {
            // on ajoute 1
            existManga.quantity += 1;
            // sinon
        }else{
            // on force les données à être envoyé
            cart.push({id: manga.mal_id, title: manga.title, image: manga.images?.jpg?.large_image_url, price: getFixedPrice(manga.mal_id), quantity: 1 });
        }
        // ici on enregistre les données avec les clef ("cart") et la valeur est (cart = un tableau contenant des objets ici les données ajouté au panier)
        // stringify convertit le tableau en une chaîne JSON pour qu'il puisse être enregistré
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    console.log(`tester voir le contenu de filtreMangas : ${filtreMangas}`)

    const indexOfLastManga = currentPage * mangasPerPage;
    const indexOfFirstManga = indexOfLastManga - mangasPerPage;
    const currentManga = filtreMangas.slice(indexOfFirstManga, indexOfLastManga);
    const totalPages = Math.ceil(filtreMangas.length / mangasPerPage);


    return(
        <main>
            {/*les input de recherche*/}
            <div className={`flex justify-center pb-25 pt-5 gap-10`}>
                <input type="text" placeholder={`Search Author`} value={author}
                       onChange={(e) => setAuthor(e.target.value)} className={`border-2 rounded-md p-2 text-center`}/>
                <input type="text" placeholder={`Search Name`} value={search}
                       onChange={(e) => setSearch(e.target.value)} className={`border-2 rounded-md p-2 text-center`}/>
                <input type="text" placeholder={`Search Genre`} value={genre}
                       onChange={(e) => setGenre(e.target.value)} className={`border-2 rounded-md p-2 text-center`}/>
                <input type="text" placeholder={`Search Theme`} value={theme}
                       onChange={(e) => setTheme(e.target.value)} className={`border-2 rounded-md p-2 text-center`}/>
            </div>
            <div className={`flex flex-wrap justify-around`}>
                {
                    currentManga.length > 0 ? (
                        currentManga.map((manga) => {
                            const price = getFixedPrice(manga.mal_id);
                            return (
                                <div key={manga.mal_id} className="w-60">
                                    <Image src={manga.images.jpg.large_image_url} alt="" width={250} height={375} className="rounded-md w-[250px] h-[375px]"/>
                                    <p className="mt-2 text-lg font-semibold">{manga.title || "Inconnu"}</p>
                                    <div className={`flex justify-around items-center pb-5`}>
                                        <p className="text-lg font-bold text-red-600 mt-2">Prix: {price}€</p>
                                        {/*ici on envoie les données avec le clique*/}
                                        <button onClick={() => addToCart(manga, price)} className="text-white bg-blue-500 px-3 py-2 rounded mt-2">
                                            Payer
                                        </button>
                                    </div>
                                </div>

                            )
                        })) : (<div><p>Y a rien c'est la rue</p></div>)
                }
            </div>
            <div className="flex justify-center mt-6 gap-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded-md">
                    Précédent
                </button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 disabled:opacity-50 rounded-md">
                    Suivant
                </button>
            </div>
        </main>
    )
}