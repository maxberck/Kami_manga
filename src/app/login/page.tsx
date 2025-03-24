'use client'

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTheme } from "next-themes";

// Define a type for user object
interface User {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [users, setUsers] = useState<User[]>([])
    const {theme} = useTheme()

    useEffect(() => {
        // Retrieve users from local storage and parse them
        const storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]")
        setUsers(storedUsers)
    }, [])

    // Prevent page reload when submitting the form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Login
        if (isLogin) {
            // Find a user with the entered email and password
            const user = users.find((user) => user.email === email && user.password === password)
            // If user exists
            if (user) {
                // Set login status to true
                localStorage.setItem("isLogin", "true")
                // Show success message
                toast.success("Connexion réussie !", { autoClose: 2000 })
                // Redirect to cart
                router.push("/cart")
            } else {
                toast.error("Email ou mot de passe incorrect.", { autoClose: 2000 })
            }
            // Registration
        } else {
            // Check if email already exists
            if (users.some((user) => user.email === email)) {
                toast.error("Cet email est déjà utilisé.", { autoClose: 2000 })
                return
            }
            // Create a new user
            const newUser: User = { email, password }
            // Add to users array
            const updatedUsers: User[] = [...users, newUser]
            setUsers(updatedUsers)
            // Add to localStorage
            localStorage.setItem("users", JSON.stringify(updatedUsers))
            // Set login status and redirect
            localStorage.setItem("isLogin", "true")
            toast.success("Inscription réussie !", { autoClose: 2000 })
            router.push("/cart")
        }
    }

    return (
        <div className={`flex min-h-screen bg-gradient-to-b ${theme === 'dark' ? 'from-gray-900 to-black text-white' : 'to-white text-black '}`}>
            <div className="hidden md:block w-1/2 bg-white bg-cover bg-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-opacity-50 ${theme === 'dark' ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-red-500 transform skew-y-3">
                        KAMI<span className={`${theme === 'dark'? 'text-white': 'text-black'}`}>MANGA</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold italic">Votre portail vers le panthéon des mangas</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md relative">
                    <div className="md:hidden text-center mb-8">
                        <h1 className="text-4xl font-black tracking-tighter mb-2 text-red-500 transform skew-y-3">
                            KAMI<span className={`${theme === 'dark'? 'text-white': 'text-black'}`}>MANGA</span>
                        </h1>
                        <p className="text-lg font-bold italic">Votre portail vers le panthéon des mangas</p>
                    </div>
                    <div className={`border-2 border-red-500 p-6 md:p-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(220,38,38,0.8)] transform transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(220,38,38,0.8)] hover:-translate-y-1 ${theme === 'dark'? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div className="flex mb-6 border-b border-gray-700">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`w-1/2 py-2 text-center font-bold text-lg transition-colors ${isLogin ? "text-red-500 border-b-2 border-red-500" : `${theme === 'dark'? 'text-gray-400' : 'text-gray-800'}`}`}>
                                Connexion
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`w-1/2 py-2 text-center font-bold text-lg transition-colors ${!isLogin ? "text-red-500 border-b-2 border-red-500" : `${theme === 'dark'? 'text-gray-400' : 'text-gray-800'}`}`}>
                                Inscription
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {isLogin ? "Connectez-vous à votre compte" : "Rejoignez notre communauté"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-700 text-white': 'bg-gray-300 text-black'}`}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-700 text-white': 'bg-gray-300 text-black'}`}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-bold text-lg transition-colors transform hover:scale-[1.02] active:scale-[0.98] duration-200"
                            >
                                {isLogin ? "Se connecter" : "S'inscrire"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-black'}`}>
                                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 text-red-400 hover:text-red-300 font-medium transition-colors"
                                >
                                    {isLogin ? "S'inscrire" : "Se connecter"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}