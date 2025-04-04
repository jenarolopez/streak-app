
import { StreakState } from "@/types/streak"
import { CheckIcon } from "lucide-react"


interface StreakIndicatorProps {
  state: StreakState
  isToday: boolean
}

export default function StreakIndicator({ state, isToday }: StreakIndicatorProps) {
  // Define colors based on state
  const getColors = () => {
    if (isToday) {
      return {
        bg: "bg-indigo-600",
        text: "text-white",
        border: "border-indigo-600",
      }
    }

    switch (state) {
      case "COMPLETED":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-600",
          border: "border-indigo-100",
        }
      case "SAVED":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-600",
          border: "border-indigo-100",
        }
      case "AT_RISK":
        return {
          bg: "bg-amber-100",
          text: "text-amber-600",
          border: "border-amber-100",
        }
      case "INCOMPLETE":
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-400",
          border: "border-gray-100",
        }
    }
  }

  const { bg, text, border } = getColors()

  if(state=== "INCOMPLETE" && isToday) {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${text} ${border}`}>  
        <span className={`w-5 h-5 rounded-full ${bg}`}/>
      </div>
    )
  }

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg} ${text} ${border}`}>
      {(state === "COMPLETED" || state === "SAVED" || isToday) && <CheckIcon size={16} />}
    </div>
  )
}

