import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import localFont from 'next/font/local';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Activity Streaks",
  description: "Track your daily activity streaks",
    generator: 'v0.dev'
}


const elucidCircularB = localFont({
  src: [
    {
      path: '../assets/fonts/euclid-circular-b/EuclidCircularBBold.ttf',
      style: 'bold',
    },
    {
      path: '../assets/fonts/euclid-circular-b/EuclidCircularBSemiBold.ttf',
      style: 'semibold',
    },
    {
      path: '../assets/fonts/euclid-circular-b/EuclidCircularBRegular.ttf',
      style: 'normal',
    },
  ],
  variable: "--elucid",
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${elucidCircularB.variable}`}>{children}</body>
    </html>
  )
}
