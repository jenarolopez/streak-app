export type StreakState = "COMPLETED" | "AT_RISK" | "SAVED" | "INCOMPLETE"

export interface StreakDay {
  date: string
  activities: number
  state: StreakState
}

export interface StreakData {
  activitiesToday: number
  total: number
  days: StreakDay[]
}

