"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"

// Simple dotted sphere without continent patterns
const MinimalGlobe = ({ radius = 4 }) => {
  const meshRef = useRef()

  const { positions, colors, sizes } = useMemo(() => {
    const positionsArray = []
    const colorsArray = []
    const sizesArray = []

    const density = 2500 // Moderate density for clean look

    for (let i = 0; i < density; i++) {
      // Even distribution using Fibonacci sphere
      const y = 1 - (i / (density - 1)) * 2 // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = (i * 2.399963229728653) % (2 * Math.PI) // Golden angle

      const x = Math.cos(theta) * radiusAtY * radius
      const z = Math.sin(theta) * radiusAtY * radius
      const yPos = y * radius

      positionsArray.push(x, yPos, z)

      // Varied teal/cyan colors
      const colorVariation = Math.random() * 0.3
      colorsArray.push(
        0.024 + colorVariation, // R
        0.714 + colorVariation * 0.2, // G
        0.831 + colorVariation * 0.1, // B
      )

      // Varied sizes for visual interest
      sizesArray.push(0.8 + Math.random() * 0.4)
    }

    return {
      positions: new Float32Array(positionsArray),
      colors: new Float32Array(colorsArray),
      sizes: new Float32Array(sizesArray),
    }
  }, [radius])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x += 0.001
    }
  })

  return (
    <group ref={meshRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  )
}

// Elegant flowing connection lines
const FlowingConnections = ({ count = 6, radius = 4 }) => {
  const linesRef = useRef([])

  const connections = useMemo(() => {
    const lines = []

    for (let i = 0; i < count; i++) {
      const points = []
      const segments = 100

      // Create smooth flowing curves around the globe
      const startAngle = (i / count) * Math.PI * 2
      const endAngle = startAngle + Math.PI * 1.5
      const verticalOffset = (Math.random() - 0.5) * 0.5

      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const angle = startAngle + (endAngle - startAngle) * t

        // Create flowing wave pattern
        const waveHeight = Math.sin(t * Math.PI * 2) * 0.8
        const currentRadius = radius + 0.5 + waveHeight

        const x = currentRadius * Math.cos(angle)
        const y = (Math.sin(t * Math.PI * 3) * 0.5 + verticalOffset) * radius
        const z = currentRadius * Math.sin(angle)

        points.push(x, y, z)
      }

      lines.push({
        points: new Float32Array(points),
        color: "#06b6d4",
        speed: 0.01 + Math.random() * 0.01,
        offset: Math.random() * Math.PI * 2,
      })
    }

    return lines
  }, [count, radius])

  useFrame(({ clock }) => {
    linesRef.current.forEach((line, i) => {
      if (line && line.material) {
        const connection = connections[i]
        const time = clock.getElapsedTime()
        line.material.opacity = 0.3 + 0.4 * Math.sin(time * connection.speed + connection.offset)
      }
    })
  })

  return (
    <group>
      {connections.map((connection, i) => (
        <line key={i} ref={(el) => (linesRef.current[i] = el)}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={connection.points.length / 3}
              array={connection.points}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={connection.color} transparent opacity={0.5} linewidth={2} />
        </line>
      ))}
    </group>
  )
}

// Subtle orbital elements
const SubtleOrbitals = ({ radius = 4 }) => {
  const orbitalsRef = useRef()

  const orbitals = useMemo(() => {
    const orbitalData = []
    const orbitalCount = 3

    for (let i = 0; i < orbitalCount; i++) {
      const points = []
      const segments = 80
      const orbitalRadius = radius + 1 + i * 0.5
      const tilt = (i * Math.PI) / 12

      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2
        const x = orbitalRadius * Math.cos(angle)
        const y = orbitalRadius * Math.sin(angle) * Math.sin(tilt)
        const z = orbitalRadius * Math.sin(angle) * Math.cos(tilt)
        points.push(x, y, z)
      }

      orbitalData.push({
        points: new Float32Array(points),
        opacity: 0.1 - i * 0.02,
      })
    }

    return orbitalData
  }, [radius])

  useFrame(() => {
    if (orbitalsRef.current) {
      orbitalsRef.current.rotation.y += 0.0005
      orbitalsRef.current.rotation.z += 0.0002
    }
  })

  return (
    <group ref={orbitalsRef}>
      {orbitals.map((orbital, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbital.points.length / 3}
              array={orbital.points}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#06b6d4" transparent opacity={orbital.opacity} />
        </line>
      ))}
    </group>
  )
}

// Main globe component
export const GlobalNetworkGlobe = () => {
  return (
    <div className="w-full h-[800px] relative bg-white">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#06b6d4" />

        <MinimalGlobe />
        <FlowingConnections />
        <SubtleOrbitals />
      </Canvas>
    </div>
  )
}
