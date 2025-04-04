import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Please specify a case number: /api/streaks/1, /api/streaks/2, or /api/streaks/3",
    availableCases: [1, 2, 3],
  })
}

