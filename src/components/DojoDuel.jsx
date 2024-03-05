import { gsap, Power2 } from "gsap"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { SoftShadows, Bounds } from "@react-three/drei"
import { DuelCard } from "./DuelCard.jsx"


export default function SlimShady(props) {

    const canvasRef = useRef()
    const cardsRef = useRef()

    const { SoftShadowConfig } = {
        enabled: true,
        size: { value: 50 },
        focus: { value: 0 },
        samples: { value: 8 }
    }

    const cameraConfig = {
        position: [0, 5.5, 4], 
        fov: 50
    }

    const updateCamera = (e) => {
        if(canvasState){    
            const offset = {
                x: (e.clientX - canvasRef.current.offsetWidth * 0.5) / canvasRef.current.offsetWidth,
                z: (e.clientY - canvasRef.current.offsetHeight * 0.5) / canvasRef.current.offsetHeight,
            }
            gsap.to(canvasState.camera.position, {duration: 1.0, x: offset.x * 0.05, z: cameraConfig.position[2] - offset.z * 0.05, ease: Power2.easeOut, onUpdate: () => {
                canvasState.camera.lookAt(0,0,0)
            }})
        }
    }

    /**
     * GET CANVAS STATE
     * This also gives access to the camera
     */
    const [canvasState, setCanvasState] = useState(null)
    const SetState = () => {
        return(
            useThree((state) => {
                if(!canvasState){
                    setCanvasState(state)
                }
            })
        )
    }
    
    

    /**
     * SHOW WILDCARD
     */
    useEffect(
        () => {
            if(cardsRef.current && canvasState){
                if (props.wildCardShowing) {
                    gsap.to(cardsRef.current.position, { duration: 0.5, x: -1.1, ease: Power2.easeInOut })
                    gsap.to(canvasState.camera.position, {duration: 0.5, y: cameraConfig.position[1] + 2, ease: Power2.easeInOut, onUpdate: () => {
                        canvasState.camera.lookAt(0,0,0)
                    }})
                } else {
                    gsap.to(cardsRef.current.position, { duration: 0.5, x: 0, ease: Power2.easeInOut })
                    gsap.to(canvasState.camera.position, {duration: 0.5, y: cameraConfig.position[1], ease: Power2.easeInOut, onUpdate: () => {
                        canvasState.camera.lookAt(0,0,0)
                    }})
                }
            }
        }, [cardsRef.current, props.wildCardShowing]
    )

    return (

        <Canvas
            shadows
            gl={{
                antialias: true
            }}
            camera={cameraConfig}
            onMouseMove={updateCamera}
            ref={canvasRef}
        >
            <SetState />
            {<SoftShadows {...SoftShadowConfig} />}
            <ambientLight intensity={1} />
            <directionalLight position={[2, 10, 2]} intensity={0.5} />
            <directionalLight castShadow position={[2, 10, 2]} intensity={0.5} shadow-mapSize={1024}>
                <orthographicCamera attach="shadow-camera" args={[-5, 10, -5, 8, -5, 50]} />
            </directionalLight>
            <pointLight position={[-3, 5, 2]} color="white" intensity={15.0} />
            <pointLight position={[0, 5, 2]} color="white" intensity={15.0} />
            <pointLight position={[3, 5, 2]} color="white" intensity={15.0} />


            <group position={[0,0,-0.5]}>

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                    <planeGeometry args={[10, 10]} />
                    <shadowMaterial transparent={false} opacity={0.2} />
                </mesh>

                <group ref={cardsRef}>
                    <DuelCard
                        isShuffling={props.isShuffling}
                        type={"Technology"}
                        data={props.cardData.Technology}
                        index={0}
                        position={[-2.2, -0.4, 0]}
                        color={"#646464"} dark
                    />
                    <DuelCard
                        isShuffling={props.isShuffling}
                        type={"Behaviour"}
                        data={props.cardData.Behaviour}
                        index={1}
                        position={[0, -0.4, 0]}
                        color={"#191919"} dark
                    />
                    <DuelCard
                        isShuffling={props.isShuffling}
                        type={"Outcome"}
                        data={props.cardData.Outcome}
                        index={2}
                        position={[2.2, -0.4, 0]}
                        color={"#e8e8e8"}
                    />
                    <DuelCard
                        isShuffling={props.isShuffling}
                        wildCardShowing={props.wildCardShowing}
                        type={"WildCard"}
                        data={props.cardData.WildCard}
                        index={3}
                        position={[4.4, -0.4, 0]}
                        color={"#f4a3a5"}
                    />
                </group>
            </group>
        </Canvas>
    )
}
