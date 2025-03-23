'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-toastify/unstyled"
import "react-toastify/dist/ReactToastify.css"
import { useTheme } from "next-themes";

// interfaces permet de garantir qu'un objet respecte une structure spécifique et limite les erreurs.
interface CartManga {
    id: number
    title: string
    price: number
    quantity: number
    image: string
}

export default function Cart() {
    const [cart, setCart] = useState<CartManga[]>([])
    const [isLogin, setIsLogin] = useState(false)
    const {theme} = useTheme()

    // charger les donner du local storage
    useEffect(() => {
        const userCo = localStorage.getItem("isLogin")
        setIsLogin(userCo === "true")

        // ici je récupère les données depuis le Storage avec la clef d'accès "cart" ps: c'est dans un useEffect
        const storedManga = localStorage.getItem("cart")
        // si elle existe
        if (storedManga) {
            // je convertis les données en tableau puis je met à jour l'état du panier ( c'est à dire le state )
            setCart(JSON.parse(storedManga))
        }
    }, [])

    // gestion du payement coté design
    const handlePay = () => {
        // si pas connecter
        if (!isLogin) {
            toast.error("Veuillez vous connecter pour payer.", { autoClose: 3000 })
            return
        }
        // si t'es connecté
        toast.success("Merci de votre achat.", { autoClose: 3000 })
        localStorage.removeItem("cart")
        setCart([])
    }

    // synchroniser le localStorage à chaque fois que le panier change
    useEffect(() => {
        if (cart.length > 0) {
            // on enregistre les données avec les clefs ("cart") et la valeur est (cart = un tableau contenant des objets ici les données ajouté au panier)
            // stringify convertit le tableau en une chaîne JSON pour qu'il puisse être enregistré
            localStorage.setItem("cart", JSON.stringify(cart))
            // sinon
        } else {
            // si le panier est vide on retire la clef "cart"
            localStorage.removeItem("cart")
        }
        // [cart] fait que ça s'exécute à chaque changement du panier ATTENTION ne pas oublier la virgule avant
    }, [cart])

    // retire l'élément du panier
    const removeCart = (id: number) => {
        setCart((prevManga) => prevManga.filter((manga) => manga.id !== id))
    }

    //  ajouter un élément au panier
    const plusQant = (id: number) => {
        setCart((prevManga) => prevManga.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
    }
    //  retirer un élément du panier
    const moinsQant = (id: number) => {
        setCart((prevManga) =>
            prevManga.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)),
        )
    }

    const clearCart = () => {
        // on vide notre state
        setCart([])
        // et ici on supprime la clef d'accès
        localStorage.removeItem("cart") // ps: le mettre sur payer et faire comme si c'était payé
    }

    // le prix totale
    const totalPrice = () => {
        return cart.reduce((total, manga) => total + (manga.price ? manga.price * (manga.quantity || 1) : 0), 0).toFixed(2)
    }

    return (
        <main className={`min-h-screen py-8 px-4 md:px-10 lg:px-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className={`"text-3xl md:text-5xl font-black transform scale-y-110" ${theme === 'dark' ? 'text-black' : 'text-[#2B3A67]'}`}>MON PANIER</h1>
                    <div className="h-1 flex-grow mx-4 bg-red-500"></div>
                </div>

                {cart.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center py-16 rounded-lg shadow-md border-2 border-gray-200 ${theme === 'dark'? 'bg-gray-700' : 'bg-white'}`}>
                        <div className="w-32 h-32 mb-6 flex items-center justify-center rounded-full bg-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark'?'text-black':'text-gray-700'}`}>Votre panier est vide</h2>
                        <p className={`mb-6 ${theme === 'dark'?'text-gray-900':'text-gray-500'}`}>Découvrez notre collection de mangas et ajoutez vos favoris !</p>
                        <Link href="/tri">
                            <button className="px-6 py-3 bg-[#2B3A67] text-white font-bold rounded-md hover:bg-[#1d2a4d] transition-colors shadow-lg transform hover:scale-105 duration-200">
                                Explorer les mangas
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className={`rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 ${theme === 'dark'? 'bg-gray-600' : 'bg-white'}`}>
                        <div className={`hidden md:grid grid-cols-12 gap-4 p-4 font-bold ${theme === 'dark'?'text-black bg-gray-700':'text-[#2B3A67] bg-gray-100'}`}>
                            <div className="col-span-6">Produit</div>
                            <div className="col-span-2 text-center">Prix</div>
                            <div className="col-span-2 text-center">Quantité</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {cart.map((manga) => (
                                <div
                                    key={manga.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center transition-colors"
                                >
                                    <div className="md:col-span-6 flex items-center gap-4">
                                        <div className="relative w-20 h-28 md:w-16 md:h-24 flex-shrink-0 border-2 border-gray-200 overflow-hidden">
                                            <Image
                                                src={manga.image || "/placeholder.svg"}
                                                alt={manga.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                        <div>
                                            <h2 className={`text-lg font-bold ${theme === 'dark'?'text-black':'text-[#2B3A67]'}`}>{manga.title}</h2>
                                            <p className="text-sm text-gray-500 md:hidden">
                                                {manga.price ? manga.price.toFixed(2) : "Prix inconnu"}€
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 text-center hidden md:block">
                                        <span className="font-bold text-red-600">
                                          {manga.price ? manga.price.toFixed(2) : "Prix inconnu"}€
                                        </span>
                                    </div>

                                    <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                                        <span className="md:hidden font-medium">Quantité:</span>
                                        <div className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden">
                                            <button
                                                onClick={() => moinsQant(manga.id)}
                                                className={`w-8 h-8 flex items-center justify-center transition-colors ${theme === 'dark'? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 h-8 flex items-center justify-center font-medium">{manga.quantity}</span>
                                            <button
                                                onClick={() => plusQant(manga.id)}
                                                className={`w-8 h-8 flex items-center justify-center transition-colors ${theme === 'dark'? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                                        <span className="md:hidden font-medium">Actions:</span>
                                        <button
                                            onClick={() => removeCart(manga.id)}
                                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            <span className="hidden md:inline">Supprimer</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`p-6 border-t-2 border-gray-200 ${theme === 'dark'?'bg-gray-700':'bg-gray-50'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <button
                                    onClick={clearCart}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Vider le panier
                                </button>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <div className={`text-xl font-bold ${theme === 'dark'?'text-black':'text-[#2B3A67]'}`}>
                                        Total: <span className="text-red-600">{totalPrice()}€</span>
                                    </div>

                                    <Link href="/" className="w-full md:w-auto">
                                        <button
                                            onClick={handlePay}
                                            disabled={!isLogin}
                                            className={`w-full md:w-auto px-6 py-3 rounded-md font-bold text-white shadow-md transition-all transform hover:scale-105 duration-200 ${
                                                isLogin ? "bg-[#2B3A67] hover:bg-[#1d2a4d]" : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            Payer maintenant
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-yellow-700 flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        Vous devez être connecté pour finaliser votre achat.
                                    </p>
                                    <Link href="/login">
                                        <button className="mt-2 px-4 py-2 bg-white border border-[#2B3A67] text-[#2B3A67] rounded-md hover:bg-[#2B3A67] hover:text-white transition-colors">
                                            Se connecter
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

