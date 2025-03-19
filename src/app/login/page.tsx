"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        // je récupère les données users depuis le locale storage puis je le convertit en tableau
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(storedUsers);
    }, []);
    // j'enpèche le rechargemnt de la page lorsque je soumets le formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // connexion
        if (isLogin) {
            // je cherche un utilisateur avec l'email et un mot de passe entrée
            const user = users.find(user => user.email === email && user.password === password);
            // si il existe
            if (user) {
                // je met isLOgin en true
                localStorage.setItem("isLogin", "true");
                // je met un message de connection réussite
                toast.success("Connexion réussie !", { autoClose: 2000 });
                //  je redirige vers le panier
                router.push("/cart");
            // si cest faux je mets un message d'erreur
            } else {
                toast.error("Email ou mot de passe incorrect.", { autoClose: 2000 });
            }
          // inscription
        } else {
            // si l'adresse mail exite deja
            if (users.some(user => user.email === email)) {
                toast.error("Cet email est déjà utilisé.", { autoClose: 2000 });
                return;
            }
            // sinon je crée un nouveau user
            const newUser = { email, password };
             // que j'ajoute à users
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            // je l'ajoute au localStorage
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            // je le redirige
            localStorage.setItem("isLogin", "true");
            toast.success("Inscription réussie !", { autoClose: 2000 });
            router.push("/cart");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {isLogin ? "Connexion" : "Inscription"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required/>
                    <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required/>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                        {isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                </form>

                <p className="text-center mt-4">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 ml-2">
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
    );
}
