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
                    cards: [],
                },
                disorders:
                {
                    title: 'Disorders',
                    name: 'disorder',
                    cards: [],
                },
                resources:
                {
                    title: 'Resources',
                    name: 'resource',
                    cards: [],
                }
            },
            decks: [],
            expansions:
            [
                {
                    title: 'Core',
                    name: 'core',
                },
                {
                    title: 'Gorm',
                    name: 'gorm',
                    decks_needed:
                    [
                       {
                           title: 'Gorm Resources',
                           name: 'gorm_resources',
                           type: 'resources'
                       }
                    ]
                }
            ]

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
        const filter = this.state.card_filter.toLowerCase().trim();
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

    buildDecks = () =>
    {
        //1 disorder deck
        //1 fa deck
        //1 sfa deck
        //variable amount of resource decks

        let expansions = this.state.expansions;
        let decks = [];

        //1. build disorder deck
        console.log(this.filterCardsByExpansion(this.state.card_types.disorders.cards, this.state.expansions));
        decks.push({
            title: 'Disorders',
            type: 'disorder',
            cards: this.filterCardsByExpansion(this.state.card_types.disorders.cards, this.state.expansions)
        });

        //2. build fa deck
        decks.push({
            title: 'Fighting Arts',
            type: 'fighting_arts',
            cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types.fighting_arts.cards, this.state.expansions), 'fighting_art')
        });

        //3. build sfa deck
        decks.push({
            title: 'Secret Fighting Arts',
            type: 'secret_fighting_arts',
            cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types.fighting_arts.cards, this.state.expansions), 'secret_fighting_art')
        });

        //4. build resource decks
        //4.1. main resources
        decks.push({
            title: 'Basic Resources',
            type: 'basic_resources',
            cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types.resources.cards, this.state.expansions), 'basic_resources')
        });

        //4.2. monster resources
        for(let x = 0; x < expansions.length; x++)
        {
            if(!expansions[x].decks_needed)
                continue;
            for(let y = 0; y < expansions[x].decks_needed.length; y++)
            {
                decks.push({
                    title: expansions[x].decks_needed[y].title,
                    type: expansions[x].decks_needed[y].type,
                    cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types[expansions[x].decks_needed[y].type].cards, this.state.expansions), expansions[x].decks_needed[y].name)
                });
            }
        }

        //TODO: varying amounts for resource decks

        this.setState({decks: decks});
    };

    filterCardsByExpansion(cards, expansions)
    {
        const hasCore = expansions.filter((expansion) => expansion.name === 'core').length;
        if(hasCore)
            return cards.filter((card) => !card.expansion || expansions.filter((expansion) => expansion.name === card.expansion).length);
        else
            return cards.filter((card) => expansions.filter((expansion) => expansion.name === card.expansion).length);

    }

    filterCardsBySubType(cards, type)
    {
        return cards.filter((card) => card.sub_type && type === card.sub_type);
    }

    render()
    {

        let cardList = [];
        for(let x = 0; x < this.state.decks.length; x++)
        {
            const deck = this.state.decks[x];
            if(!deck.cards || !deck.cards.length)
                continue;

            const filteredCards = this.cardFilter(deck.cards);

            if(!filteredCards.length)
                continue;

            cardList.push((
                <div key={deck.type} className="card-list">
                    <h3 className="list-title">
                        {deck.title}
                    </h3>
                    <hr className="list-break"/>
                    {
                        filteredCards
                            .map((card, index) => <Card key={index} card={card} />)
                    }
                </div>
            ));
        }

        if(!cardList.length)
            cardList = 'No cards found';

        return (
            <div className="app">
                <header className="app-header">
                    <h1 className="page-title">
                        Kingdom Death Cards
                    </h1>
                    <input className="card-filter-input" type="search" onChange={this.handleChange} value={this.state.card_filter}/>
                    Gorm: <input type="checkbox" onClick={this.buildDecks}/>
                </header>
                <main className="app-body">
                    <div className="card-holder">
                        {cardList}
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
