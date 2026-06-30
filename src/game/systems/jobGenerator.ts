import type { Job, Pallet } from '@/game/types'
import { SLOT_COLS, SLOT_ROWS } from '@/game/constants'

const CLIENTS = ['Nordsee Getränke GmbH', 'AlpenQuell Mineralbrunnen', 'Frisch & Frei Handel']

let counter = 0
function nextId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}

export function generateDailyJob(day: number): { job: Job; pallets: Pallet[] } {
  const maxSlots = SLOT_COLS * SLOT_ROWS
  const palletCount = Math.min(maxSlots, 6 + Math.floor(day / 2) + (day === 1 ? 0 : Math.floor(Math.random() * 3)))
  const client = CLIENTS[(day - 1) % CLIENTS.length]

  const pallets: Pallet[] = Array.from({ length: palletCount }, (_, i) => ({
    id: nextId('pallet'),
    goods: 'mineralwasser',
    label: 'Mineralwasser',
    state: 'wartend',
    slotId: null,
    deliveryIndex: i,
  }))

  const job: Job = {
    id: nextId('job'),
    type: 'einlagerung',
    title: 'Wareneingang: Mineralwasser einlagern',
    client,
    description: `${palletCount} Paletten Mineralwasser vom LKW abladen und an freien Stellplätzen einlagern.`,
    payout: palletCount * 28,
    deadlineDay: day,
    palletIds: pallets.map((p) => p.id),
    status: 'verfuegbar',
  }

  return { job, pallets }
}
