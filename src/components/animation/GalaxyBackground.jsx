"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial, Sphere, Stars, Environment } from "@react-three/drei"
import * as THREE from "three"
import PropTypes from "prop-types"

/**
 * CONSTANTS AND CONFIGURATION
 */
const getResponsiveConfig = () => {
  const isMobile = window.innerWidth <= 768
  const isTablet = window.innerWidth <= 1024
  const isLowEnd = navigator.hardwareConcurrency <= 4

  return {
    starField: {
      count: isLowEnd ? (isMobile ? 200 : 400) : isMobile ? 300 : 600,
      radius: { min: 20, max: 60 },
      rotationSpeed: { x: 0.015, y: 0.0008 },
      amplitude: 0.02,
    },
    starShower: {
      count: isLowEnd ? (isMobile ? 15 : 25) : isMobile ? 20 : 35,
      fallSpeed: { min: 0.08, max: 0.12 },
      resetHeight: { min: 40, max: 60 },
      horizontalDrift: 0.015,
    },
    galacticDust: {
      count: isLowEnd ? (isMobile ? 50 : 100) : isMobile ? 80 : 150,
      radius: { min: 30, max: 90 },
      rotationSpeed: 0.0003,
    },
    orbs: {
      count: isLowEnd ? (isMobile ? 2 : 3) : isMobile ? 3 : 5,
      colors: ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"],
      movement: { radius: 1.5, speed: { min: 0.03, max: 0.1 } },
    },
    performance: {
      scrollDetectionDelay: isMobile ? 200 : 100,
      frameSkip: isLowEnd ? 2 : 1,
      updateFrequency: isLowEnd ? 3 : 1,
    },
  }
}

/**
 * Performance-optimized StarField Component
 */
const StarField = ({ count, isScrolling }) => {
  const meshRef = useRef(null)
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  const starPositions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const { radius } = config.starField

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const sphereRadius = Math.random() * (radius.max - radius.min) + radius.min
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[index] = sphereRadius * Math.sin(phi) * Math.cos(theta)
      positions[index + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta)
      positions[index + 2] = sphereRadius * Math.cos(phi)
    }

    return positions
  }, [count])

  useFrame((state) => {
    if (!meshRef.current || isScrolling) return

    frameCounter.current++
    if (frameCounter.current % config.performance.updateFrequency !== 0) return

    const { rotationSpeed, amplitude } = config.starField
    const time = state.clock.elapsedTime

    meshRef.current.rotation.x = Math.sin(time * rotationSpeed.x) * amplitude
    meshRef.current.rotation.y += rotationSpeed.y
  })

  return (
    <Points ref={meshRef} positions={starPositions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={window.innerWidth <= 768 ? 0.4 : 0.6}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

/**
 * Optimized StarShower Component
 */
const StarShower = ({ count, isScrolling }) => {
  const meshRef = useRef(null)
  const velocitiesRef = useRef(null)
  const originalPositionsRef = useRef(null)
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  const { particles, velocities } = useMemo(() => {
    const particlePositions = new Float32Array(count * 3)
    const particleVelocities = new Float32Array(count * 3)
    const { fallSpeed, resetHeight, horizontalDrift } = config.starShower

    for (let i = 0; i < count; i++) {
      const index = i * 3

      particlePositions[index] = (Math.random() - 0.5) * 80
      particlePositions[index + 1] = Math.random() * 25 + resetHeight.min
      particlePositions[index + 2] = (Math.random() - 0.5) * 40

      particleVelocities[index] = (Math.random() - 0.5) * horizontalDrift
      particleVelocities[index + 1] = -(Math.random() * fallSpeed.max + fallSpeed.min)
      particleVelocities[index + 2] = (Math.random() - 0.5) * horizontalDrift
    }

    velocitiesRef.current = particleVelocities
    originalPositionsRef.current = particlePositions.slice()

    return {
      particles: particlePositions,
      velocities: particleVelocities,
    }
  }, [count])

  useFrame(() => {
    if (!meshRef.current || isScrolling || !velocitiesRef.current) return

    frameCounter.current++
    if (frameCounter.current % config.performance.updateFrequency !== 0) return

    const positions = meshRef.current.geometry.attributes.position.array
    const velocities = velocitiesRef.current
    const originals = originalPositionsRef.current

    for (let i = 0; i < count; i++) {
      const index = i * 3

      positions[index] += velocities[index]
      positions[index + 1] += velocities[index + 1]
      positions[index + 2] += velocities[index + 2]

      if (positions[index + 1] < -40) {
        const { resetHeight } = config.starShower
        positions[index] = originals[index] + (Math.random() - 0.5) * 15
        positions[index + 1] = Math.random() * 20 + resetHeight.min
        positions[index + 2] = originals[index + 2] + (Math.random() - 0.5) * 15
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={meshRef} positions={particles} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#87ceeb"
        size={window.innerWidth <= 768 ? 1.0 : 1.4}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

/**
 * Simplified NebulaCloud Component
 */
const NebulaCloud = ({ position, color, scale, isScrolling }) => {
  const meshRef = useRef(null)
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  useFrame((state) => {
    if (!meshRef.current || isScrolling) return

    frameCounter.current++
    if (frameCounter.current % (config.performance.updateFrequency * 2) !== 0) return

    const time = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(time * 0.03) * 0.015
    meshRef.current.rotation.y = Math.sin(time * 0.02) * 0.03
  })

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[2.5, 12, 12]}
      scale={window.innerWidth <= 768 ? scale * 0.6 : scale * 0.8}
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.12}
        roughness={0.9}
        metalness={0.1}
        emissive={color}
        emissiveIntensity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}

/**
 * Optimized GalaxyCore Component
 */
const GalaxyCore = ({ isScrolling }) => {
  const outerMeshRef = useRef(null)
  const innerMeshRef = useRef(null)
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  useFrame((state) => {
    if (isScrolling) return

    frameCounter.current++
    if (frameCounter.current % config.performance.updateFrequency !== 0) return

    const time = state.clock.elapsedTime

    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += 0.0015
      outerMeshRef.current.rotation.x = Math.sin(time * 0.08) * 0.03
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y -= 0.002
      innerMeshRef.current.rotation.z += 0.0008
    }
  })

  const scale = window.innerWidth <= 768 ? 0.7 : 0.9

  return (
    <group position={[0, 0, -12]}>
      <Sphere ref={outerMeshRef} args={[3, 24, 24]} scale={scale}>
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.18}
          roughness={0.4}
          metalness={0.6}
          emissive="#4c1d95"
          emissiveIntensity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <Sphere ref={innerMeshRef} args={[1.5, 16, 16]} scale={scale}>
        <meshStandardMaterial
          color="#ec4899"
          transparent
          opacity={0.35}
          roughness={0.2}
          metalness={0.8}
          emissive="#be185d"
          emissiveIntensity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  )
}

/**
 * Performance-optimized FloatingOrb Component
 */
const FloatingOrb = ({ position, color, scale, speed, index, isScrolling }) => {
  const meshRef = useRef(null)
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  useFrame((state) => {
    if (!meshRef.current || isScrolling) return

    frameCounter.current++
    if (frameCounter.current % (config.performance.updateFrequency * 2) !== 0) return

    const time = state.clock.elapsedTime * speed
    const { movement } = config.orbs

    meshRef.current.position.x = position[0] + Math.sin(time + index) * movement.radius
    meshRef.current.position.y = position[1] + Math.cos(time + index) * movement.radius
    meshRef.current.position.z = position[2] + Math.sin(time * 0.3 + index) * (movement.radius * 0.4)

    meshRef.current.rotation.x += 0.002
    meshRef.current.rotation.y += 0.003
  })

  return (
    <Sphere ref={meshRef} args={[scale, 8, 8]} position={position}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.25}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}

/**
 * FloatingOrbs Component
 */
const FloatingOrbs = ({ count, isScrolling }) => {
  const config = getResponsiveConfig()
  const orbsData = useMemo(() => {
    const { colors, movement } = config.orbs

    return Array.from({ length: count }, (_, i) => ({
      position: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
      color: colors[i % colors.length],
      scale: 0.15 + Math.random() * 0.3,
      speed: movement.speed.min + Math.random() * (movement.speed.max - movement.speed.min),
    }))
  }, [count])

  return (
    <>
      {orbsData.map((orb, index) => (
        <FloatingOrb key={`orb-${index}`} {...orb} index={index} isScrolling={isScrolling} />
      ))}
    </>
  )
}

/**
 * Optimized GalacticDust Component
 */
const GalacticDust = ({ count, isScrolling }) => {
  const meshRef = useRef(null)
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  const dustPositions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const { radius } = config.galacticDust

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const particleRadius = Math.random() * (radius.max - radius.min) + radius.min
      const angle = Math.random() * Math.PI * 2

      positions[index] = Math.cos(angle) * particleRadius
      positions[index + 1] = (Math.random() - 0.5) * 8
      positions[index + 2] = Math.sin(angle) * particleRadius
    }

    return positions
  }, [count])

  useFrame(() => {
    if (!meshRef.current || isScrolling) return

    frameCounter.current++
    if (frameCounter.current % (config.performance.updateFrequency * 3) !== 0) return

    meshRef.current.rotation.y += config.galacticDust.rotationSpeed
  })

  return (
    <Points ref={meshRef} positions={dustPositions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#fbbf24"
        size={window.innerWidth <= 768 ? 0.25 : 0.35}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

/**
 * Optimized CameraController Component
 */
const CameraController = ({ mousePosition, isScrolling }) => {
  const { camera } = useThree()
  const frameCounter = useRef(0)
  const config = getResponsiveConfig()

  useFrame(() => {
    if (isScrolling) return

    frameCounter.current++
    if (frameCounter.current % config.performance.updateFrequency !== 0) return

    const sensitivity = window.innerWidth <= 768 ? 0.2 : 0.3
    const targetX = mousePosition.x * sensitivity
    const targetY = -mousePosition.y * sensitivity

    camera.position.x += (targetX - camera.position.x) * 0.003
    camera.position.y += (targetY - camera.position.y) * 0.003
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Main GalaxyBackground Component
 */
const GalaxyBackground = ({ mousePosition = { x: 0, y: 0 } }) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const config = getResponsiveConfig()

  // Visibility optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  // Scroll optimization
  useEffect(() => {
    let scrollTimeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, config.performance.scrollDetectionDelay)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const canvasStyle = {
    background:
      window.innerWidth <= 768
        ? "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f23 60%, #000000 100%)"
        : "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 30%, #0f0f23 70%, #000000 100%)",
  }

  if (!isVisible) {
    return <div className="galaxy-background absolute inset-0 w-full h-full" style={canvasStyle} />
  }

  return (
    <div className="galaxy-background absolute inset-0 w-full h-full">
      <Canvas
        dpr={[1, window.innerWidth <= 768 ? 1 : 1.5]}
        camera={{
          position: [0, 0, window.innerWidth <= 768 ? 10 : 6],
          fov: window.innerWidth <= 768 ? 65 : 70,
          far: 200,
        }}
        style={canvasStyle}
        gl={{
          antialias: window.innerWidth > 768,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        frameloop={isScrolling ? "never" : "always"}
      >
        <ambientLight intensity={0.04} />
        <pointLight position={[8, 8, 8]} intensity={0.6} color="#8b5cf6" />
        <pointLight position={[-8, -8, -8]} intensity={0.4} color="#ec4899" />
        <pointLight position={[0, 0, -15]} intensity={0.3} color="#06b6d4" />

        <Environment preset="night" />

        <Stars
          radius={80}
          depth={40}
          count={config.starField.count / 2}
          factor={1.5}
          saturation={0}
          fade
          speed={isScrolling ? 0 : 0.03}
        />

        <StarField count={config.starField.count} isScrolling={isScrolling} />
        <StarShower count={config.starShower.count} isScrolling={isScrolling} />
        <GalacticDust count={config.galacticDust.count} isScrolling={isScrolling} />

        {window.innerWidth > 768 && (
          <>
            <NebulaCloud position={[-15, 10, -25]} color="#8b5cf6" scale={1.2} isScrolling={isScrolling} />
            <NebulaCloud position={[20, -8, -30]} color="#ec4899" scale={1.0} isScrolling={isScrolling} />
            <NebulaCloud position={[0, 15, -35]} color="#06b6d4" scale={1.4} isScrolling={isScrolling} />
          </>
        )}

        <GalaxyCore isScrolling={isScrolling} />
        <FloatingOrbs count={config.orbs.count} isScrolling={isScrolling} />

        <CameraController mousePosition={mousePosition} isScrolling={isScrolling} />
      </Canvas>
    </div>
  )
}

// PropTypes for type checking
GalaxyBackground.propTypes = {
  mousePosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
}

export default GalaxyBackground
