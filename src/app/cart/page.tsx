'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartManga {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export default function Cart() {
    const [cart, setCart] = useState<CartManga[]>([]);
    const router = useRouter();

    // charger les donner du local storage
    useEffect(() => {
        const storedManga = localStorage.getItem("cart");
        if (storedManga) {
            setCart(JSON.parse(storedManga));
        }
    }, []);

    // synchroniser le localStorage à chaque fois que le panier change
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cart]);


    const removeCart = (id: number) => {
        setCart((prevManga) => prevManga.filter((manga) => manga.id !== id));
    };

    const plusQant = (id: number) => {
        setCart((prevManga) => prevManga.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const moinsQant = (id: number) => {
        setCart((prevManga) => prevManga.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart"); // vide aussi le localStorage ps: le mettre sur payer et voir pour mettre animation après
    };

    const totalPrice = () => {
        return cart.reduce((total, manga) => total + (manga.price ? manga.price * (manga.quantity || 1) : 0), 0).toFixed(2);
    };

    return (
        <main className={`p-10 flex justify-center flex-col`}>
            <h1 className={`text-4xl font-bold`}>Mon panier</h1>
            <div className={`space-y-3`}>
                {cart.length === 0 ? (
                    <p>Y a rien pour le moment achète afou</p>
                ) : (
                    cart.map((manga) => (
                        <div key={manga.id} className={`flex items-center justify-between p-4 border-2`}>
                            <div className="flex items-center gap-4">
                                <Image key={manga.id} src={manga.image} alt={manga.title} width={80} height={80} className="object-cover"/>
                                <div>
                                    <h2 className="text-xl font-semibold">{manga.title}</h2>
                                    <p>{manga.price ? manga.price.toFixed(2) : "Prix inconnu"}€</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => moinsQant(manga.id)}>-</button>
                                <span>{manga.quantity}</span>
                                <button onClick={() => plusQant(manga.id)}>+</button>
                                <button onClick={() => removeCart(manga.id)} className="text-red-500">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {cart.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <button onClick={clearCart} className="bg-red-500 text-white py-2 px-4 rounded">
                        Vider le panier
                    </button>
                    <div className="text-xl">
                        <span>Total: {totalPrice()}€</span>
                    </div>
                    <button onClick={() => router.push('/')} className="bg-green-500 text-white py-2 px-4 rounded">
                        Passer à la caisse
                    </button>
                </div>
            )}
        </main>
    );
}
