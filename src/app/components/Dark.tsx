'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Dark() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Empêche le clignotement au chargement

    return (
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`w-11 h-11 rounded-full transition-colors ${theme === 'dark'? 'bg-black': 'bg-blue-400' }`}>
            {theme === "dark" ? "🌙️" : " ☀️"}
        </button>

    );
}
