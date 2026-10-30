import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import type { PlanetId } from "@/lib/data";

const TEX: Record<PlanetId, string> = {
  earth: "/textures/earth.jpg",
  moon: "/textures/moon.jpg",
  mars: "/textures/mars.jpg",
};
const ATMOS: Record<PlanetId, [string, number]> = {
  earth: ["#4fc3ff", 1.0],
  moon: ["#c8d0dc", 0.0],
  mars: ["#ff9a5a", 0.45],
};

const atmosVertex = `varying vec3 vN; varying vec3 vP;
void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vP = mv.xyz; gl_Position = projectionMatrix*mv; }`;
const atmosFragment = `uniform vec3 c; uniform float k; varying vec3 vN; varying vec3 vP;
void main(){ float f = pow(1.0 - abs(dot(normalize(-vP), vN)), 3.0); gl_FragColor = vec4(c, f*k); }`;

function Planet({ id, speed }: { id: PlanetId; speed: number }) {
  const tex = useLoader(THREE.TextureLoader, TEX[id]);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * speed;
  });
  const [color, strength] = ATMOS[id];
  return (
    <group rotation={[0.2, 0, id === "earth" ? 0.41 : 0.05]}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={id === "earth" ? 0.6 : 2.5} roughness={id === "earth" ? 0.75 : 1} metalness={0} />
      </mesh>
      {strength > 0 && (
        <mesh scale={1.06}>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial
            vertexShader={atmosVertex}
            fragmentShader={atmosFragment}
            uniforms={{ c: { value: new THREE.Color(color) }, k: { value: strength } }}
            transparent
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function OrbitRing({ r }: { r: number }) {
  return (
    <mesh rotation={[Math.PI / 2.3, 0, 0.2]}>
      <torusGeometry args={[r, 0.003, 8, 200]} />
      <meshBasicMaterial color="#7fdcff" transparent opacity={0.35} />
    </mesh>
  );
}

export default function PlanetScene({
  planet = "earth",
  interactive = false,
  rings = false,
  speed = 0.08,
}: { planet?: PlanetId; interactive?: boolean; rings?: boolean; speed?: number }) {
  const [ready, setReady] = useState(false);
  return (
    <div className="h-full w-full" data-scene-ready={ready ? "" : undefined}>
      <Canvas camera={{ position: [0, 0, 3.1], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }} onCreated={() => setReady(true)}>
        <ambientLight intensity={planet === "earth" ? 0.12 : 0.08} />
        <directionalLight position={[5, 2, 4]} intensity={2.6} color="#fff6ea" />
        <directionalLight position={[-6, -1, -3]} intensity={0.25} color="#5aa9ff" />
        <Stars radius={60} depth={40} count={2500} factor={3} fade speed={0.4} />
        {rings && (<><OrbitRing r={1.55} /><OrbitRing r={1.9} /></>)}
        <Suspense fallback={null}>
          <Planet id={planet} speed={speed} />
        </Suspense>
        {interactive && <OrbitControls enablePan={false} minDistance={1.8} maxDistance={6} autoRotate={false} />}
      </Canvas>
    </div>
  );
}
