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
    const prices = [5.99, 7.49, 9.99, 12.99, 14.99];
    const getFixedPrice = (id: number) => prices[id % prices.length];

    useEffect(() => {
        async function fetchManga(){
            try {
                const response = await fetch('/api/manga');
                const data = await response.json();

                console.log("Réponse brute de l'API :", response);
                console.log("Données JSON reçues :", data);

                if (!data || !data.data) {
                    throw new Error("Données invalides reçues de l'API");
                }

                // sort permet de tri des données en comparant a et b en soustrayant b à a fonction si il n'y  apas de NaN et de infinity
                const rankManga = data.data.filter((manga: any ) => manga.rank !== null && manga.rank !== undefined).sort((a: any, b: any) => a.rank - b.rank).slice(0, 6);
                setManga(rankManga);
                console.log("Mangas triés par rank :", rankManga);
            }catch (error) {
                console.log(`Erreur trouver lors du chargement des mangas : ${error}`);
            }
        }
        fetchManga()
    }, []);


    // const nextManga = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex + 3)% manga.length);
    // }
    // const prevManga = () => {
    //     setCurrentIndex((prevIndex) => prevIndex === 0? manga.length - 3 : prevIndex - 3);
    // }

    return (
      <main>
          <header>
              <Nav/>
          </header>
          <section className="bg-[#f6f6f6]">
              <div className="bg-black h-[40vh] w-[25%] relative">
                  <h1 className="text-5xl font-black text-[red] absolute left-[23%] bottom-[28%] transform scale-y-175 tracking-tight">BEST-SELLER</h1>
              </div>
          </section>
          <section className="flex w-full h-[80vh] justify-center pb-8 bg-[#f6f6f6] ">

              {manga.length > 0 && (
                  <div className="relative flex items-center justify-center gap-15 bottom-15">
                      {
                          manga.slice(currentIndex, currentIndex + 3).map((mangas, index) => {
                              // le regex de slug doit être fait dans la boucle pour prendre le bon titre et comme c'est une création de variable il faut ouvrir {} a la place de () et faire un return
                              const slug = mangas.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                              const price = getFixedPrice(mangas.mal_id);
                              return (

                              <Link key={mangas.mal_id} href={`/card/${slug}`}>
                                  <div key={mangas.mal_id}
                                       className={`relative flex justify-center w-110 h-170 shadow-[20px_20px_0px_6px_#000000]`}>
                                      <Image src={mangas.images?.jpg?.large_image_url} alt={mangas.title} layout="fill"
                                             objectFit="cover" className=""/>
                                      <div
                                          className="absolute bg-[white] border-[black] border-2 w-[80%] h-[40%] bottom-[5%] left-[-5%] p-5">
                                          <h1 className="text-5xl font-black">{mangas.title.substring(0, 13)}</h1>
                                          <p className="text-md w-[90%] pt-2">{mangas.synopsis.substring(0, 200)}...</p>
                                          <p className="text-lg font-bold text-red-600 mt-2">Prix: {price}€</p>
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
                  <div>
                      <h1 className="text-7xl font-black text-[#2B3A67] absolute  transform scale-y-150 scale-x-150 left-[5%] top-[25vh]">ACTION</h1>
                  </div>
                  <div className="text-md font-black text-[#2B3A67] absolute  transform right-[10%] top-[32vh]">
                      <Link href={'/tri'}>
                          <p>see more --- </p>
                      </Link>
                  </div>
              </div>
              <div className="flex justify-center">
                  <ActionManga />
              </div>
              <div className="flex justify-center">
                  <RomanceManga />
              </div>
          </section>
      </main>


  );
}
