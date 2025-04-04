"use client"

import { useEffect, useState } from "react"
import { calculateStreakLength, getDayOfWeek } from "@/lib/streak-utils"
import StreakIndicator from "./streak-indicator"
import { StreakData } from "../types/streak"
import moment from "moment"

interface StreakDisplayProps {
  caseNumber: string
}

export default function StreakDisplay({ caseNumber }: StreakDisplayProps) {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true)
        
        setStreakData({
          activitiesToday: 0,
          total: 0,
          days: [{
            date: moment().format("YYYY-MM-DD"),
            activities: 0,
            state: "INCOMPLETE",
          }, {
            date: moment().subtract(1, "days").format("YYYY-MM-DD"),
            activities: 0,
            state: "INCOMPLETE",
          }, {
            date: moment().subtract(2, "days").format("YYYY-MM-DD"),
            activities: 0,
            state: "INCOMPLETE",
          }, {
            date: moment().subtract(3, "days").format("YYYY-MM-DD"),
            activities: 0,
            state: "INCOMPLETE",
          }
          ],
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching streak data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStreakData()
  }, [caseNumber])

  if (loading) {
    return <div className="text-center py-10">Loading streak data...</div>
  }

  if (error || !streakData) {
    return <div className="text-center py-10 text-red-500">Error: {error || "Failed to load streak data"}</div>
  }

  const streakLength = calculateStreakLength(streakData)

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8">Your streak is {streakLength} days</h1>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="grid grid-cols-7 gap-2">
          {streakData.days
            .slice()
            .map((day, index) => {
              const dayOfWeek = getDayOfWeek(day.date)
              const isToday = moment(day.date).isSame(new Date(), "day")

              return (
                <div key={day.date} className="flex flex-col items-center">
                  <StreakIndicator state={day.state} isToday={isToday} />
                  <div className={`mt-2 text-xs font-medium ${isToday ? "text-indigo-600" : "text-gray-500"}`}>
                    {dayOfWeek}
                  </div>
                  {isToday && <div className="w-full h-0.5 bg-indigo-600 mt-1"></div>}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

