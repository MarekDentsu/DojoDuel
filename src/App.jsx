import { useEffect, useState } from 'react'
import './App.scss'
import { data } from './data.js'
import DojoDuel from './components/DojoDuel.jsx'
import logoImageURL from './assets/dojo-vertical.svg'
import logoURL from "./assets/dojo-vertical-black.svg"


function App() {
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

  useEffect(
    () => {
      setTimeout(() => {
        updateCards()
      }, 400);
    }, []
  )

  const [isShuffling, setIsShuffling] = useState(false)
  const [wildCardShowing, setWildCardShowing] = useState(false)
  const shuffle = () => {
    console.log("shuffle")
    if(!isShuffling){
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
    // if(!wildCardShowing){
    //   setWildCardShowing(true)
    // } 
  }

  return (
    <>
      <DojoDuel cardData={cardData} isShuffling={isShuffling} wildCardShowing={wildCardShowing} />

      <img className='logo' src={logoImageURL} />
      <div className='button-container'>
      <button className='lozenge white grey-hover' onClick={() => {shuffle()}}>
          <span>Shuffle</span>
        </button>
        <button className='lozenge white grey-hover' onClick={() => {drawWildCard()}}>
          <span>Wild Card</span>
        </button>
      </div>

      <div className='header'>
        <div className='flex-row'>
          {/* <h1>Dojo Duel</h1>
          <p>A card game <br />like never before.</p> */}
        </div>
      </div>
      <img src={logoURL} className='hidden logo-image' />
    </>
  )
}

export default App
