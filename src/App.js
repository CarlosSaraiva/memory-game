import React, { Component } from 'react'
import logo from './assets/marvel-logo.png'
import './App.css'
import { get } from './services'

const Card = ({ front, back, onPress, flipped, disabled }) => (
  <div className={`flip-container ${flipped}`} onMouseDown={!disabled && onPress}>
    <div className="flipper">
      <div className="front">
      {front()}
      </div>
      <div className="back">
      {back()}
      </div>
    </div>
  </div>
)

class App extends Component {
  state = {
    title: "Memory game",
    cards: [],
    counter: 0
  }

  filterNotAvailableImage = character => !character.thumbnail.path.endsWith('image_not_available')

  frontImage = (src, alt) => () => (
    <img 
      className="img-cards" 
      src={src}
      alt={alt}
    />
  )

  backImage = () => (
    <div
      className="img-cards" 
      style={{ backgroundColor: 'black' }}

    />
  )

  flipit = card => e => {
    const counter = this.state.counter === 1 ? 0 : this.state.counter + 1

    this.setState({
      counter, 
      cards: this.state.cards.map(this.swap(card)),
      disabled: this.state.counter === 1
    })

    if(this.state.counter === 1) setTimeout(() => {
      this.setState({ cards: this.state.cards.map(this.reset), disabled: false })
    }, 800)
    
  } 

  swap = card => item => item.name === card.name 
    ? ({...item, flipped: item.flipped === 'flipped' ? 'none' : 'flipped' })
    : ({...item})

  reset = card => ({ ...card, flipped: 'flipped' })

  async componentDidMount() {
    const { data } = await get()
    
    const filteredGame = data.results
                             .filter(this.filterNotAvailableImage)
                             .map(card => ({ ...card, flipped: 'flipped' }))

    this.setState({ cards: filteredGame })
  }

  render() {
    return (
      <div id="app">
        <div className="app">
          <img src={logo} className="logo" />
          <h1>{this.state.title}</h1>
          <ul className="list">
          {this.state.cards.map((card, index) => (
            <Card
              key={card.id}
              disabled={this.state.disabled}
              onPress={this.flipit(card)}
              flipped={card.flipped}
              front={this.frontImage(`${card.thumbnail.path}.${card.thumbnail.extension}`, card.name)}
              back={this.backImage}
            />
          ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default App
