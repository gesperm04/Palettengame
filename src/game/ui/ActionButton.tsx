import { inputState } from '@/game/input/inputState'
import { useInteractionStore } from '@/game/store/interactionStore'

const LABELS: Record<string, string> = {
  hubwagen_nehmen: 'Hubwagen nehmen',
  hubwagen_abstellen: 'Hubwagen abstellen',
  aufnehmen: 'Aufnehmen',
  heben: 'Heben',
  absenken: 'Absenken',
  ablegen: 'Ablegen',
}

const ICONS: Record<string, string> = {
  hubwagen_nehmen: '⛟',
  hubwagen_abstellen: '⛟',
  aufnehmen: '⤓',
  heben: '⤒',
  absenken: '⤓',
  ablegen: '⤓',
}

export function ActionButton() {
  const contextAction = useInteractionStore((s) => s.contextAction)
  const liftProgress = useInteractionStore((s) => s.liftProgress)
  const active = contextAction !== null

  function press(e: React.PointerEvent) {
    e.preventDefault()
    if (!active) return
    inputState.actionRequested = true
  }

  return (
    <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
      <button
        type="button"
        onPointerDown={press}
        disabled={!active}
        className={`relative flex h-20 w-20 touch-none select-none items-center justify-center rounded-full border-4 text-3xl font-bold shadow-lg transition-transform active:scale-95 ${
          active
            ? 'border-warn-black bg-warn-yellow text-warn-black'
            : 'border-industrial-600 bg-industrial-700/70 text-industrial-600'
        }`}
      >
        {active && liftProgress > 0 && liftProgress < 1 && (
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="36"
              fill="none"
              stroke="#181818"
              strokeWidth="6"
              strokeDasharray={`${liftProgress * 226} 226`}
            />
          </svg>
        )}
        <span>{ICONS[contextAction ?? ''] ?? '•'}</span>
      </button>
      <span className="rounded bg-industrial-900/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-warn-yellow">
        {active ? LABELS[contextAction ?? ''] : ''}
      </span>
    </div>
  )
}
