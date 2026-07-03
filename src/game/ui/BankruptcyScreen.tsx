import { useGameStore } from '@/game/store/gameStore'
import { requestTeleport } from '@/game/store/teleportRequest'

export function BankruptcyScreen() {
  const bankrupt = useGameStore((s) => s.bankrupt)
  const lastReport = useGameStore((s) => s.lastReport)
  const restartAfterBankruptcy = useGameStore((s) => s.restartAfterBankruptcy)

  if (!bankrupt) return null

  function handleRestart() {
    restartAfterBankruptcy()
    requestTeleport([0, 0.1, 2])
  }

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="w-full max-w-sm rounded-2xl border-2 border-red-500 bg-industrial-800 p-6 text-center shadow-2xl">
        <h2 className="text-2xl font-extrabold tracking-wide text-red-500">INSOLVENZ</h2>
        <p className="mt-3 text-sm text-industrial-600">
          Die Schulden sind zu hoch aufgelaufen{lastReport ? ` (${lastReport.cashAfter} €)` : ''}. Der
          Betrieb ist pleite und wird geschlossen.
        </p>
        <p className="mt-3 text-sm text-industrial-600">
          Du startest neu: Tag 1, 0 €, nur der Handgabelhubwagen.
        </p>
        <button
          type="button"
          onClick={handleRestart}
          className="mt-5 w-full rounded-lg bg-red-500 py-3 text-sm font-bold text-white active:scale-95"
        >
          Neu starten
        </button>
      </div>
    </div>
  )
}
