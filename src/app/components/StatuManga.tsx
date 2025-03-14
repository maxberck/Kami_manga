import { useEffect, useState } from "react";

export default function StatuManga() {
    const [status, setStatus] = useState<string[]>([]);

    useEffect(() => {
        async function fetchManga(){
            const resp = await fetch("/api/manga");
            const data = await resp.json();

            const statuUni = Array.from(new Set(data.data.map((manga: any) => manga.status) ));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setStatus(statuUni)
            console.log(statuUni)
        }
        fetchManga();
    }, []);
    return (
        <div>
            {
                status.map((statu) => (
                    <button key={statu} className="bg-[white] px-5 rounded-full text-3xl">{statu}</button>
                ))
            }
        </div>
    )
}