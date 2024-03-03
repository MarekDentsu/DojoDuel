import { useEffect, useState } from 'react'
import './App.scss'
import { data } from './data.js'
// import Card from './components/Card.jsx'
import SlimShady from './components/SlimShady.jsx'
import logoImageURL from './assets/dojo-vertical.svg'

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
      example: ""
    }
  })

  const updateCard = (type) => {
    return data[type][Math.floor(Math.random() * data[type].length)]
  }

  const updateCards = () => {
    setCardData({
      Technology: { ...updateCard("Technology") },
      Behaviour: { ...updateCard("Behaviour") },
      Outcome: { ...updateCard("Outcome") }
    })
    console.log(cardData);
  }

  useEffect(
    () => {
      updateCards()
    }, []
  )

  const [isShuffling, setIsShuffling] = useState(false)
  const shuffle = () => {
    console.log("shuffle")
    if(!isShuffling){
      setIsShuffling(true)
      setTimeout(() => {
        updateCards()
      }, 500);
      setTimeout(() => {
        setIsShuffling(false)
      }, 1200);
    }
  }

  return (
    <>
      {/* <Card type="Technology" data={cardData.Technology} />
      <Card type="Behaviour" data={cardData.Behaviour} />
      <Card type="Outcome" data={cardData.Outcome} /> */}
      <SlimShady cardData={cardData} isShuffling={isShuffling} />

      <img className='logo' src={logoImageURL} />
      <div className='button-container'>
        <button className='lozenge white grey-hover' onClick={() => {shuffle()}}>
          <span>Shuffle</span>
        </button>
      </div>

      <div className='header'>
        <div className='flex-row'>
          <h1>Dojo Duel</h1>
          <p>A card game <br />like never before.</p>
        </div>
      </div>
    </>
  )
}

export default App
