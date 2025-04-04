import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Log API requests for monitoring
  if (request.nextUrl.pathname.startsWith("/api/")) {
    console.log(`API Request: ${request.method} ${request.nextUrl.pathname}`)
  }

  return NextResponse.next()
}

