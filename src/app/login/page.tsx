'use client'

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface User {
    email: string
    password: string
}

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]")
        setUsers(storedUsers)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isLogin) {
            const user = users.find((item) => item.email === email && item.password === password)
            if (user) {
                localStorage.setItem("isLogin", "true")
                toast.success("Connexion réussie !", { autoClose: 2000 })
                router.push("/cart")
            } else {
                toast.error("Email ou mot de passe incorrect.", { autoClose: 2000 })
            }
            return
        }

        if (users.some((item) => item.email === email)) {
            toast.error("Cet email est déjà utilisé.", { autoClose: 2000 })
            return
        }

        const updatedUsers = [...users, { email, password }]
        setUsers(updatedUsers)
        localStorage.setItem("users", JSON.stringify(updatedUsers))
        localStorage.setItem("isLogin", "true")
        toast.success("Inscription réussie !", { autoClose: 2000 })
        router.push("/cart")
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--kami-paper)] text-[var(--kami-ink)]">
            <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_15%_20%,rgba(178,31,45,0.08),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(23,23,23,0.06),transparent_30%)]" />
            <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-12">
                <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                    <section className="hidden lg:flex flex-col justify-between border-r border-[var(--kami-line)] pr-16">
                        <div>
                            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-[var(--kami-red)]">漫画案内所</p>
                            <h1 className="font-serif text-[clamp(4.5rem,8vw,8rem)] leading-[0.82] tracking-[-0.07em]">KAMI<span className="text-[var(--kami-red)]">.</span></h1>
                            <p className="mt-8 max-w-sm text-sm leading-7 text-[var(--kami-muted)]">Votre bibliothèque manga, pensée comme une véritable édition japonaise.</p>
                        </div>
                        <div className="flex items-end justify-between gap-8">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--kami-muted)]">Lecture · Collection · Découverte</span>
                            <span className="vertical-japanese text-sm tracking-[0.3em] text-[var(--kami-red)]">漫画を読む</span>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-xl">
                        <div className="mb-10 lg:hidden">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--kami-red)]">漫画案内所</p>
                            <h1 className="font-serif text-6xl leading-none tracking-[-0.06em]">KAMI<span className="text-[var(--kami-red)]">.</span></h1>
                        </div>

                        <div className="relative border-y border-[var(--kami-line)] py-8 sm:py-10">
                            <span className="absolute -right-1 top-8 vertical-japanese text-xs tracking-[0.25em] text-[var(--kami-muted)]">{isLogin ? "会員入口" : "新規登録"}</span>
                            <div className="pr-8 sm:pr-10">
                                <div className="mb-9 flex gap-8 border-b border-[var(--kami-line)]">
                                    <button type="button" onClick={() => setIsLogin(true)} className={`relative pb-4 text-sm font-semibold transition-colors ${isLogin ? "text-[var(--kami-red)]" : "text-[var(--kami-muted)]"}`}>
                                        Connexion
                                        {isLogin && <span className="absolute inset-x-0 -bottom-px h-px bg-[var(--kami-red)]" />}
                                    </button>
                                    <button type="button" onClick={() => setIsLogin(false)} className={`relative pb-4 text-sm font-semibold transition-colors ${!isLogin ? "text-[var(--kami-red)]" : "text-[var(--kami-muted)]"}`}>
                                        Inscription
                                        {!isLogin && <span className="absolute inset-x-0 -bottom-px h-px bg-[var(--kami-red)]" />}
                                    </button>
                                </div>

                                <div className="mb-9">
                                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--kami-red)]">{isLogin ? "Espace membre" : "Rejoindre KAMI"}</p>
                                    <h2 className="font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">{isLogin ? "Retrouvez votre collection." : "Commencez votre collection."}</h2>
                                    <p className="mt-4 max-w-md text-sm leading-6 text-[var(--kami-muted)]">{isLogin ? "Connectez-vous pour retrouver vos sélections et poursuivre votre commande." : "Créez votre espace personnel pour conserver vos mangas favoris."}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-7">
                                    <label className="block">
                                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--kami-muted)]">Email</span>
                                        <input id="email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border-0 border-b border-[var(--kami-line)] bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-[var(--kami-muted)]/60 focus:border-[var(--kami-red)]" />
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--kami-muted)]">Mot de passe</span>
                                        <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border-0 border-b border-[var(--kami-line)] bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-[var(--kami-muted)]/60 focus:border-[var(--kami-red)]" />
                                    </label>
                                    <button type="submit" className="group flex w-full items-center justify-between border border-[var(--kami-ink)] px-5 py-4 text-sm font-bold transition-all duration-200 hover:border-[var(--kami-red)] hover:bg-[var(--kami-red)] hover:text-white">
                                        <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
                                        <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
                                    </button>
                                </form>

                                <p className="mt-8 text-center text-xs text-[var(--kami-muted)]">
                                    {isLogin ? "Pas encore de compte ?" : "Déjà membre ?"}{" "}
                                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-semibold text-[var(--kami-ink)] underline decoration-[var(--kami-red)] underline-offset-4 transition-colors hover:text-[var(--kami-red)]">
                                        {isLogin ? "Créer un compte" : "Se connecter"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
