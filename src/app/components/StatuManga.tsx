"use client"

import { useEffect, useState } from "react"

export default function StatuManga() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 35, seconds: 42 })
  useEffect(() => {
    const intervalId = setInterval(() => setTimeLeft((prev) => {
      let seconds = prev.seconds - 1, minutes = prev.minutes, hours = prev.hours, days = prev.days
      if (seconds < 0) { seconds = 59; minutes -= 1 }
      if (minutes < 0) { minutes = 59; hours -= 1 }
      if (hours < 0) { hours = 23; days -= 1 }
      return days < 0 ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : { days, hours, minutes, seconds }
    }), 1000)
    return () => clearInterval(intervalId)
  }, [])
  return <div className="border-y kami-line py-8 md:py-10">
    <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
      <div>
        <p className="text-[9px] uppercase tracking-[.35em] text-[var(--kami-red)]">Édition limitée / 01</p>
        <h3 className="kami-display text-4xl md:text-6xl mt-2">Sélection du moment</h3>
        <p className="mt-3 max-w-md text-xs leading-5 text-[var(--kami-muted)]">Une offre temporaire pensée comme une petite annonce de librairie japonaise.</p>
      </div>
      <div className="grid grid-cols-4 border kami-line">
        {[{ value: timeLeft.days, label: "Jours" }, { value: timeLeft.hours, label: "Heures" }, { value: timeLeft.minutes, label: "Min" }, { value: timeLeft.seconds, label: "Sec" }].map((item) => <div key={item.label} className="w-16 md:w-20 px-2 py-4 text-center border-r last:border-r-0 kami-line"><div className="kami-display text-2xl md:text-3xl">{String(item.value).padStart(2, "0")}</div><div className="text-[8px] uppercase tracking-[.2em] text-[var(--kami-muted)] mt-1">{item.label}</div></div>)}
      </div>
    </div>
  </div>
}
