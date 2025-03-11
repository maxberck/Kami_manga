'use client'

import { useEffect, useState } from "react";
import Nav from "./components/Nav"
import Image from "next/image"
import StatuManga from "@/app/components/StatuManga";

export default function Home() {
    const [manga, setManga] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoverManga, setHoverManga] = useState<number | null>(null); // gère l'effet hover
    useEffect(() => {
        async function fetchManga(){
            try {
                const response = await fetch('/api/manga');
                const data = await response.json();

                // sort permet de tri des données en comparant a et b en soustrayant b à a fonction si il n'y  apas de NaN et de infinity
                const rankManga = data.data.sort((a: any, b: any) => a.rank - b.rank).slice(0, 6);
                setManga(rankManga);
            }catch (error) {
                console.log(`Erreur trouver lors du chargement des mangas : ${error}`);
            }
        }
        fetchManga()
    }, []);

    const nextManga = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1)% manga.length);
    }
    const prevManga = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0? manga.length - 1 : prevIndex - 1);
    }
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
                          manga.slice(currentIndex, currentIndex + 3).map((mangas, index) => (
                              <div key={mangas.mal_id} className={`relative flex justify-center w-110 h-170 shadow-[20px_20px_0px_6px_#000000]`}>
                                  <Image src={mangas.images?.jpg?.large_image_url} alt={mangas.title} layout="fill"
                                         objectFit="cover" className=""/>
                                  <div
                                      className="absolute bg-[white] border-[black] border-2 w-[80%] h-[40%] bottom-[5%] left-[-5%] p-5">
                                      <h1 className="text-5xl font-black">{mangas.title}</h1>
                                      <p className="text-md w-[90%] pt-2">{mangas.synopsis.substring(0, 200)}...</p>
                                  </div>
                              </div>
                          ))
                      }
                  </div>

              )}

          </section>
          <section className="h-[75vh] w-[100%] bg-[src:/vague-rouge.jpg] flex justify-center pb-8 bg-cover bg-center items-center gap-2" style={{ backgroundImage: "url('/vague-rouge.jpeg')" }}>
                <StatuManga />
          </section>
      </main>


  );
}
