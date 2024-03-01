import { useEffect, useState } from 'react'
import './App.scss'
import {data} from './data.js'
import Card from './components/Card.jsx'

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
    return data[type][ Math.round( Math.random() * data[type].length ) ]    
  }

  const updateCards = () => {    
    setCardData({
      Technology: {...updateCard("Technology")}, 
      Behaviour: {...updateCard("Behaviour")}, 
      Outcome: {...updateCard("Outcome")}
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
      <Card type="Technology" data={cardData.Technology} />
      <Card type="Behaviour" data={cardData.Behaviour} />
      <Card type="Outcome" data={cardData.Outcome} />
    </>
  )
}

export default App
