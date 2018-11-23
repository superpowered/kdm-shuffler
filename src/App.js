import React, {Component} from 'react';

//Services
import APIService from './services/APIService';

import './App.css';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            cards:
            {
                fighting_arts:
                {
                    title: 'Fighting Arts',
                    name: 'fighting_art',
                    cards: []
                },
                disorders:
                {
                    title: 'Disorders',
                    name: 'disorder',
                    cards: []
                },
                resources:
                {
                    title: 'Resources',
                    name: 'resource',
                    cards: []
                }
            }
        };
    }

    componentDidMount()
    {
        //Get all cards on app init
        let cards = {...this.state.cards};
        let promises = [];

        for(let cardType in cards)
        {
            const theseCards = this.state.cards[cardType];
            let promise = new Promise((resolve, reject) =>
            {
                APIService.getCards(theseCards.name)
                    .then( ResponseCards =>
                    {
                        cards[cardType].cards = ResponseCards;
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
            promises.push(promise);
        }

        Promise.all(promises)
            .then(() => {this.setState({cards: cards}); console.log(cards); });
    }

    //Under list component
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
        let cardList = [];
        for(let cardType in this.state.cards)
        {
            if(this.state.cards.hasOwnProperty(cardType))
            {
                cardList.push((
                    <div key={cardType} className="card-list">
                        <h3>
                            {this.state.cards[cardType].title}
                        </h3>
                        {this.state.cards[cardType].cards.map((card, index) => <div key={index}>{card.name}</div>)}
                    </div>
                ));
            }
        }

        return (
            <div className="app">
                <header className="app-header">
                    <h1>
                        Kingdom Death Cards
                    </h1>
                </header>
                <main className="app-body">
                    {cardList}
                </main>
            </div>
        );
    }
}

export default App;
