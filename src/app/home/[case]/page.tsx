import Header from "@/components/header"
// import StreakDisplay from "@/components/streak-display"
import dynamic from 'next/dynamic';

const StreakDisplay = dynamic(() => import('@/components/streak-display'));

export default async function CasePage({
  params,
}: {
  params: Promise<{ case: string }>
}) {
  
  const newParams = await params

  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/bg.svg')] bg-cover bg-no-repeat bg-center">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <StreakDisplay caseNumber={newParams.case} />
      </main>
    </div>
  )
}

