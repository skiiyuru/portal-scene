import {
  Center,
  OrbitControls,
  Sparkles,
  shaderMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei"
import portalVS from "./shaders/portal/vertex.glsl"
import portalFS from "./shaders/portal/fragment.glsl"
import * as THREE from "three"
import { extend, useFrame } from "@react-three/fiber"
import { useRef } from "react"

const BG_COLOUR = "#000907"
const PORTAL_COLOUR = "#A8DBEE"

// custom portal shader
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(BG_COLOUR),
    uColorEnd: new THREE.Color(PORTAL_COLOUR),
  },
  portalVS,
  portalFS
)

// make our custom shader available as a tag in r3f
extend({ PortalMaterial })

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb")
  const bakedTexture = useTexture("./model/baked.jpg")
  bakedTexture.flipY = false

  const portalRef = useRef()

  useFrame((state, delta) => {
    portalRef.current.uTime += delta
  })

  return (
    <>
      {/* Background color */}
      <color args={[BG_COLOUR]} attach={"background"} />

      <OrbitControls
        makeDefault
        enablePan={false}
        // minDistance={5}
        maxDistance={7}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.7}
      />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial
            map={bakedTexture}
            // map-flipY={true}
          />
        </mesh>

        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
          scale={[1.3, 1, 1]}
        >
          <meshBasicMaterial color={"#E5582A"} />
        </mesh>

        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
          scale={[1.3, 1, 1]}
        >
          <meshBasicMaterial color={"#E5582A"} />
        </mesh>

        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          {/* <meshBasicMaterial color={"#A8DBEE"} /> */}
          {/* <shaderMaterial
            vertexShader={portalVS}
            fragmentShader={portalFS}
            uniforms={{
              uTime: {
                value: 0,
              },
              uColorStart: {
                value: new THREE.Color(PORTAL_COLOUR),
              },
              uColorEnd: {
                value: new THREE.Color(BG_COLOUR),
              },
            }}
          /> */}
          <portalMaterial ref={portalRef} />
        </mesh>

        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
          noise={[0.5, 0, 0.5]}
        />
      </Center>
    </>
  )
}
