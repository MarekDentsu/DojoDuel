import { gsap, Power2 } from "gsap";

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { SoftShadows, } from "@react-three/drei"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import paperURL from '../assets/paper-normals-square.jpg'
import floorURL from '../assets/background-texture.jpg'




const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)

function Card({ position = [0, 0, 0], ...props }) {
    const normalsMap = useLoader(TextureLoader, paperURL)
    const ref = useRef()
    const factor = useMemo(() => 0.5 + Math.random(), [])

    const [isUp, setIsUp] = useState(false)

    const toggleState = () => {
        console.log("isUp", isUp)
        setIsUp(!isUp)

    }

    useFrame((state) => {
        const t = easeInOutCubic((0 + Math.sin(state.clock.getElapsedTime() * factor)) / 2)
        if(isUp){
            ref.current.position.x = 0.5 +  position[1] + t * 0.25
            ref.current.rotation.z = Math.PI * 0.25
        } else {
            ref.current.position.x = -0.4
            ref.current.rotation.z = Math.PI * 0
        }
    })
    return (
        <mesh ref={ref} position={position} {...props} castShadow receiveShadow onClick={(e) => toggleState()}>
            <boxGeometry args={[0.03, 3, 2]} />
            <meshLambertMaterial color="#fff" roughness={0} metalness={0.1} normalMap={normalsMap} />
        </mesh>
    )
}

function Cards({ number = 3 }) {
    // const normalsMap = useLoader(TextureLoader, paperURL)
    const ref = useRef()
    const positions = useMemo(() => [...new Array(number)].map((item, i) => [
        -0.5, 
        0.5, 
        -2.5 + (i * 7 / number)
    ]), [])
    // useFrame((state) => (ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() / 20) * Math.PI)) + (Math.PI * 0.5)
    return (
        <group ref={ref} rotation={[0,Math.PI * 0.5,Math.PI * 0.5]}>
            {positions.map((pos, index) => (
                <Card key={index} index={index} position={pos} />
            ))}
        </group>
    )
}

export default function SlimShady() {
    const { config } = {
        enabled: true,
        size: { value: 10 },
        focus: { value: 0 },
        samples: { value: 12 }
    }

    const floorTextureMap = useLoader(TextureLoader, floorURL)

    return (
        <Canvas shadows camera={{ position: [0, 7, 5], fov: 50 }}>
            {<SoftShadows {...config} />}
            <fog attach="fog" args={["white", 0, 40]} />
            <ambientLight intensity={0.5} />
            <directionalLight castShadow position={[2.5, 8, 5]} intensity={3} shadow-mapSize={1024}>
                <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 5, 40]} />
            </directionalLight>
            <pointLight position={[-10, 0, -20]} color="white" intensity={1.2} />
            <pointLight position={[0, -10, 0]} intensity={1.0} />
            <group position={[0, 0, 0]}>
                {/* <mesh receiveShadow castShadow>
                    <boxGeometry args={[6, 1, 5]} />
                    <meshLambertMaterial color={"#333"} />
                </mesh> */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <shadowMaterial transparent opacity={0.4} map={floorTextureMap} />
                </mesh>
                {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <meshBasicMaterial  map={floorTextureMap} />
                </mesh> */}
                <Cards />
            </group>
        </Canvas>
    )
}
