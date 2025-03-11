import Image from "next/image";

export default function Nav() {
    return (
        <nav className="flex justify-around p-5 text-white items-center border-[#000000] border-b-5 bg-[#f6f6f6]">
            <h1 className="text-6xl font-black text-[#2B3A67]">KAMI MANGA</h1>
            <ul className="flex gap-6 text-3xl text-[#2B3A67]">
                <li>Accueil</li>
                <li>Anime</li>
                <li>Manga</li>
            </ul>
        </nav>
    );
}
