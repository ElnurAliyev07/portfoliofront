import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';

/**
 * CONSTANTS AND CONFIGURATION
 */
const getResponsiveConfig = () => {
  const isMobile = window.innerWidth <= 768;
  return {
    starField: {
      count: isMobile ? 400 : 800, // Reduce particle count on mobile
      radius: { min: 20, max: 80 },
      rotationSpeed: { x: 0.02, y: 0.001 },
      amplitude: 0.03
    },
    starShower: {
      count: isMobile ? 25 : 50, // Reduce particle count on mobile
      fallSpeed: { min: 0.1, max: 0.15 },
      resetHeight: { min: 50, max: 80 },
      horizontalDrift: 0.02
    },
    galacticDust: {
      count: isMobile ? 100 : 200, // Reduce particle count on mobile
      radius: { min: 40, max: 120 },
      rotationSpeed: 0.0005
    },
    orbs: {
      count: isMobile ? 3 : 6, // Reduce orb count on mobile
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
      movement: { radius: 2, speed: { min: 0.05, max: 0.15 } }
    },
    performance: {
      scrollDetectionDelay: 150,
      mouseThrottleDelay: 100
    }
  };
};

/**
 * StarField Component
 */
const StarField = ({ count, isScrolling }) => {
  const meshRef = useRef(null);
  const config = getResponsiveConfig();

  const starPositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const { radius } = config.starField;
    
    for (let i = 0; i < count; i++) {
      const index = i * 3;
      const sphereRadius = Math.random() * (radius.max - radius.min) + radius.min;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[index] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      positions[index + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      positions[index + 2] = sphereRadius * Math.cos(phi);
    }
    
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || isScrolling) return;

    const { rotationSpeed, amplitude } = config.starField;
    const time = state.clock.elapsedTime;

    meshRef.current.rotation.x = Math.sin(time * rotationSpeed.x) * amplitude;
    meshRef.current.rotation.y += rotationSpeed.y;
  });

  return (
    <Points ref={meshRef} positions={starPositions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={window.innerWidth <= 768 ? 0.3 : 0.5} // Smaller stars on mobile
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/**
 * StarShower Component
 */
const StarShower = ({ count, isScrolling }) => {
  const meshRef = useRef(null);
  const velocitiesRef = useRef(null);
  const originalPositionsRef = useRef(null);
  const config = getResponsiveConfig();

  const { particles, velocities, originalPositions } = useMemo(() => {
    const particlePositions = new Float32Array(count * 3);
    const particleVelocities = new Float32Array(count * 3);
    const { fallSpeed, resetHeight, horizontalDrift } = config.starShower;

    for (let i = 0; i < count; i++) {
      const index = i * 3;
      
      particlePositions[index] = (Math.random() - 0.5) * 100;
      particlePositions[index + 1] = Math.random() * 30 + resetHeight.min;
      particlePositions[index + 2] = (Math.random() - 0.5) * 50;

      particleVelocities[index] = (Math.random() - 0.5) * horizontalDrift;
      particleVelocities[index + 1] = -(Math.random() * fallSpeed.max + fallSpeed.min);
      particleVelocities[index + 2] = (Math.random() - 0.5) * horizontalDrift;
    }

    velocitiesRef.current = particleVelocities;
    originalPositionsRef.current = particlePositions.slice();
    
    return {
      particles: particlePositions,
      velocities: particleVelocities,
      originalPositions: particlePositions.slice()
    };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || isScrolling || !velocitiesRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array;
    const velocities = velocitiesRef.current;
    const originals = originalPositionsRef.current;

    for (let i = 0; i < count; i++) {
      const index = i * 3;

      positions[index] += velocities[index];
      positions[index + 1] += velocities[index + 1];
      positions[index + 2] += velocities[index + 2];

      if (positions[index + 1] < -50) {
        const { resetHeight } = config.starShower;
        positions[index] = originals[index] + (Math.random() - 0.5) * 20;
        positions[index + 1] = Math.random() * 30 + resetHeight.min;
        positions[index + 2] = originals[index + 2] + (Math.random() - 0.5) * 20;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={meshRef} positions={particles} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#87ceeb"
        size={window.innerWidth <= 768 ? 0.8 : 1.2} // Smaller particles on mobile
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/**
 * NebulaCloud Component
 */
const NebulaCloud = ({ position, color, scale, isScrolling }) => {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current || isScrolling) return;

    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.02;
    meshRef.current.rotation.y = Math.sin(time * 0.03) * 0.05;
    meshRef.current.rotation.z = Math.sin(time * 0.04) * 0.03;
  });

  return (
    <Sphere ref={meshRef} position={position} args={[3, 16, 16]} scale={window.innerWidth <= 768 ? scale * 0.7 : scale}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        roughness={0.8}
        metalness={0.2}
        emissive={color}
        emissiveIntensity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
};

/**
 * GalaxyCore Component
 */
const GalaxyCore = ({ isScrolling }) => {
  const outerMeshRef = useRef(null);
  const innerMeshRef = useRef(null);

  useFrame((state) => {
    if (isScrolling) return;

    const time = state.clock.elapsedTime;

    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += 0.002;
      outerMeshRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y -= 0.003;
      innerMeshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group position={[0, 0, -15]}>
      <Sphere ref={outerMeshRef} args={[4, 32, 32]} scale={window.innerWidth <= 768 ? 0.8 : 1}>
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          roughness={0.3}
          metalness={0.7}
          emissive="#4c1d95"
          emissiveIntensity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      <Sphere ref={innerMeshRef} args={[2, 32, 32]} scale={window.innerWidth <= 768 ? 0.8 : 1}>
        <meshStandardMaterial
          color="#ec4899"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.9}
          emissive="#be185d"
          emissiveIntensity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
};

/**
 * FloatingOrb Component
 */
const FloatingOrb = ({ position, color, scale, speed, index, isScrolling }) => {
  const meshRef = useRef(null);
  const config = getResponsiveConfig();

  useFrame((state) => {
    if (!meshRef.current || isScrolling) return;

    const time = state.clock.elapsedTime * speed;
    const { movement } = config.orbs;

    meshRef.current.position.x = position[0] + Math.sin(time + index) * movement.radius;
    meshRef.current.position.y = position[1] + Math.cos(time + index) * movement.radius;
    meshRef.current.position.z = position[2] + Math.sin(time * 0.5 + index) * (movement.radius * 0.5);

    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.004;
  });

  return (
    <Sphere ref={meshRef} args={[scale, 12, 12]} position={position}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        emissive={color}
        emissiveIntensity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
};

/**
 * FloatingOrbs Component
 */
const FloatingOrbs = ({ count, isScrolling }) => {
  const config = getResponsiveConfig();
  const orbsData = useMemo(() => {
    const { colors, movement } = config.orbs;
    
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      ],
      color: colors[i % colors.length],
      scale: 0.2 + Math.random() * 0.4,
      speed: movement.speed.min + Math.random() * (movement.speed.max - movement.speed.min),
    }));
  }, [count]);

  return (
    <>
      {orbsData.map((orb, index) => (
        <FloatingOrb
          key={`orb-${index}`}
          {...orb}
          index={index}
          isScrolling={isScrolling}
        />
      ))}
    </>
  );
};

/**
 * GalacticDust Component
 */
const GalacticDust = ({ count, isScrolling }) => {
  const meshRef = useRef(null);
  const config = getResponsiveConfig();

  const dustPositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const { radius } = config.galacticDust;
    
    for (let i = 0; i < count; i++) {
      const index = i * 3;
      const particleRadius = Math.random() * (radius.max - radius.min) + radius.min;
      const angle = Math.random() * Math.PI * 2;

      positions[index] = Math.cos(angle) * particleRadius;
      positions[index + 1] = (Math.random() - 0.5) * 10;
      positions[index + 2] = Math.sin(angle) * particleRadius;
    }
    
    return positions;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || isScrolling) return;
    meshRef.current.rotation.y += config.galacticDust.rotationSpeed;
  });

  return (
    <Points ref={meshRef} positions={dustPositions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#fbbf24"
        size={window.innerWidth <= 768 ? 0.2 : 0.3} // Smaller dust particles on mobile
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/**
 * CameraController Component
 */
const CameraController = ({ mousePosition, isScrolling }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (isScrolling) return;

    const targetX = mousePosition.x * (window.innerWidth <= 768 ? 0.3 : 0.5); // Reduced camera movement on mobile
    const targetY = -mousePosition.y * (window.innerWidth <= 768 ? 0.3 : 0.5);

    camera.position.x += (targetX - camera.position.x) * 0.005;
    camera.position.y += (targetY - camera.position.y) * 0.005;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

/**
 * Main GalaxyBackground Component
 */
const GalaxyBackground = ({ mousePosition = { x: 0, y: 0 } }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const config = getResponsiveConfig();

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, config.performance.scrollDetectionDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const canvasStyle = {
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 30%, #0f0f23 70%, #000000 100%)',
  };

  return (
    <div className="galaxy-background absolute inset-0 w-full h-full">
      <Canvas
        dpr={[1, window.innerWidth <= 768 ? 1.2 : 1.5]} // Lower DPR on mobile
        camera={{ position: [0, 0, window.innerWidth <= 768 ? 7 : 5], fov: window.innerWidth <= 768 ? 60 : 75 }} // Adjusted FOV and position
        style={canvasStyle}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.05} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ec4899" />
        <pointLight position={[0, 0, -20]} intensity={0.4} color="#06b6d4" />
        
        <Environment preset="night" />
        
        <Stars
          radius={100}
          depth={50}
          count={config.starField.count}
          factor={2}
          saturation={0}
          fade
          speed={isScrolling ? 0 : 0.05}
        />
        
        <StarField count={config.starField.count} isScrolling={isScrolling} />
        <StarShower count={config.starShower.count} isScrolling={isScrolling} />
        <GalacticDust count={config.galacticDust.count} isScrolling={isScrolling} />
        
        <NebulaCloud position={[-20, 15, -30]} color="#8b5cf6" scale={1.5} isScrolling={isScrolling} />
        <NebulaCloud position={[25, -10, -35]} color="#ec4899" scale={1.2} isScrolling={isScrolling} />
        <NebulaCloud position={[0, 20, -40]} color="#06b6d4" scale={1.8} isScrolling={isScrolling} />
        
        <GalaxyCore isScrolling={isScrolling} />
        <FloatingOrbs count={config.orbs.count} isScrolling={isScrolling} />
        
        <CameraController mousePosition={mousePosition} isScrolling={isScrolling} />
      </Canvas>
    </div>
  );
};

// PropTypes for type checking
GalaxyBackground.propTypes = {
  mousePosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

export default GalaxyBackground;