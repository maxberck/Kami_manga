'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "./components/Nav"
import Image from "next/image"
import StatuManga from "@/app/components/StatuManga";
import ActionManga from "@/app/components/ActionManga";
import RomanceManga from "@/app/components/RomanceManga";
export default function Home() {
    const [manga, setManga] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] =useState(true)
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
    const getFixedPrice = (id: number) => prices[id % prices.length];

    useEffect(() => {
        async function fetchManga(){
            try {
                const response = await fetch('/api/manga');
                const data = await response.json();

                console.log("Réponse l'API :", response);
                console.log("Données JSON :", data);

                // sort permet de tri des données en comparant a et b en soustrayant b à a fonction si il n'y a pas de NaN et de infinity
                const rankManga = data.data.filter((manga: any ) => manga.rank !== null && manga.rank !== undefined).sort((a: any, b: any) => a.rank - b.rank).slice(0, 6);
                setManga(rankManga);
                console.log("Mangas rank :", rankManga);
            }catch (error) {
                console.error(`Erreur trouvé : ${error}`);
            }finally {
                setLoading(false);
            }
        }
        fetchManga()
    }, []);

    // useEffect(() => {
    //     if (!isHovered) {
    //         const interval = setInterval(() => {
    //             setCurrentIndex((prevIndex) => (prevIndex + 1) % (manga.length - 2));
    //         }, 3000);
    //
    //         return () => clearInterval(interval);
    //     }
    // }, [isHovered, manga.length]);


    // const toggleManga = (manga: any, price: number) => {
    //     let favorite = JSON.parse(localStorage.getItem("favorite")|| "[]");
    //
    //     const existManga = favorite.find((item : any) => item.id === manga.mal_id);
    //     if (existManga) {
    //         favorite = favorite.find((item : any) => item.id !== manga.mal_id);
    //     }else{
    //         favorite.push({
    //             id: manga.mal_id,
    //             title: manga.title,
    //             image: manga.images?.jpg?.large_image_url,
    //             price: manga.price
    //
    //         })
    //     };
    //     localStorage.setItem("favorite", JSON.stringify(favorite));
    //
    // }

    // ici je déclare une fonction qui va me permettre d'ajouter des donner à mon localStorage pour le panier
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
    if (loading){
        return(
            <div className="flex justify-center items-center">
                <p>tqt attend le s ca arrive</p>
            </div>
        )
    }


    return (
      <main>
          <section className="bg-[#f6f6f6]">
              <div className="bg-black h-[40vh] w-[25%] relative">
                  <h1 className="text-5xl font-black text-[red] absolute left-[23%] bottom-[28%] transform scale-y-175 tracking-tight">BEST-SELLER</h1>
              </div>
          </section>
          <section className="flex w-full h-[80vh] justify-center pb-8 bg-[#f6f6f6] ">

              {manga.length > 0 && (
                  <div className="relative flex items-center justify-center gap-15 bottom-15">
                      {/*onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}*/}
                      <button
                          onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? manga.length - 3 : prevIndex - 1))}
                          className="absolute left-[-50px] bg-black text-white p-2 rounded-full z-10">
                          ◀
                      </button>

                      <button
                          onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % (manga.length - 2))}
                          className="absolute right-[-50px] bg-black text-white p-2 rounded-full z-10">
                          ▶
                      </button>

                      {
                          manga.slice(currentIndex, currentIndex + 3).map((mangas, index) => {
                              // le regex de slug doit être fait dans la boucle pour prendre le bon titre et comme c'est une création de variable il faut ouvrir {} a la place de () et faire un return
                              const slug = mangas.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                              const price = getFixedPrice(mangas.mal_id);
                              return (

                                  <Link key={mangas.mal_id} href={`/card/${slug}`}>
                                      <div key={mangas.mal_id}
                                           className={`relative flex justify-center w-110 h-170 shadow-[20px_20px_0px_6px_#000000]`}>
                                          <Image src={mangas.images?.jpg?.large_image_url} alt={mangas.title}
                                                 layout="fill"
                                                 objectFit="cover" className=""/>
                                          <div
                                              className="absolute bg-[white] border-[black] border-2 w-[80%] h-[40%] bottom-[5%] left-[-5%] p-5">
                                              <h1 className="text-5xl font-black">{mangas.title.substring(0, 13)}</h1>
                                              <p className="text-md w-[90%] pt-2">{mangas.synopsis.substring(0, 200)}...</p>
                                              <p className="text-lg font-bold text-red-600 mt-2">Prix: {price}€</p>
                                              {/*ici on envoie les données avec le clique*/}
                                              <button onClick={() => addToCart(mangas, price)}
                                                      className="text-white bg-blue-500 px-3 py-2 rounded mt-2">
                                                  Ajouter au panier
                                              </button>
                                              {/*<div className="like-wrapper" onClick={() => toggleManga(mangas, price)}>*/}
                                              {/*    <input className="check" type="checkbox"*/}
                                              {/*           id={`like-toggle-${mangas.mal_id}`}/>*/}
                                              {/*    <label className="container" htmlFor={`like-toggle-${mangas.mal_id}`}>*/}
                                              {/*        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"*/}
                                              {/*             className="icon inactive">*/}
                                              {/*            /!*<path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>*!/*/}
                                              {/*        </svg>*/}
                                              {/*        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"*/}
                                              {/*             className="icon active">*/}
                                              {/*            /!*<path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>*!/*/}
                                              {/*        </svg>*/}
                                              {/*        <div className="checkmark"></div>*/}
                                              {/*        <span className="like-text">Like</span>*/}
                                              {/*    </label>*/}
                                              {/*</div>*/}

                                          </div>
                                      </div>
                                  </Link>
                              )
                          })
                      }
                  </div>

              )}
          </section>
          <section
              className="h-[75vh] w-[100%] bg-[src:/vague-rouge.jpg] flex justify-center pb-8 bg-cover bg-center items-center gap-2"
              style={{backgroundImage: "url('/vague-rouge.jpeg')"}}>
              <StatuManga/>
          </section>
          <section className="pt-45 ">
              <div className="relative flex items-center  w-[100%] h-[2vh] bg-[#111111]">
                  <div className="absolute bg-[#111111] h-[25vh] w-[80%] flex items-center justify-center ">
                      <h1 className="text-8xl font-black text-[red] absolute transform scale-y-250 scale-x-150 tracking-tight right-[12%] bottom-3 text-shadow-black">TENDANCE</h1>
                  </div>
              </div>
          </section>
          <section className={`flex flex-col w-full pt-[20vh] mb-[10vh]`}>
              <div>
                  <div className={`pl-20`}>
                      <h1 className="text-5xl font-black text-[#2B3A67] pl-[15%] transform scale-y-150 scale-x-150">ACTION</h1>
                  </div>
                  <div className="text-md font-black text-[#2B3A67] transform text-right">
                      <Link href={'/tri'}>
                          <p className={`text-right pr-[10%]`}>see more --- </p>
                      </Link>
                  </div>
              </div>
              <div className="flex justify-center">
                  <ActionManga/>
              </div>
              <div className={`pt-10`}>
                  <div className={`pl-20`}>
                      <h1 className="text-5xl font-black text-[#2B3A67] pl-[15%] transform scale-y-150 scale-x-150">Romance</h1>
                  </div>
                  <div className="text-md font-black text-[#2B3A67] transform text-right">
                      <Link href={'/tri'}>
                          <p className={`text-right pr-[10%]`}>see more --- </p>
                      </Link>
                  </div>
              </div>
              <div className="flex justify-center">
                  <RomanceManga/>
              </div>
          </section>
      </main>


    );
}
