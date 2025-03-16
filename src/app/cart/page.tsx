'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {toast} from "react-toastify/unstyled";
import "react-toastify/dist/ReactToastify.css";

// interfaces permet de garantir qu'un objet respecte une structure spécifique et limite les erreurs.
interface CartManga {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export default function Cart() {
    const [cart, setCart] = useState<CartManga[]>([]);
    const [isLogin, setIsLogin] = useState(false);

    // charger les donner du local storage
    useEffect(() => {
        const userCo = localStorage.getItem("isLogin");
        setIsLogin(userCo === 'true')

        // ici je récupère les données depuis le Storage avec la clef d'accès "cart" ps: c'est dans un useEffect
        const storedManga = localStorage.getItem("cart");
        // si elle existe
        if (storedManga) {
            // je convertis les données en tableau puis je met à jour l'état du panier ( c'est à dire le state )
            setCart(JSON.parse(storedManga));
        }
    }, []);

    const handlePay = ()=>{
        if (!isLogin) {
            toast.error("Veuillez vous connecter pour payer.", { autoClose: 3000 })
            return;
        }
        toast.success("Veuillez vous connecter pour payer.", {autoClose: 3000});
        localStorage.removeItem("cart");
        setCart([])
    }

    // synchroniser le localStorage à chaque fois que le panier change
    useEffect(() => {
        if (cart.length > 0) {
            // on enregistre les données avec les clefs ("cart") et la valeur est (cart = un tableau contenant des objets ici les données ajouté au panier)
            // stringify convertit le tableau en une chaîne JSON pour qu'il puisse être enregistré
            localStorage.setItem("cart", JSON.stringify(cart));
        // sinon
        } else {
            // si le panier est vide on retire la clef "cart"
            localStorage.removeItem("cart");
        }
    // [cart] fait que ça s'exécute à chaque changement du panier ATTENTION ne pas oublier la virgule avant
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
        // on vide notre state
        setCart([]);
        // et ici on supprime la clef d'accès
        localStorage.removeItem("cart"); // ps: le mettre sur payer et faire comme si c'était payé
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
                    <Link href="/">
                        <button onClick={handlePay} disabled={!isLogin} className={`mt-4 px-4 py-2 rounded ${ isLogin ? "bg-green-500" : "bg-gray-500 cursor-not-allowed"}`}>
                            Payer
                        </button>
                        {!isLogin && (
                            <p className="mt-2">
                                <Link href="/login">
                                    <span className="text-blue-500 underline">Connectez-vous pour payer</span>
                                </Link>
                            </p>
                        )}
                    </Link>
                </div>
            )}
        </main>
    );
}
