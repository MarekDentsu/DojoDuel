import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { SoftShadows, Bounds } from "@react-three/drei"
import { Card } from "./Card.jsx"


export default function SlimShady(props) {

    const { SoftShadowConfig } = {
        enabled: true,
        size: { value: 10 },
        focus: { value: 0 },
        samples: { value: 6 }
    }

    const canvasRef = useRef()

    const updateCamera = (e) => {
        
    }

    return (
        <Canvas
            ref={canvasRef}
            shadows
            camera={{ position: [0, 6, 5], fov: 50 }}
            onMouseMove={updateCamera}
        >
            {<SoftShadows {...SoftShadowConfig} />}
            <ambientLight intensity={0.9} />
            <directionalLight castShadow position={[2.5, 8, 5]} intensity={3} shadow-mapSize={1024}>
                <orthographicCamera attach="shadow-camera" args={[-10, 5, -10, 10, 5, 50]} />
            </directionalLight>
            <pointLight position={[-10, -10, -20]} color="red" intensity={10.2} />
            <pointLight position={[0, -10, 0]} color="green" intensity={10.0} />
            <group position={[0, 0, 0]}>

                {/* SHADOW PLANE */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <shadowMaterial transparent={false} opacity={0.5} />
                </mesh>

                {/* <Bounds fit clip observe margin={0.9}> */}
                    <group>
                        <Card isShuffling={props.isShuffling} type={"Behaviour"} data={props.cardData.Behaviour} index={0} position={[-2.3, -0.4, 0]} color={"#f0f0f0"} />
                        <Card isShuffling={props.isShuffling} type={"Outcome"} data={props.cardData.Outcome} index={1} position={[0, -0.4, 0]} color={"#aaaaaa"} />
                        <Card isShuffling={props.isShuffling} type={"Technology"} data={props.cardData.Technology} index={2} position={[2.3, -0.4, 0]} color={"#666666"} dark />
                    </group>
                {/* </Bounds> */}
            </group>
        </Canvas>
    )
}
