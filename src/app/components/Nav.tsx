'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";


export default function Nav() {
    const [cart, setCart] = useState<any[]>([]);
    const [isLogin, setIsLogin] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userCo = localStorage.getItem("isLogin");
        setIsLogin(userCo === 'true')
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLogin");
        setIsLogin(false);
    }

    // charger le panier depuis un localStorage
    useEffect(() => {
        // on récupère des données garce à notre clef d'accès
        const saveCart = localStorage.getItem("cart");
        // si elle existe
        if (saveCart) {
            // on le convertit en JSON avec parse et on l'ajoute à notre state
            setCart(JSON.parse(saveCart));
        }
    }, []);

    // mise à jour locale storage à chaque changement
    useEffect(() => {
        // si le panier contient des élément donc plus grand que 0
        if (cart.length > 0) {

            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    const itemCount = cart.reduce((total, manga) => total + (manga.quantity || 0), 0);

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        if (search.trim()) {
            router.push(`/tri?query=${encodeURIComponent(search)}`);
        }
    }

    return (
        <nav
            className="flex justify-around items-center p-5 text-white items-center border-[#000000] border-b-5 bg-[#f6f6f6] ">
            <h1 className="text-6xl font-black text-[#2B3A67]">KAMI MANGA</h1>
            <form onSubmit={handleSearch} className="form relative">
                <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
                    <svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                         aria-labelledby="search" className="w-5 h-5 text-gray-700">
                        <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                              stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <input
                    className="input rounded-full px-18 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md text-black"
                    placeholder="Search Manga..." required type="text" value={search}
                    onChange={(e) => setSearch(e.target.value)}/>
                <button type="reset" className="absolute right-3 -translate-y-1/2 top-1/2 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </form>
            <ul className="flex gap-6 text-xl text-[#2B3A67] items-center">
                <li><Link href={`/`}>Accueil</Link></li>
                <li><Link href={`/anime`}>Anime</Link></li>
                <li><Link href={`/tri`}>Manga</Link></li>
                {isLogin ? (
                    <button onClick={handleLogout}
                            className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
                        <div
                            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                                <path
                                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
                            </svg>
                        </div>
                        <div
                            className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Logout
                        </div>
                    </button>
                ) : (
                    <Link href="/login">
                        <button
                            className="group flex items-center justify-start w-11 h-11 bg-black rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
                            <div
                                className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="white">
                                    <path
                                        d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                                </svg>
                            </div>
                            <div
                                className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                Login
                            </div>
                        </button>
                    </Link>
                )}
                <li><Link href={`/cart`}>
                    <button
                        className="bg-black w-11 h-11 flex  items-center justify-center rounded-full shadow-lg  relative text-3xl">
                        <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 576 512"
                             className="w-4 md:w-auto h-4 md:h-auto">
                            <path fill="#ffff"
                                  d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                        </svg>
                        <span
                            className="absolute -top-1 -right-1 text-xs bg-red-500 text-white py-0.5 rounded-full h-5 w-5 text-center">{itemCount}</span>
                    </button>
                </Link></li>
            </ul>
        </nav>
    );
}
