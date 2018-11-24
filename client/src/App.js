import React, {Component} from 'react';

//Services
import APIService from './services/APIService';

//Components
import Card from './components/Card';

import './App.css';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            card_filter: '',
            card_types:
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
            },

        };
    }

    componentDidMount()
    {
        //Get all cards on app init
        let cardTypes = {...this.state.card_types};
        let promises = [];

        for(let cardType in cardTypes)
        {
            const theseCards = cardTypes[cardType];
            let promise = new Promise((resolve, reject) =>
            {
                APIService.getCards(theseCards.name, true)
                    .then( ResponseCards =>
                    {
                        cardTypes[cardType].cards = ResponseCards;
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
            promises.push(promise);
        }

        Promise.all(promises)
            .then(() => {this.setState({card_types: cardTypes}); });
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

    filterResults = (filter) =>
    {

    };

    handleChange = (e) =>
    {
        this.setState({
            card_filter: e.target.value
        });

        this.filterResults(e.target.value);
    };

    cardFilter = (cards) =>
    {
        const filter = this.state.card_filter.toLowerCase();
        return cards.filter((card) =>
        {
            let show = false;

            const propertiesToCheck = ['name', 'selector_text', 'sub_type_pretty', 'type_pretty', 'desc', 'flavor_text']

            for(let x = 0; x < propertiesToCheck.length; x++)
            {
                const property = propertiesToCheck[x];
                if(card[property] && card[property].toLowerCase().indexOf(filter) !== -1)
                    show = true;
            }

            return show;
        });
    };

    render()
    {
        let cardList = [];
        for(let cardType in this.state.card_types)
        {
            if(this.state.card_types.hasOwnProperty(cardType))
            {
                if(!this.state.card_types[cardType].cards)
                    continue;

                const filteredCards = this.cardFilter(this.state.card_types[cardType].cards);

                if(!filteredCards.length)
                    continue;

                cardList.push((
                    <div key={cardType} className="card-list">
                        <h3>
                            {this.state.card_types[cardType].title}
                        </h3>
                        <hr />
                        {
                            filteredCards
                                .map((card, index) => <Card key={index} card={card} />)
                        }
                    </div>
                ));
            }
        }

        if(!cardList.length)
            cardList = 'No cards found';

        return (
            <div className="app">
                <header className="app-header">
                    <h1>
                        Kingdom Death Cards
                    </h1>
                    <input type="search" onChange={this.handleChange} value={this.state.card_filter}/>
                </header>
                <main className="app-body">
                    {cardList}
                </main>
            </div>
        );
    }
}

export default App;
