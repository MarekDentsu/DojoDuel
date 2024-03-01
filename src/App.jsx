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
      example: ""
    },
    Outcome: {
      name: "",
      fact: "",
      example: ""
    }
  })

  const updateCard = (type) => {
    return data[type][Math.round(Math.random() * data[type].length)]
  }

  const updateCards = () => {
    setCardData({
      Technology: { ...updateCard("Technology") },
      Behaviour: { ...updateCard("Behaviour") },
      Outcome: { ...updateCard("Outcome") }
    })
  }

  useEffect(
    () => {
      updateCards()
      console.log(cardData);
    }, []
  )

  return (
    <>
      {/* <Card type="Technology" data={cardData.Technology} />
      <Card type="Behaviour" data={cardData.Behaviour} />
      <Card type="Outcome" data={cardData.Outcome} /> */}
      <SlimShady />
      <img className='logo' src={logoImageURL} />
      <div className='button-container'>
        {/* <button className='lozenge white grey-hover'>
          <span>Shuffle</span>
        </button> */}
      </div>

      <div className='header'>
        <div className='flex-row'>
          <h1>Dojo Duel</h1>
          <h3>A card game <br />like never before.</h3>
        </div>
      </div>
    </>
  )
}

export default App
