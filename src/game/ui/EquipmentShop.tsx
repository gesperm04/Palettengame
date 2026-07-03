import { useGameStore } from '@/game/store/gameStore'
import { ELECTRIC_JACK_PRICE } from '@/game/constants'

export function EquipmentShop() {
  const open = useGameStore((s) => s.equipmentShopOpen)
  const setOpen = useGameStore((s) => s.setEquipmentShopOpen)
  const cash = useGameStore((s) => s.cash)
  const ownsElectricJack = useGameStore((s) => s.equipment.ownsElectricJack)
  const buyElectricJack = useGameStore((s) => s.buyElectricJack)

  if (!open) return null

  const canAfford = cash >= ELECTRIC_JACK_PRICE

  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-t-2xl border-2 border-warn-yellow bg-industrial-800 p-4 shadow-2xl sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between border-b border-industrial-600 pb-2">
          <h2 className="text-lg font-bold tracking-wide text-warn-yellow">Ausrüstung</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full bg-industrial-700 px-3 py-1 text-sm font-bold text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          <div className="rounded-xl border border-industrial-600 bg-industrial-900 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white">Elektrischer Hubwagen</p>
                <p className="text-xs text-industrial-600">Deichselstapler mit Akku</p>
              </div>
              {ownsElectricJack && (
                <span className="whitespace-nowrap rounded bg-industrial-700 px-2 py-0.5 text-xs font-bold text-warn-yellow">
                  Gekauft
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-industrial-600">
              Hebt sofort ohne Pumpen und ist beim Tragen schneller unterwegs. Braucht Akku – lädt über
              Nacht automatisch wieder auf.
            </p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-bold text-warn-yellow">{ELECTRIC_JACK_PRICE} €</span>
            </div>
            {!ownsElectricJack && (
              <button
                type="button"
                onClick={() => buyElectricJack()}
                disabled={!canAfford}
                className="mt-3 w-full rounded-lg bg-warn-yellow py-2 text-sm font-bold text-warn-black active:scale-95 disabled:opacity-40"
              >
                {canAfford ? 'Kaufen' : 'Nicht genug Geld'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
