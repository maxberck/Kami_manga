'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

// @ts-ignore
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
        <nav className="flex justify-around p-5 text-white items-center border-[#000000] border-b-5 bg-[#f6f6f6]">
            <h1 className="text-6xl font-black text-[#2B3A67]">KAMI MANGA</h1>
            <ul className="flex gap-6 text-3xl text-[#2B3A67]">
                <li><Link href={`/`}>Accueil</Link></li>
                <li>Anime</li>
                <li><Link href={`/tri`}>Manga</Link></li>
                {isLogin ? (
                    <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
                        Logout
                    </button>
                ) : (
                    <Link href="/login">
                        <button className="bg-blue-500 px-4 py-2 rounded">
                            Login / Sign Up
                        </button>
                    </Link>
                )}
                <li><Link href={`/cart`}>Panier : {itemCount}</Link></li>
            </ul>
            <form onSubmit={handleSearch} className="flex items-center">
                <input
                    type="text"
                    placeholder="Rechercher un manga..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-2 p-2 rounded-md"
                />
                <button type="submit" className="ml-2 bg-blue-500 px-4 py-2 rounded text-white">Rechercher</button>
            </form>
        </nav>
    );
}
