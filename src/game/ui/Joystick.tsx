import { useEffect, useRef } from 'react'
import nipplejs from 'nipplejs'
import { inputState } from '@/game/input/inputState'

export function Joystick() {
  const zoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const zone = zoneRef.current
    if (!zone) return

    const manager = nipplejs.create({
      zone,
      mode: 'static',
      position: { left: '90px', bottom: '100px' },
      size: 130,
      color: '#f5c518',
      threshold: 0.05,
    })

    manager.on('move', (evt) => {
      inputState.moveX = evt.data.vector.x
      inputState.moveZ = -evt.data.vector.y
    })
    manager.on('end', () => {
      inputState.moveX = 0
      inputState.moveZ = 0
    })

    return () => {
      inputState.moveX = 0
      inputState.moveZ = 0
      manager.destroy()
    }
  }, [])

  return (
    <div
      ref={zoneRef}
      className="absolute bottom-0 left-0 h-[230px] w-[230px] touch-none"
      aria-label="Bewegungs-Joystick"
    />
  )
}
