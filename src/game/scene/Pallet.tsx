import { useMemo } from 'react'
import { GOODS_HEIGHT, PALLET_DEPTH, PALLET_HEIGHT, PALLET_WIDTH } from '@/game/constants'
import type { PalletGoods } from '@/game/types'

interface PalletProps {
  position: [number, number, number]
  rotationY?: number
  goods: PalletGoods
  highlighted?: boolean
}

const woodColor = '#b08a52'

export function PalletMesh({ position, rotationY = 0, goods, highlighted = false }: PalletProps) {
  const crates = useMemo(() => {
    const cols = 2
    const rows = 2
    const cw = PALLET_WIDTH / cols
    const cd = PALLET_DEPTH / rows
    const list: [number, number, number][] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push([
          -PALLET_WIDTH / 2 + cw / 2 + c * cw,
          PALLET_HEIGHT + GOODS_HEIGHT / 2,
          -PALLET_DEPTH / 2 + cd / 2 + r * cd,
        ])
      }
    }
    return list
  }, [])

  const crateColor = goods === 'mineralwasser' ? '#3aa0e0' : '#9aa3ad'

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* pallet base */}
      <mesh castShadow receiveShadow position={[0, PALLET_HEIGHT / 2, 0]}>
        <boxGeometry args={[PALLET_WIDTH, PALLET_HEIGHT, PALLET_DEPTH]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} />
      </mesh>
      {/* skid feet */}
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * (PALLET_WIDTH / 2 - 0.05), -0.04, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, PALLET_DEPTH]} />
          <meshStandardMaterial color="#8a6b3f" roughness={0.9} />
        </mesh>
      ))}
      {/* goods */}
      {crates.map((p, i) => (
        <mesh key={i} castShadow receiveShadow position={p}>
          <boxGeometry args={[PALLET_WIDTH / 2 - 0.04, GOODS_HEIGHT, PALLET_DEPTH / 2 - 0.04]} />
          <meshStandardMaterial color={crateColor} roughness={0.6} />
        </mesh>
      ))}
      {/* shrink wrap highlight */}
      {highlighted && (
        <mesh position={[0, PALLET_HEIGHT + GOODS_HEIGHT / 2, 0]}>
          <boxGeometry args={[PALLET_WIDTH + 0.08, GOODS_HEIGHT + 0.08, PALLET_DEPTH + 0.08]} />
          <meshBasicMaterial color="#f5c518" wireframe />
        </mesh>
      )}
    </group>
  )
}
