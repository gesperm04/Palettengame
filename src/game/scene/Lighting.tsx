export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#cfd8e3" />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.4}
        color="#fff6e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <hemisphereLight args={['#9fb8d9', '#2b2620', 0.35]} />
      {/* warm interior work lights */}
      <pointLight position={[-3, 4.5, -2]} intensity={12} color="#ffe9b0" distance={9} decay={2} />
      <pointLight position={[3, 4.5, -2]} intensity={12} color="#ffe9b0" distance={9} decay={2} />
      <pointLight position={[0, 4.5, 2]} intensity={10} color="#ffe9b0" distance={9} decay={2} />
    </>
  )
}
