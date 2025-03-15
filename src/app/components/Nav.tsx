import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
    const [cart, setCart] = useState<any[]>([]);

    // charger le panier depuis un localStorage
    useEffect(() => {
        const saveCart = localStorage.getItem("cart");
        if (saveCart) {
            setCart(JSON.parse(saveCart));
        }
    }, []);

    // mise à jour locale storage à chaque changement
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    const itemCount = cart.reduce((total, manga) => total + (manga.quantity || 0), 0);

    return (
        <nav className="flex justify-around p-5 text-white items-center border-[#000000] border-b-5 bg-[#f6f6f6]">
            <h1 className="text-6xl font-black text-[#2B3A67]">KAMI MANGA</h1>
            <ul className="flex gap-6 text-3xl text-[#2B3A67]">
                <li><Link href={`/`}>Accueil</Link></li>
                <li>Anime</li>
                <li><Link href={`/tri`}>Manga</Link></li>
                <li><Link href={`/cart`}>Panier : {itemCount}</Link></li>
            </ul>
        </nav>
    );
}
