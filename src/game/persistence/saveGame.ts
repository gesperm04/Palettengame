import { useGameStore } from '@/game/store/gameStore'
import { playerTransform } from '@/game/store/playerTransform'
import { readSave, writeSave } from '@/game/persistence/db'

let saveTimer: ReturnType<typeof setTimeout> | null = null
const AUTOSAVE_DEBOUNCE_MS = 1200

export async function saveNow(): Promise<void> {
  const state = useGameStore.getState()
  await writeSave({
    cash: state.cash,
    day: state.day,
    rentPerDay: state.rentPerDay,
    dayEnded: state.dayEnded,
    jobs: state.jobs,
    pallets: state.pallets,
    slots: state.slots,
    equipment: state.equipment,
    lastReport: state.lastReport,
    player: playerTransform,
  })
}

function scheduleAutosave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveNow().catch((err) => console.error('Autosave fehlgeschlagen', err))
  }, AUTOSAVE_DEBOUNCE_MS)
}

let autosaveInitialized = false
export function initAutosave() {
  if (autosaveInitialized) return
  autosaveInitialized = true
  useGameStore.subscribe(() => scheduleAutosave())

  const flush = () => {
    if (saveTimer) clearTimeout(saveTimer)
    void saveNow()
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
  window.addEventListener('pagehide', flush)
}

export async function loadSavedGame(): Promise<boolean> {
  const saved = await readSave()
  if (!saved) return false

  useGameStore.getState().hydrate({
    cash: saved.cash,
    day: saved.day,
    rentPerDay: saved.rentPerDay,
    dayEnded: saved.dayEnded,
    jobs: saved.jobs,
    pallets: saved.pallets,
    slots: saved.slots,
    equipment: saved.equipment,
    lastReport: saved.lastReport,
  })
  playerTransform.position = saved.player.position
  playerTransform.rotationY = saved.player.rotationY
  return true
}
