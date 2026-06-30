import { useRef } from 'react'
import { inputState } from '@/game/input/inputState'

export function CameraSwipeZone() {
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!lastPos.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    inputState.cameraYawDelta += dx
    inputState.cameraPitchDelta += dy
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  function onPointerUp() {
    lastPos.current = null
  }

  return (
    <div
      className="absolute inset-y-0 right-0 left-1/2 touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  )
}
