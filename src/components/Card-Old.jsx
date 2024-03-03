import { useState } from 'react'

function Card(props) {

  return (
    <>
      <div className='card'>
        <div className='front'>
            <div className='container'>
                <h2>{props.type}</h2>
                <h3>{props.data.name}</h3>
            </div>    
        </div>
        <div className='back'>
        <div className='container'>
        <h2>{props.type}</h2>
                <h2>{props.data.name}</h2>
                <div className='fact'>
                    <p>{props.data.fact}</p>
                </div>
                <div className='example'>
                    <h3>Example:</h3>
                    <p>{props.data.example}</p>
                </div>
            </div>    
        </div>
      </div>
    </>
  )
}

export default Card
