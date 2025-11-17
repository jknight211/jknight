import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Avatar3DProps {
  skinColor?: string;
  hairColor?: string;
  eyeColor?: string;
  eyeShape?: 'round' | 'almond' | 'wide';
  noseSize?: 'small' | 'medium' | 'large';
  mouthShape?: 'smile' | 'neutral' | 'small';
  course?: string;
  emotion?: 'happy' | 'neutral' | 'excited' | 'focused';
  autoRotate?: boolean;
  gender?: 'male' | 'female';
}

const COURSE_OUTFITS: Record<string, { color: string; accessory?: string }> = {
  'Accountancy': { color: '#1E40AF', accessory: 'tie' },
  'Banking & Finance': { color: '#1E3A8A', accessory: 'tie' },
  'Business Administration': { color: '#6366F1', accessory: 'tie' },
  'Computer Engineering': { color: '#3B82F6', accessory: 'badge' },
  'Cybersecurity & Digital Forensics': { color: '#1E293B', accessory: 'badge' },
  'Data Science & Analytics': { color: '#8B5CF6', accessory: 'badge' },
  'Information Technology': { color: '#3B82F6', accessory: 'badge' },
  'Aerospace Engineering': { color: '#0EA5E9', accessory: 'badge' },
  'Mechanical Engineering': { color: '#F59E0B', accessory: 'badge' },
  'Electrical Engineering': { color: '#EAB308', accessory: 'badge' },
  'Civil Engineering': { color: '#F97316', accessory: 'badge' },
  'Biomedical Engineering': { color: '#10B981', accessory: 'badge' },
  'Chemical Engineering': { color: '#14B8A6', accessory: 'badge' },
  'Nursing': { color: '#FFFFFF', accessory: 'medical' },
  'Biotechnology': { color: '#10B981', accessory: 'lab' },
  'Architecture': { color: '#6B7280', accessory: 'badge' },
  'Interior Design': { color: '#EC4899', accessory: 'badge' },
  'Game Design & Development': { color: '#A855F7', accessory: 'badge' },
  'Visual Communication': { color: '#F472B6', accessory: 'badge' },
  'Media Production': { color: '#EF4444', accessory: 'badge' },
  'Mass Communication': { color: '#DC2626', accessory: 'badge' },
  'Hotel & Hospitality Management': { color: '#92400E', accessory: 'tie' },
  'Tourism & Resort Management': { color: '#B45309', accessory: 'tie' },
  'Baking & Culinary Science': { color: '#FFFFFF', accessory: 'chef' },
  'Automotive Technology': { color: '#18181B', accessory: 'badge' },
  'Default': { color: '#3B82F6', accessory: 'badge' }
};

function CameraController({ autoRotate }: { autoRotate?: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 3);
  }, [camera]);

  useFrame(() => {
    if (autoRotate) {
      camera.position.x = Math.sin(Date.now() * 0.0005) * 3;
      camera.position.z = Math.cos(Date.now() * 0.0005) * 3;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function AvatarMesh({
  skinColor = '#FFD6A5',
  hairColor = '#4A2C2A',
  eyeColor = '#1F2937',
  eyeShape = 'round',
  noseSize = 'medium',
  mouthShape = 'smile',
  course = 'Default',
  emotion = 'neutral',
  gender = 'male'
}: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (headRef.current && emotion === 'excited') {
      headRef.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  const outfit = COURSE_OUTFITS[course] || COURSE_OUTFITS['Default'];

  const eyeSizes: Record<string, number> = { round: 0.08, almond: 0.07, wide: 0.09 };
  const eyeSize = eyeSizes[eyeShape];
  const eyeWidth = eyeShape === 'wide' ? 0.18 : 0.15;

  const noseSizes: Record<string, number> = { small: 0.04, medium: 0.05, large: 0.06 };
  const noseScale = noseSizes[noseSize];

  const mouthWidths: Record<string, number> = { smile: 0.15, neutral: 0.12, small: 0.10 };
  const mouthCurve = mouthShape === 'smile' ? 0.2 : mouthShape === 'neutral' ? 0.05 : 0;
  const mouthWidth = mouthWidths[mouthShape];

  return (
    <group ref={groupRef}>
      <group ref={headRef} position={[0, 0.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        <mesh position={[-eyeWidth, 0.1, 0.3]}>
          <sphereGeometry args={[eyeSize, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-eyeWidth, 0.1, 0.35]}>
          <sphereGeometry args={[eyeSize * 0.5, 16, 16]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>

        <mesh position={[eyeWidth, 0.1, 0.3]}>
          <sphereGeometry args={[eyeSize, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[eyeWidth, 0.1, 0.35]}>
          <sphereGeometry args={[eyeSize * 0.5, 16, 16]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>

        <mesh position={[0, 0.05, 0.38]}>
          <sphereGeometry args={[noseScale, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color(skinColor).multiplyScalar(0.8).getHex()} />
        </mesh>

        <mesh position={[0, -0.1, 0.35]} rotation={[0, 0, mouthCurve * 3]}>
          <torusGeometry args={[mouthWidth, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        <mesh position={[0, 0.45, 0.05]}>
          <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>

        <mesh position={[-0.22, 0.28, 0.05]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        <mesh position={[0.22, 0.28, 0.05]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>

        {gender === 'female' && (
          <>
            <mesh position={[-0.25, 0, -0.15]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.25, 0, -0.15]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[-0.28, -0.15, -0.12]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.28, -0.15, -0.12]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </>
        )}
      </group>

      <group position={[0, -0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.6, 32]} />
          <meshStandardMaterial color={outfit.color} />
        </mesh>

        {outfit.accessory === 'medical' && (
          <>
            <mesh position={[0, 0.15, 0.21]}>
              <boxGeometry args={[0.15, 0.08, 0.02]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0, 0.15, 0.22]}>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0, 0.15, 0.22]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
          </>
        )}

        {outfit.accessory === 'chef' && (
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.18, 0.15, 0.15, 32]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        )}

        {outfit.accessory === 'tie' && (
          <>
            <mesh position={[0, 0.1, 0.21]}>
              <boxGeometry args={[0.04, 0.25, 0.01]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0, 0.25, 0.21]}>
              <boxGeometry args={[0.08, 0.06, 0.01]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </>
        )}

        {outfit.accessory === 'badge' && (
          <mesh position={[0.08, 0.15, 0.21]}>
            <circleGeometry args={[0.04, 16]} />
            <meshStandardMaterial color="#FCD34D" />
          </mesh>
        )}

        {outfit.accessory === 'lab' && (
          <mesh position={[0, 0, 0.21]}>
            <boxGeometry args={[0.3, 0.6, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.8} />
          </mesh>
        )}

        <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.08, 0.06, 0.5, 16]} />
          <meshStandardMaterial color={outfit.color} />
        </mesh>

        <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.08, 0.06, 0.5, 16]} />
          <meshStandardMaterial color={outfit.color} />
        </mesh>
      </group>

      <mesh position={[-0.25, -0.85, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      <mesh position={[0.25, -0.85, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      <mesh position={[-0.25, -1.05, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.05, 0.15]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>
      <mesh position={[0.25, -1.05, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.05, 0.15]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>
    </group>
  );
}

export function Avatar3D(props: Avatar3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color="#60A5FA" />
        <pointLight position={[5, -2, 2]} intensity={0.3} color="#34D399" />

        <AvatarMesh {...props} />
        <CameraController autoRotate={props.autoRotate} />
      </Canvas>
    </div>
  );
}
