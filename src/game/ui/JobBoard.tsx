import { isJobPalletDone, useGameStore } from '@/game/store/gameStore'
import { maxActiveJobs } from '@/game/systems/jobGenerator'

const STATUS_LABEL: Record<string, string> = {
  verfuegbar: 'Verfügbar',
  aktiv: 'In Arbeit',
  erledigt: 'Erledigt',
  fehlgeschlagen: 'Fehlgeschlagen',
}

const TYPE_LABEL: Record<string, string> = {
  einlagerung: 'Einlagerung',
  umlagerung: 'Umlagerung',
}

export function JobBoard() {
  const open = useGameStore((s) => s.jobBoardOpen)
  const jobs = useGameStore((s) => s.jobs)
  const pallets = useGameStore((s) => s.pallets)
  const reputation = useGameStore((s) => s.reputation)
  const acceptJob = useGameStore((s) => s.acceptJob)
  const setOpen = useGameStore((s) => s.setJobBoardOpen)

  if (!open) return null

  const activeCount = jobs.filter((j) => j.status === 'aktiv').length
  const capacity = maxActiveJobs(reputation)
  const atCapacity = activeCount >= capacity

  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-t-2xl border-2 border-warn-yellow bg-industrial-800 p-4 shadow-2xl sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-industrial-600 pb-2">
          <h2 className="text-lg font-bold tracking-wide text-warn-yellow">Auftragsboard</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full bg-industrial-700 px-3 py-1 text-sm font-bold text-white"
          >
            ✕
          </button>
        </div>
        <p className="mb-2 text-xs text-industrial-600">
          Aktive Aufträge: {activeCount}/{capacity}
        </p>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {jobs.length === 0 && (
            <p className="py-8 text-center text-sm text-industrial-600">
              Keine Aufträge verfügbar. Feierabend machen, um neue zu erhalten.
            </p>
          )}
          {jobs.map((job) => {
            const done = job.palletIds.filter((id) => isJobPalletDone(job, pallets, id)).length

            return (
              <div key={job.id} className="rounded-xl border border-industrial-600 bg-industrial-900 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{job.title}</p>
                    <p className="text-xs text-industrial-600">{job.client}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="whitespace-nowrap rounded bg-industrial-700 px-2 py-0.5 text-xs font-bold text-warn-yellow">
                      {STATUS_LABEL[job.status]}
                    </span>
                    <span className="whitespace-nowrap rounded bg-industrial-700/60 px-2 py-0.5 text-[10px] text-industrial-600">
                      {TYPE_LABEL[job.type]}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-industrial-600">{job.description}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-bold text-warn-yellow">{job.payout} €</span>
                  <span className="text-industrial-600">
                    {done}/{job.palletIds.length} erledigt
                  </span>
                </div>
                {job.status === 'verfuegbar' && (
                  <button
                    type="button"
                    onClick={() => acceptJob(job.id)}
                    disabled={atCapacity}
                    className="mt-3 w-full rounded-lg bg-warn-yellow py-2 text-sm font-bold text-warn-black active:scale-95 disabled:opacity-40"
                  >
                    {atCapacity ? 'Kapazität voll' : 'Auftrag annehmen'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
