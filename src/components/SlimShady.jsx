import { gsap, Power2 } from "gsap"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { Environment, Lightformer, SoftShadows, Float, OrbitControls } from "@react-three/drei"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import paperURL from '../assets/paper-normals-square.jpg'
import displacementURL from '../assets/paper-displacement-square.jpg'
import { BoxBlendGeometry } from "./BoxBlendGeometry.jsx"

function Card({ position = [0, 0, 0], ...props }) {
    const normalsMap = useLoader(TextureLoader, paperURL)
    const displacementTextureMap = useLoader(TextureLoader, displacementURL)

    const ref = useRef()
    const groupRef = useRef()

    const factor = useMemo(() => 0.5 + Math.random(), [])

    const [cardState, setCardState] = useState(0)
    const [intensity, setIntensity] = useState(0)
    const [rotationIntensity, setRotationIntensity] = useState(0)

    const toggleState = () => {

        const isUp = (cardState + 1) % 3;
        if (isUp) {
            if(isUp === 1){
                gsap.to(ref.current.position, { duration: 0.6, y: 1, z: 0.75, ease: Power2.easeInOut })
                gsap.to(ref.current.rotation, { duration: 0.4, x: Math.PI * 0.67, ease: Power2.easeInOut, delay: 0.2 })
            }
            if(isUp === 2){
                gsap.to(ref.current.rotation, { duration: 0.6, y: Math.PI * 1, ease: Power2.easeInOut })
            }
            
            // setIntensity(0.5)
            // setRotationIntensity(0.25)
        } else {
            gsap.to(ref.current.position, { duration: 0.8, y: -0.48, z: 0, ease: Power2.easeInOut })
            gsap.to(ref.current.rotation, { duration: 0.6, x: Math.PI * 0.5, y: 0, ease: Power2.easeInOut })
            setIntensity(0)
            setRotationIntensity(0)
        }
        setCardState(isUp)
    }

    return (

        <group ref={groupRef} rotation={[0, 0, 0]}>
            <Float
                floatIntensity={intensity}
                speed={1}
                rotationIntensity={rotationIntensity}
                floatingRange={[0.1, 0.5]}
            >
                <group
                    // rotation={[0, Math.PI * 0.5, 0]}
                    // position={position}
                    ref={ref}
                    rotation={[Math.PI * 0.5, 0, 0]}
                    position={position}
                >
                    <mesh                        
                        castShadow
                        receiveShadow
                        onClick={(e) => toggleState()}
                    >
                        <BoxBlendGeometry radius={0.2} width={2} height={3} depth={0.02} />
                        {/* <boxGeometry args={[0.02, 3, 2]} /> */}
                        <meshLambertMaterial color="#fff" roughness={1} metalness={0} />
                    </mesh>
                </group>
            </Float>
        </group >

    )
}

function Cards({ number = 3 }) {
    // const normalsMap = useLoader(TextureLoader, paperURL)
    const positions = useMemo(() => [...new Array(number)].map((item, i) => [
        -2.35 + (i * 7 / number),
        -0.5,
        0
    ]), [])

    return (
        <group rotation={[0, 0,0]}>
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
        samples: { value: 6 }
    }
    const canvasRef = useRef()

    useEffect(
        () => {

            console.log(canvasRef)


        }, [canvasRef]
    )



    return (
        <Canvas
            ref={canvasRef}
            shadows
            camera={{ position: [0,6,5], fov: 50 }}
        >
            {<SoftShadows {...config} />}
            <fog attach="fog" args={["black", 0, 40]} />
            <ambientLight intensity={0.9} />
            <directionalLight castShadow position={[2.5, 8, 5]} intensity={3} shadow-mapSize={1024}>
                <orthographicCamera attach="shadow-camera" args={[-10, 5, -10, 10, 5, 50]} />
            </directionalLight>
            <pointLight position={[-10, -10, -20]} color="red" intensity={10.2} />
            <pointLight position={[0, -10, 0]} color="green" intensity={10.0} />
            <group position={[0, 0, 0]}>

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                    <planeGeometry args={[100, 100]} />
                    <shadowMaterial transparent={false} opacity={0.5} />
                </mesh>

                <Cards />
            </group>

            {/* <OrbitControls
                enablePan={false}
                enableZoom={false}
                // enableRotate={false}
                minAzimuthAngle={-Math.PI / 8}
                maxAzimuthAngle={Math.PI / 8}
                minPolarAngle={Math.PI * -0.25}
                maxPolarAngle={Math.PI * 0.25}
            /> */}
        </Canvas>
    )
}
