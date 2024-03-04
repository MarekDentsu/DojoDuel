import { gsap, Power2, Power3 } from "gsap"
import { useRef, useState, useEffect } from "react"
import { BoxBlendGeometry } from "./BoxBlendGeometry.jsx"
import { Decal, useTexture } from "@react-three/drei"
import logoURL from "../assets/dojo-vertical-black.svg"

export const DuelCard = (props) => {
    const cardRef = useRef()
    const cardGroupRef = useRef()

    const textures = {
        front: {
            canvas: document.createElement('canvas'),
            ctx: null,
            ref: useRef()
        },
        back: {
            canvas: document.createElement('canvas'),
            ctx: null,
            ref: useRef()
        }
    }

    const [logoImageLoaded, setLogoImageLoaded] = useState(false)
    const logoImg = document.createElement("img")
    logoImg.src = logoURL
    logoImg.onload = () => {
        setLogoImageLoaded(true)
    }

    textures.front.canvas.width = 800
    textures.front.canvas.height = 1200
    textures.back.canvas.width = 800
    textures.back.canvas.height = 1200

    const setContexts = () => {
        [textures.front, textures.back].map(texture => {
            texture.ctx = texture.canvas.getContext('2d')
        })
    }

    const styles = {
        p: 44,
        h3: 30,
        h1: 100,
        padding: 60,
        paddingTop: 100,
    }

    /**
     * FLIP CARD STATE
     */
    const [cardState, setCardState] = useState(0)
    const flipCard = (n) => {
        const isFlip = (n || n === 0) ? n : (cardState + 1) % 2;
        if (isFlip) {
            
            gsap.to(cardRef.current.rotation, { duration: 0.6, y: Math.PI * 1, ease: Power2.easeInOut })
            
        } else {
            gsap.to(cardRef.current.rotation, { duration: 0.6, y: 0, ease: Power2.easeInOut })
        }
        setCardState(isFlip)
    }
    const showCard = () => {
        gsap.to(cardRef.current.position, { duration: 0.8, y: 1.4, z: 1.0, ease: Power2.easeInOut })
        gsap.to(cardRef.current.rotation, { duration: 0.6, x: Math.PI * 0.67, ease: Power2.easeInOut })
        
    }
    const hideCard = () => {
        gsap.to(cardRef.current.position, { duration: 0.8, y: -0.4, z: 0, ease: Power2.easeInOut })
        gsap.to(cardRef.current.rotation, { duration: 0.6, x: Math.PI * 0.5, ease: Power2.easeInOut })
    }

    /**
     * SLIDE OUt/IN ANIMATOIN
     */
    let timeline = null
    useEffect(
        () => {
            if (props.isShuffling) {

                const { index } = props
                const { current } = cardGroupRef
                if (timeline) {
                    timeline.kill()
                    timeline = null;
                }
                timeline = new gsap.timeline()
                timeline
                    // out
                    .to(current.position, { duration: 0.4, z: -10, ease: Power2.easeIn }, index * 0.06)
                    .to(current.position, { duration: 0.2, y: 5, ease: Power2.easeIn }, index * 0.06 + 0.2)
                    .to(current.rotation, { duration: 0.2, x: 1.0 * Math.PI, ease: Power3.easeIn }, index * 0.06 + 0.2)
                    // in
                    .set(current.position, { z: 10, y: 5 }, index * 0.06 + 0.8)
                    .set(current.rotation, { x: -1.0 * Math.PI }, index * 0.06 + 0.8)
                    .to(current.position, { duration: 0.75, z: 0, ease: Power2.easeOut }, index * 0.06 + 0.8)
                    .to(current.position, { duration: 0.5, y: 0, ease: Power2.easeOut }, index * 0.06 + 0.8)
                    .to(current.rotation, { duration: 0.6, x: 0, ease: Power3.easeOut }, index * 0.06 + 0.8)
            }
        }, [props.isShuffling]
    )

    /**
     * SHOW WILDCARD
     */
    useEffect(
        () => {
            if (props.type === "WildCard") {
                setContexts()

                if (props.wildCardShowing) {
                    gsap.to(cardGroupRef.current.position, { duration: 0.6, x: 0, ease: Power2.easeOut })
                    gsap.set(cardGroupRef.current, {
                        visible: true, onComplete: () => {
                            drawCardTextures()
                        }
                    })
                } else {
                    gsap.to(cardGroupRef.current.position, { duration: 0.6, x: 10, ease: Power2.easeIn })
                    gsap.set(cardGroupRef.current, { visible: false, delay: 0.5 })
                }
            }
        }, [props.wildCardShowing]
    )


    const drawMultiLineText = (text, context, fontSize, fontWeight, position) => {
        context.font = `${fontWeight} ${fontSize}px StabilGrotesk`;
        const space = fontSize * 0.25
        const lineHeight = fontSize * 1.2
        let wordX = styles.padding;
        let wordY = position.y + lineHeight;

        // console.log(">", text)

        if (text) {
            if (text.indexOf(" ") > -1) {
                text.split(" ").map(word => {
                    const metrics = context.measureText(word)
                    if (wordX + space + metrics.width < textures.front.canvas.width - styles.padding) {
                        wordX += (wordX > styles.padding) ? space : 0;
                    } else {
                        wordX = styles.padding
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
        /**
         * FRONT
         */
        textures.front.ctx.clearRect(0, 0, textures.front.canvas.width, textures.front.canvas.height)

        // set colour
        textures.front.ctx.fillStyle = "#000"
        if (props.dark) {
            textures.front.ctx.fillStyle = "#f0f0f0"
        }

        let position = {
            x: styles.padding,
            y: styles.paddingTop
        }

        position = drawMultiLineText(
            props.type.toUpperCase(), textures.front.ctx, styles.h3, "bold", position
        )

        if (props.data.name) {
            position = drawMultiLineText(
                props.data.name, textures.front.ctx, styles.h1, "normal", position
            )
        }

        if (props.data.fact && props.type !== "WildCard") {
            position.y += styles.p * 2
            position = drawMultiLineText(
                props.data.fact, textures.front.ctx, styles.p, "normal", position
            )
        }

        /**
         * BACK
         */
        textures.back.ctx.fillStyle = "#e0e0e0"
        textures.back.ctx.fillRect(0, 0, textures.back.canvas.width, textures.back.canvas.height)
        position.x = styles.padding,
            position.y = styles.paddingTop
        textures.back.ctx.fillStyle = "#000"

        if (props.data.whatIf) {
            position = drawMultiLineText(
                "WHAT IF...", textures.back.ctx, styles.h3, "bold", position
            )
            position.y += styles.p * 0.5
            position = drawMultiLineText(
                props.data.whatIf, textures.back.ctx, styles.p, "normal", position
            )
        }
        if (props.data.example) {
            if (position.y > styles.paddingTop) {
                position.y += styles.p * 2
            }
            position = drawMultiLineText(
                "EXAMPLE", textures.back.ctx, styles.h3, "bold", position
            )
            position.y += styles.p * 0.5
            position = drawMultiLineText(
                props.data.example, textures.back.ctx, styles.p, "normal", position
            )
        }
        if (props.data.howMight) {
            position = drawMultiLineText(
                "HOW MIGHT...", textures.back.ctx, styles.h3, "bold", position
            )
            position.y += styles.p * 0.5
            position = drawMultiLineText(
                props.data.howMight, textures.back.ctx, styles.p, "normal", position
            )
        }

        if (props.data.fact && props.type === "WildCard") {
            position = drawMultiLineText(
                props.data.fact, textures.back.ctx, styles.p, "normal", position
            )
        }

        // draw logo on card
        if(logoImageLoaded){
            textures.back.ctx.drawImage(logoImg, styles.padding, textures.back.canvas.height - styles.padding - 230, 120, 230)
        }


        // textures need updating
        textures.front.ref.current.needsUpdate = true;
        textures.back.ref.current.needsUpdate = true;
    }

    // UPDATE DATA
    useEffect(
        () => {
            setContexts();

            if (props.data) {
                let FontDelay = { alpha: 0 }
                gsap.to(FontDelay, {
                    duration: 0.1, alpha: 1, onUpdate: () => {
                        drawCardTextures(FontDelay.alpha)
                        cardRef.current.rotation.y = 0;
                    }, ease: Power2.easeOut
                })
            }
        }, [props.data]
    )

    return (
        <group ref={cardGroupRef} position={[(props.type === "WildCard") ? 10 : 0, 0, 0]}>
            <group
                ref={cardRef}
                rotation={[Math.PI * 0.5, 0, 0]}
                position={props.position}
            >
                <mesh
                    castShadow
                    receiveShadow
                    onClick={(e) => flipCard()}
                    onPointerOver={(e) => showCard()}
                    onPointerOut={(e) => hideCard()}
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
                        scale={[2, 3, 0.02]}
                    >
                        <meshStandardMaterial
                            roughness={0.5}
                            metalness={0.5}
                            polygonOffset
                            polygonOffsetFactor={-1}
                            transparent
                        >
                            <canvasTexture
                                ref={textures.front.ref}
                                attach="map"
                                image={textures.front.canvas}
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
                        scale={[2, 3, 0.02]}
                    >
                        <meshStandardMaterial
                            roughness={0.5}
                            metalness={0.5}
                            polygonOffset
                            polygonOffsetFactor={-1}
                            transparent
                        >
                            <canvasTexture
                                ref={textures.back.ref}
                                attach="map"
                                image={textures.back.canvas}
                            />
                        </meshStandardMaterial>
                    </Decal>
                </mesh>
            </group>
        </group >
    )
}
