import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('/images/bg.svg')] bg-cover bg-no-repeat bg-center">
      <h1 className="text-3xl font-bold mb-8">Streaks Feature Demo</h1>

      <div className="grid gap-4">
        <Link
          href="/home/1"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Case #1: 3-day recovery success
        </Link>

        <Link
          href="/home/2"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Case #2: 3-day recovery ongoing
        </Link>

        <Link
          href="/home/3"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Case #3: 3-day recovery fail
        </Link>
      </div>
    </main>
  )
}

