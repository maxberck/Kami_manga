import Link from "next/link"
import Image from "next/image"

interface MangaEditorialCardProps {
  title: string
  image?: string
  rank?: number
  href: string
  eyebrow?: string
  synopsis?: string
}

export default function MangaEditorialCard({ title, image, rank, href, eyebrow = "Manga sélectionné", synopsis }: MangaEditorialCardProps) {
  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden border kami-line bg-[var(--kami-paper-strong)]">
        <div className="relative aspect-[3/4] overflow-hidden">
          {image ? <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="absolute inset-0 bg-[var(--kami-paper-strong)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
          {rank && <span className="absolute left-3 top-3 bg-[var(--kami-red)] px-2 py-1 text-[9px] tracking-[.25em] text-white">N° {String(rank).padStart(2, "0")}</span>}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
            <p className="text-[8px] uppercase tracking-[.3em] opacity-70">{eyebrow}</p>
            <h3 className="kami-display mt-1 text-2xl md:text-3xl leading-none">{title}</h3>
          </div>
        </div>
        {synopsis && <p className="line-clamp-2 px-4 py-4 text-xs leading-5 text-[var(--kami-muted)]">{synopsis}</p>}
        <div className="flex justify-between border-t kami-line px-4 py-3 text-[9px] uppercase tracking-[.22em] text-[var(--kami-muted)]"><span>Découvrir</span><span className="transition-transform group-hover:translate-x-1">→</span></div>
      </article>
    </Link>
  )
}
