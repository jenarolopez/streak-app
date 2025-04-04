import type { StreakData } from "@/types/streak"

export function calculateStreakLength(data: StreakData): number {
  let streakLength = 0

  // Count consecutive days with COMPLETED or SAVED state
  for (const day of data.days) {
    if (day.state === "COMPLETED" || day.state === "SAVED") {
      streakLength++
    } else {
      break
    }
  }

  return streakLength
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date
    .toLocaleDateString("en-US", {
      weekday: "short",
    })
    .toUpperCase()
}

export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  return days[date.getDay()]
}

