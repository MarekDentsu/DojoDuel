import { gsap, Power2, Power3 } from "gsap"
import { useRef, useState, useEffect } from "react"
import { BoxBlendGeometry } from "./BoxBlendGeometry.jsx"
import { Decal, useTexture } from "@react-three/drei"

export const Card = (props) => {
    const cardRef = useRef()
    const cardGroupRef = useRef()
    const frontTextureRef = useRef()
    const backTextureRef = useRef()

    const canvas = document.createElement('canvas')
    canvas.width = 1800;
    canvas.height = 2800
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 600, 1600)

    /**
     * FLIP CARD STATE
     */
    const [cardState, setCardState] = useState(0)
    const toggleState = (n) => {
        const isUp = (n || n === 0) ? n : (cardState + 1) % 3;
        if (isUp) {
            if (isUp === 1) {
                gsap.to(cardRef.current.position, { duration: 0.6, y: 1, z: 0.75, ease: Power2.easeInOut })
                gsap.to(cardRef.current.rotation, { duration: 0.4, y: Math.PI * 1, x: Math.PI * 0.67, ease: Power2.easeInOut, delay: 0.2 })
            }
            if (isUp === 2) {
                gsap.to(cardRef.current.rotation, { duration: 0.6, y: 0, ease: Power2.easeInOut })
            }
        } else {
            gsap.to(cardRef.current.position, { duration: 0.8, y: -0.4, z: 0, ease: Power2.easeInOut })
            gsap.to(cardRef.current.rotation, { duration: 0.6, x: Math.PI * 0.5, ease: Power2.easeInOut })
        }
        setCardState(isUp)
    }

    /**
     * SLIDE OUt/IN ANIMATOIN
     */
    let timeline = null
    useEffect(
        () => {
            if (props.isShuffling) {
                toggleState(0)

                const { index } = props
                const { current } = cardGroupRef
                if (timeline) {
                    timeline.kill()
                    timeline = null;
                }
                timeline = new gsap.timeline()
                timeline
                    // out
                    .to(current.position, { duration: 0.6, z: -10, ease: Power2.easeIn }, index * 0.1)
                    .to(current.position, { duration: 0.4, y: 5, ease: Power2.easeIn }, index * 0.1 + 0.2)
                    .to(current.rotation, { duration: 0.4, x: 1.0 * Math.PI, ease: Power3.easeIn }, index * 0.1 + 0.2)
                    // in
                    .set(current.position, { z: 10, y: 5 }, index * 0.1 + 0.8)
                    .set(current.rotation, { x: -1.0 * Math.PI }, index * 0.1 + 0.8)
                    .to(current.position, { duration: 0.75, z: 0, ease: Power2.easeOut }, index * 0.1 + 0.8)
                    .to(current.position, { duration: 0.5, y: 0, ease: Power2.easeOut }, index * 0.1 + 0.8)
                    .to(current.rotation, { duration: 0.6, x: 0, ease: Power3.easeOut }, index * 0.1 + 0.8)
            }
        }, [props.isShuffling]
    )

    /**
     * CARD TEXTURES
     */
    const logo = useTexture("/textures/dojo-vertical.svg")
    
    
    const drawMultiLineText = (text, context, fontSize, fontWeight, position) => {
        context.font = `${fontWeight} ${fontSize}px StabilGrotesk`;
        const space = fontSize * 0.25
        const lineHeight = fontSize * 1.2
        let wordX = 0;
        let wordY = position.y + lineHeight;
        
        console.log(">", text)

        if(text){
            if(text.indexOf(" ") > -1){
                text.split(" ").map(word => {
                    const metrics = context.measureText(word)
                    if(wordX + space + metrics.width < canvas.width){
                        wordX += (wordX > 0) ? space : 0;
                    } else {
                        wordX = 0
                        wordY += lineHeight
                    }
                    context.fillText(word, wordX, wordY);
                    wordX += metrics.width
                })
            } else {
                context.fillText(text, wordX, wordY);
            }
        } else {
            context.fillRect(position.x, position.y, canvas.width, lineHeight)
        }
        return {
            x: wordX,
            y: wordY
        }
    }

    const drawCardTextures = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        
        // set colour
        ctx.fillStyle = "#000"
        if(props.dark){
            ctx.fillStyle = "#fff"
        }

        let position = {
            x: 0,
            y: 0
        }

        console.log(">>> data: ", props.data)
        console.log("> type: ", props.type.toUpperCase())
        position = drawMultiLineText(
            props.type.toUpperCase(), ctx, 100, "bold", position
        )

        console.log("> name: ", props.data.name)
        position = drawMultiLineText(
            props.data.name, ctx, 200, "normal", position
        )
        
        
    }

    useEffect(
        () => {
            drawCardTextures()
            cardRef.current.rotation.y = 0;
            frontTextureRef.current.needsUpdate = true;
        }, [props.data]
    )

    return (
        <group ref={cardGroupRef}>
            <group
                ref={cardRef}
                rotation={[Math.PI * 0.5, 0, 0]}
                position={props.position}
            >
                <mesh
                    castShadow
                    receiveShadow
                    onClick={(e) => toggleState()}
                >
                    <BoxBlendGeometry radius={0.2} width={2} height={3} depth={0.04} />
                    <meshStandardMaterial color={props.color} roughness={0.85} metalness={0.5} />
                    
                    {/** 
                     * FRONT DECAL
                    */}
                    <Decal
                        // debug
                        position={[0, 0, -0.02]}
                        rotation={[0, Math.PI, Math.PI]}
                        scale={[1.8, 2.8, 0.02]}
                    >
                        <meshStandardMaterial
                            roughness={0.5} 
                            metalness={0.5} 
                            polygonOffset
                            polygonOffsetFactor={-1}
                            transparent
                        >
                            <canvasTexture
                                ref={frontTextureRef}
                                attach="map"
                                image={canvas}
                            />
                        </meshStandardMaterial>
                    </Decal>
                    {/** 
                     * BACK DECAL
                    */}
                    <Decal
                        // debug
                        position={[0, 0, 0.02]}
                        rotation={[0, 0, Math.PI]}
                        scale={[1.8, 2.8, 0.02]}
                    >
                        <meshStandardMaterial
                            roughness={0.5} 
                            metalness={0.5} 
                            polygonOffset
                            polygonOffsetFactor={-1}
                            transparent
                        >
                            <canvasTexture
                                ref={frontTextureRef}
                                attach="map"
                                image={canvas}
                            />
                        </meshStandardMaterial>
                    </Decal>
                </mesh>
            </group>
        </group >
    )
}
