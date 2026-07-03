import { useGameStore } from '@/game/store/gameStore'

export function DayEndReport() {
  const dayEnded = useGameStore((s) => s.dayEnded)
  const bankrupt = useGameStore((s) => s.bankrupt)
  const report = useGameStore((s) => s.lastReport)
  const startNewDay = useGameStore((s) => s.startNewDay)

  if (!dayEnded || !report || bankrupt) return null

  const profitPositive = report.profit >= 0

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/75">
      <div className="w-full max-w-sm rounded-2xl border-2 border-warn-yellow bg-industrial-800 p-5 shadow-2xl">
        <h2 className="text-center text-xl font-bold tracking-wide text-warn-yellow">
          Tagesabrechnung – Tag {report.day}
        </h2>

        <div className="mt-4 space-y-2 text-sm">
          <Row label="Aufträge erledigt" value={`${report.jobsCompleted}`} />
          {report.jobsFailed > 0 && (
            <Row label="Aufträge verpasst" value={`${report.jobsFailed}`} valueClass="text-red-400" />
          )}
          <Row label="Einnahmen" value={`+${report.income} €`} valueClass="text-green-400" />
          <Row label="Miete & Fixkosten" value={`-${report.rent} €`} valueClass="text-red-400" />
          <div className="my-2 border-t border-industrial-600" />
          <Row
            label="Tagesgewinn"
            value={`${profitPositive ? '+' : ''}${report.profit} €`}
            valueClass={profitPositive ? 'text-green-400' : 'text-red-400'}
            bold
          />
          <Row label="Kontostand" value={`${report.cashAfter} €`} bold />
          {report.reputationDelta !== 0 && (
            <Row
              label="Ruf"
              value={`${report.reputationDelta > 0 ? '+' : ''}${report.reputationDelta}`}
              valueClass={report.reputationDelta > 0 ? 'text-green-400' : 'text-red-400'}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => startNewDay()}
          className="mt-5 w-full rounded-lg bg-warn-yellow py-3 text-sm font-bold text-warn-black active:scale-95"
        >
          Nächster Tag
        </button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  valueClass = 'text-white',
  bold = false,
}: {
  label: string
  value: string
  valueClass?: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-industrial-600">{label}</span>
      <span className={`${valueClass} ${bold ? 'font-bold' : ''}`}>{value}</span>
    </div>
  )
}
