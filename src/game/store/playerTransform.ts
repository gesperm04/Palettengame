// Mutable, non-reactive player transform. Updated every frame by the character
// controller via useFrame; deliberately kept outside Zustand/React state so that
// 60fps position updates never trigger a re-render of UI components.
export interface PlayerTransform {
  position: [number, number, number]
  rotationY: number
}

export const playerTransform: PlayerTransform = {
  position: [0, 0, 2],
  rotationY: 0,
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __playerTransform: PlayerTransform }).__playerTransform = playerTransform
}
