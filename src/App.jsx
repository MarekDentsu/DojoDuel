import { useEffect, useState } from 'react'
import './App.scss'
import { data } from './data.js'
import DojoDuel from './components/DojoDuel.jsx'
import logoImageURL from './assets/dojo-vertical.svg'
import logoURL from "./assets/dojo-vertical-black.svg"
import dcDojoLockupURL from './assets/dc-dojo-lockup-landscape.svg'
import dcLockupURL from './assets/dc-lockup-small.svg'

import useResize from './hooks/UseResize'



function App() {
    const size = useResize();

    const [cardData, setCardData] = useState({
        Technology: {
            name: "",
            fact: "",
            example: ""
        },
        Behaviour: {
            name: "",
            fact: "",
            WhatIf: "",
            example: ""
        },
        Outcome: {
            name: "",
            fact: "",
            howMight: ""
        },
        WildCard: {
            name: "",
            fact: ""
        }
    })

    const updateCard = (type) => {
        const _data = data[type][Math.floor(Math.random() * data[type].length)]
        // console.log(_data)
        return _data
    }

    const updateCards = () => {
        setCardData({
            Technology: { ...updateCard("Technology") },
            Behaviour: { ...updateCard("Behaviour") },
            Outcome: { ...updateCard("Outcome") },
            WildCard: { ...updateCard("WildCard") }
        })
        // console.log(cardData);
    }

    const [smallScreen, setSmallScreen] = useState(false)
    useEffect(
        () => {
            if(size.width < 1024 && !smallScreen){
                setSmallScreen(true)
            } 
            if(size.width >= 1024 && smallScreen){
                setSmallScreen(false)
            } 
        }, [size]
    )

    const [isShuffling, setIsShuffling] = useState(false)
    const [wildCardShowing, setWildCardShowing] = useState(false)
    const shuffle = () => {
        console.log("shuffle")
        if (!isShuffling) {
            setIsShuffling(true)
            setTimeout(() => {
                updateCards()
            }, 400);
            setTimeout(() => {
                setIsShuffling(false)
            }, 1200);
        }
    }

    const drawWildCard = () => {
        setWildCardShowing(!wildCardShowing)
    }

    const [hideInstructions, setHideInstructions] = useState(false)
    const toggleInstructions = () => {
        if (!hideInstructions) {
            setTimeout(() => {
                updateCards()
                shuffle()
            }, 50);
        }
        setHideInstructions(!hideInstructions)
    }

    return (
        <div className='dojo-duel'>
            <DojoDuel cardData={cardData} isShuffling={isShuffling} wildCardShowing={wildCardShowing} />

            <img className='logo' src={logoImageURL} />

            <div className='header'>
                <div className='flex-row'>
                    <a
                        href="https://www.dentsucreative.com/location/australia"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img className='lockup opacity-hover grey-to-white' src={(size.width > 600) ? dcDojoLockupURL : dcLockupURL} alt="DC / DOJO" />
                    </a>
                </div>
            </div>

            <div className={`instructions${hideInstructions ? ' hidden' : ''}`}>
                <div className='container'>
                    <div className='flex two-col'>
                        <div className='col'>
                            <h1>A card game <br />like never before.</h1>
                            <p>One that rewards the risk-takers, and supports the storytellers. One that’ll push you to ideate – within moving constraints. All while discovering new innovations and possibilities. </p>
                            <p>Get set to park your serious side and unleash your creative spirit. </p>
                            <button className='lozenge white' onClick={() => { toggleInstructions() }}>
                                <span>Let’s Dojo.</span>
                            </button>
                        </div>
                        <div className='col pink'>
                            <h2>How to Duel</h2>
                            <ol>
                                <li>To start, you’ll be dealt 3 cards: 1 Tech, 1 Behaviour and 1 Outcome.</li>
                                <li>If used wisely, these cards should help you mould and refine your idea.</li>
                                <li>Then, just when you think you’ve cracked it, deal yourself a Wild Card. This could strengthen your idea, or injure it. Think fast!</li>
                                <li>After 10 brain-busting minutes, playtime ends and the duel begins.</li>
                                <li>All players must pitch their ideas to the wider group – revealing the cards they were dealt, and why they should be crowned champion.</li>
                            </ol>
                        </div>
                        <div onClick={() => { toggleInstructions() }} className='close button-simple opacity-hover'><span>+</span></div>
                    </div>
                </div>
            </div>

            <div className={`button-container${hideInstructions ? '' : ' hidden'}`}>
                <button className='toggle-instructions lozenge grey' onClick={() => { toggleInstructions() }}>
                    <span>Instructions</span>
                </button>
                <button className='shuffle lozenge white grey-hover' onClick={() => { shuffle() }}>
                    <span>Shuffle</span>
                </button>
                <button className='lozenge white pink' onClick={() => { drawWildCard() }}>
                    <span>Wild Card</span>
                </button>
            </div>

            <div className={`small-screen-message${smallScreen ? '' : ' hidden'}`}>
                <div className='flex flex-center'>
                    <div>
                        <h2>This site works best on a larger screen</h2>
                    </div>
                </div>
            </div>

            <img src={logoURL} className='hidden logo-image' />
        </div>
    )
}

export default App
