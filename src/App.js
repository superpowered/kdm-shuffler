import React, {Component} from 'react';

//Services
import APIService from './services/APIService';

import './App.css';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {cards: null};
    }

    componentDidMount()
    {
        let cards = {};

        let cardsFightingArts = new Promise((resolve, reject) =>
        {
            APIService.getCards('fighting_art')
                .then( fightingArts =>
                {
                    cards.fighting_arts = fightingArts;
                    resolve();
                })
                .catch((err) => reject(err));
        });
        let cardsDisorders = new Promise((resolve, reject) =>
        {
            APIService.getCards('disorder')
                .then( disorders =>
                {
                    cards.disorders = disorders;
                    resolve();
                })
                .catch((err) => reject(err));
        });
        let cardsResources = new Promise((resolve, reject) =>
        {
            APIService.getCards('resource')
                .then( resources =>
                {
                    cards.resources = resources;
                    resolve();
                })
                .catch((err) => reject(err));
        });
        let promises = [cardsFightingArts, cardsDisorders, cardsResources];

        Promise.all(promises)
            .then(() => this.setState({cards: cards}));


    }

    //Under list?
    filterCards(filter)
    {
        //filter down current set of cards by ones that match filter
    }


    //under Deck class
    createDeck(cards)
    {
        //1. Create a deck from list of cards

        //2. Shuffle deck

        //3. return deck
    }

    shuffleDeck(deck)
    {
        //1. Shuffle list of cards

        //2. Return deck
    }

    //deck.removeCard()
    //deck.addCard()

    render()
    {
        return (
            <div className="app">
                <header className="app-header">
                    {
                        //TODO: make these lists components
                    }
                    <h1>
                        Fighting Arts:
                    </h1>
                    {
                        this.state.cards &&
                        this.state.cards.fighting_arts &&
                        this.state.cards.fighting_arts.map((card, index) => <div key={index}>{card.name}</div>)
                    }
                    <h1>
                        Disorders:
                    </h1>
                    {
                        this.state.cards &&
                        this.state.cards.disorders &&
                        this.state.cards.disorders.map((card, index) => <div key={index}>{card.name}</div>)
                    }
                    <h1>
                        Fighting Arts:
                    </h1>
                    {
                        this.state.cards &&
                        this.state.cards.resources &&
                        this.state.cards.resources.map((card, index) => <div key={index}>{card.name}</div>)
                    }
                </header>
            </div>
        );
    }
}

export default App;
