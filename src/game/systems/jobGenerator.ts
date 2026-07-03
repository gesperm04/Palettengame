import type { Job, Pallet, StorageSlot } from '@/game/types'
import {
  JOB_DEADLINE_BUFFER_DAYS,
  REPUTATION_TIER_2,
  REPUTATION_TIER_3,
  SLOT_COLS,
  SLOT_ROWS,
} from '@/game/constants'

const CLIENTS = ['Nordsee Getränke GmbH', 'AlpenQuell Mineralbrunnen', 'Frisch & Frei Handel']

let counter = 0
function nextId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}

function nextPalletCode(): string {
  counter += 1
  return `PAL-${(1000 + counter * 7).toString(36).toUpperCase()}`
}

function reputationPayoutMultiplier(reputation: number): number {
  return 0.75 + reputation / 200 // 0.75 (rep 0) .. 1.25 (rep 100)
}

export function jobsPerDay(reputation: number): number {
  if (reputation >= REPUTATION_TIER_3) return 3
  if (reputation >= REPUTATION_TIER_2) return 2
  return 1
}

export function maxActiveJobs(reputation: number): number {
  return jobsPerDay(reputation)
}

function generateEinlagerungJob(
  day: number,
  reputation: number,
  deliveryOffset: number,
): { job: Job; pallets: Pallet[] } {
  const maxSlots = SLOT_COLS * SLOT_ROWS
  const palletCount = Math.min(
    maxSlots,
    5 + Math.floor(day / 2) + Math.floor(Math.random() * 3),
  )
  const client = CLIENTS[Math.floor(Math.random() * CLIENTS.length)]
  const multiplier = reputationPayoutMultiplier(reputation)

  const pallets: Pallet[] = Array.from({ length: palletCount }, (_, i) => ({
    id: nextId('pallet'),
    code: nextPalletCode(),
    goods: 'mineralwasser',
    label: 'Mineralwasser',
    state: 'wartend',
    slotId: null,
    deliveryIndex: deliveryOffset + i,
  }))

  const job: Job = {
    id: nextId('job'),
    type: 'einlagerung',
    title: 'Wareneingang: Mineralwasser einlagern',
    client,
    description: `${palletCount} Paletten Mineralwasser vom LKW abladen und an freien Stellplätzen einlagern.`,
    payout: Math.round(palletCount * 28 * multiplier),
    deadlineDay: day + JOB_DEADLINE_BUFFER_DAYS,
    palletIds: pallets.map((p) => p.id),
    status: 'verfuegbar',
  }

  return { job, pallets }
}

function generateUmlagerungJob(
  day: number,
  reputation: number,
  storedPallets: Pallet[],
  slots: StorageSlot[],
): { job: Job; pallets: Pallet[] } | null {
  const freeSlots = slots.filter((s) => !s.occupiedPalletId)
  const count = Math.min(3, storedPallets.length, freeSlots.length)
  if (count < 2) return null

  const shuffledPallets = [...storedPallets].sort(() => Math.random() - 0.5).slice(0, count)
  const shuffledSlots = [...freeSlots].sort(() => Math.random() - 0.5).slice(0, count)
  const multiplier = reputationPayoutMultiplier(reputation)

  const relocationTargets: Record<string, string> = {}
  shuffledPallets.forEach((p, i) => {
    relocationTargets[p.id] = shuffledSlots[i].id
  })

  const job: Job = {
    id: nextId('job'),
    type: 'umlagerung',
    title: 'Umlagerung: Bestand umsortieren',
    client: 'Interne Lagerdisposition',
    description: `${count} eingelagerte Paletten zur Platzoptimierung an den zugewiesenen Stellplatz umlagern.`,
    payout: Math.round(count * 22 * multiplier),
    deadlineDay: day + JOB_DEADLINE_BUFFER_DAYS,
    palletIds: shuffledPallets.map((p) => p.id),
    status: 'verfuegbar',
    relocationTargets,
  }

  return { job, pallets: [] }
}

export function generateJobsForDay(
  day: number,
  reputation: number,
  existingWaitingCount: number,
  storedPallets: Pallet[],
  slots: StorageSlot[],
): { jobs: Job[]; pallets: Pallet[] } {
  const jobCount = jobsPerDay(reputation)
  const jobs: Job[] = []
  const pallets: Pallet[] = []
  let deliveryOffset = existingWaitingCount

  // an Umlagerung job only makes sense once there is enough stock in the warehouse
  let umlagerungUsed = false
  for (let i = 0; i < jobCount; i++) {
    if (!umlagerungUsed && storedPallets.length >= 3 && Math.random() < 0.5) {
      const result = generateUmlagerungJob(day, reputation, storedPallets, slots)
      if (result) {
        jobs.push(result.job)
        umlagerungUsed = true
        continue
      }
    }
    const result = generateEinlagerungJob(day, reputation, deliveryOffset)
    jobs.push(result.job)
    pallets.push(...result.pallets)
    deliveryOffset += result.pallets.length
  }

  return { jobs, pallets }
}
