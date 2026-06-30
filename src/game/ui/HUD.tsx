import { useGameStore } from '@/game/store/gameStore'

export function HUD() {
  const cash = useGameStore((s) => s.cash)
  const day = useGameStore((s) => s.day)
  const rentPerDay = useGameStore((s) => s.rentPerDay)
  const jobs = useGameStore((s) => s.jobs)
  const dayEnded = useGameStore((s) => s.dayEnded)
  const setJobBoardOpen = useGameStore((s) => s.setJobBoardOpen)
  const endDay = useGameStore((s) => s.endDay)

  const openJobs = jobs.filter((j) => j.status === 'verfuegbar' || j.status === 'aktiv').length

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
    >
      <div className="pointer-events-auto flex flex-col gap-1">
        <Badge label="Tag" value={String(day)} />
        <Badge label="Kontostand" value={`${cash} €`} accent={cash < 0} />
        <span className="rounded bg-industrial-900/70 px-2 py-0.5 text-[11px] text-industrial-600">
          Miete/Tag: {rentPerDay} €
        </span>
      </div>

      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setJobBoardOpen(true)}
          className="relative rounded-xl border-2 border-warn-yellow bg-industrial-800 px-4 py-2 text-sm font-bold text-warn-yellow active:scale-95"
        >
          Auftragsboard
          {openJobs > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-warn-yellow text-xs font-bold text-warn-black">
              {openJobs}
            </span>
          )}
        </button>
        <button
          type="button"
          disabled={dayEnded}
          onClick={() => endDay()}
          className="rounded-xl bg-industrial-700 px-4 py-2 text-sm font-bold text-white active:scale-95 disabled:opacity-40"
        >
          Feierabend
        </button>
      </div>
    </div>
  )
}

function Badge({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-industrial-600 bg-industrial-900/80 px-3 py-1.5">
      <span className="text-[11px] uppercase tracking-wide text-industrial-600">{label}</span>
      <span className={`text-sm font-bold ${accent ? 'text-red-400' : 'text-white'}`}>{value}</span>
    </div>
  )
}
