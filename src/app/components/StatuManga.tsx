'use client'

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function StatuManga() {
    const { theme } = useTheme()
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 14,
        minutes: 35,
        seconds: 42,
    })

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => {
                // Calculer le nouveau temps
                let newSeconds = prev.seconds - 1
                let newMinutes = prev.minutes
                let newHours = prev.hours
                let newDays = prev.days

                if (newSeconds < 0) {
                    newSeconds = 59
                    newMinutes -= 1
                }

                if (newMinutes < 0) {
                    newMinutes = 59
                    newHours -= 1
                }

                if (newHours < 0) {
                    newHours = 23
                    newDays -= 1
                }

                // si le compte à rebours est terminé, on arrête
                if (newDays < 0) {
                    clearInterval(intervalId)
                    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
                }

                return {
                    days: newDays,
                    hours: newHours,
                    minutes: newMinutes,
                    seconds: newSeconds,
                }
            })
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div>
            <div className={`max-w-lg mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-8 border-2 border-red-500`}>
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        <span className="text-red-500">-30%</span>
                    </h2>
                    <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Offre limitée</p>
                </div>
                {/* compte à rebours */}
                <div className="flex justify-center gap-4">
                    {[
                        { value: timeLeft.days, label: "Jours" },
                        { value: timeLeft.hours, label: "Heures" },
                        { value: timeLeft.minutes, label: "Min" },
                        { value: timeLeft.seconds, label: "Sec" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`relative w-20 md:w-24 h-20 md:h-24 flex flex-col items-center justify-center rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} overflow-hidden transition-all duration-300 transform hover:scale-105`}>
                            {/* barre de progression qui descend */}
                            <div
                                className="absolute top-0 left-0 w-full bg-red-500 opacity-20"
                                style={{
                                    height:
                                        index === 3
                                            ? `${(timeLeft.seconds / 60) * 100}%`
                                            : index === 2
                                                ? `${(timeLeft.minutes / 60) * 100}%`
                                                : index === 1
                                                    ? `${(timeLeft.hours / 24) * 100}%`
                                                    : `${(timeLeft.days / 3) * 100}%`,
                                    transition: "height 1s linear",
                                }}
                            ></div>

                            <span className="text-2xl md:text-3xl font-bold text-red-500 z-10">
                {item.value.toString().padStart(2, "0")}
              </span>
                            <span className={`text-xs md:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"} z-10`}>
                {item.label}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

