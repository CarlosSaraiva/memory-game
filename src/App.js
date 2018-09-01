import React, { Component } from 'react'
import logo from './assets/marvel-logo.png';
import './App.css';
import { get } from './services'

class App extends Component {
  state = {
    title: "Memory game",
    cards: []
  }

  componentDidMount() {
    get()
      .then((response) => {
        const game = response.data.data
        const filteredGame = game.results.filter(
          function filter(character) {
            return !character.thumbnail.path.endsWith('image_not_available')
          }
        )
          this.setState({ cards: filteredGame })
      })
  }


  render() {
    return (
      <div id="app">
        <div className="app">
          <img src={ logo } className="logo" />
          <h1>{ this.state.title }</h1>
          <ul className="list">
          {this.state.cards.map((card, index) => (
            <li>
              <img 
                className="img-cards" 
                src={`${card.thumbnail.path}.${card.thumbnail.extension}`}
                alt={card.name}
              />
            </li>
          ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default App;
