import { DELIVERY_ORIGIN_X, DELIVERY_ORIGIN_Z } from '@/game/constants'

export function Truck() {
  const x = DELIVERY_ORIGIN_X + 1
  const z = DELIVERY_ORIGIN_Z + 2.6

  return (
    <group position={[x, 0, z]}>
      {/* cargo bed / trailer */}
      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[7.5, 1.9, 2.4]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
      </mesh>
      {/* cab */}
      <mesh castShadow receiveShadow position={[-4.6, 1.05, 0]}>
        <boxGeometry args={[1.8, 2.1, 2.3]} />
        <meshStandardMaterial color="#1f6feb" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-5.35, 1.55, 0]}>
        <boxGeometry args={[0.15, 1, 2.1]} />
        <meshStandardMaterial color="#bcd6ff" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* wheels */}
      {[-4.9, -3.4, 1.2, 2.6].map((wx, i) => (
        <group key={i}>
          <mesh position={[wx, 0.45, 1.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            <meshStandardMaterial color="#15161a" roughness={0.9} />
          </mesh>
          <mesh position={[wx, 0.45, -1.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            <meshStandardMaterial color="#15161a" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* loading ramp hint */}
      <mesh position={[3.9, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 2.4]} />
        <meshStandardMaterial color="#f5c518" roughness={0.9} />
      </mesh>
    </group>
  )
}
