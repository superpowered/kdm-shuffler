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
            active_expansions: [],
            expansions: []

        };
    }

    componentDidMount()
    {
        //Get all cards on app init
        let cardTypes = {...this.state.card_types};
        let expansions = [
        {
            title: 'Core',
            name: 'core',
            decks_needed:
            [
                {
                    title: 'White Lion Resources',
                    name: 'white_lion_resources',
                    type: 'resources'
                },
                {
                    title: 'Screaming Antelope Resources',
                    name: 'screaming_antelope_resources',
                    type: 'resources'
                },
                {
                    title: 'Phoenix Resources',
                    name: 'phoenix_resources',
                    type: 'resources'
                }
            ]
        }];
        let promises = [];
        const activeExpansions = expansions.map(a => ({...a}));

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

        let promise = new Promise((resolve, reject) =>
        {
            APIService.getExpansions(true)
                .then( responseExpansions =>
                {
                    for(let x = 0; x < responseExpansions.length; x++)
                    {
                        const expansion = responseExpansions[x];
                        expansions.push(
                        {
                            title: expansion.name,
                            name: expansion.handle,
                            decks_needed:
                            [
                                {
                                    title: expansion.name + ' Resources',
                                    name: expansion.handle + '_resources',
                                    type: 'resources'
                                }
                            ]
                        });
                    }
                    resolve();
                })
                .catch((err) => reject(err));
        });
        promises.push(promise);

        Promise.all(promises)
            .then(() =>
            {
                this.setState(
                {
                    card_types: cardTypes,
                    expansions: expansions,
                    active_expansions: activeExpansions,
                }, () =>
                {
                    //TODO: this feels very incorrect
                    const decks = this.buildDecks(activeExpansions);
                    this.setState(
                    {
                        decks: decks
                    });
                });
            });
    }

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

    handleExpansionChange = (event) =>
    {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name; //gorm

        const activeExpansions = this.state.active_expansions.map(a => ({...a}));
        const inExpansions = activeExpansions.find(expansion => expansion.name === name);

        if(value && !inExpansions)
            activeExpansions.push(this.state.expansions.find(expansion => expansion.name === name));
        else if(!value && inExpansions)
            activeExpansions.splice(activeExpansions.indexOf(inExpansions), 1);

        const decks = this.buildDecks(activeExpansions);

        this.setState(
        {
            active_expansions: activeExpansions,
            decks: decks
        });
    };

    buildDecks = (expansions) =>
    {
        let decks = [];

        //1. build disorder deck
        decks.push({
            title: 'Disorders',
            type: 'disorders',
            name: 'disorders',
            cards: this.filterCardsByExpansion(this.state.card_types.disorders.cards, expansions)
        });

        //2. build fa deck
        decks.push({
            title: 'Fighting Arts',
            type: 'fighting_arts',
            name: 'fighting_arts',
            cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types.fighting_arts.cards, expansions), 'fighting_art')
        });

        //3. build sfa deck
        decks.push({
            title: 'Secret Fighting Arts',
            type: 'secret_fighting_arts',
            name: 'secret_fighting_arts',
            cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types.fighting_arts.cards, expansions), 'secret_fighting_art')
        });

        //4. build resource deck
        decks.push({
            title: 'Basic Resources',
            type: 'basic_resources',
            name: 'basic_resources',
            cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types.resources.cards, expansions), 'basic_resources')
        });

        //5. Expansion extra decks
        for(let x = 0; x < expansions.length; x++)
        {
            if(!expansions[x].decks_needed)
                continue;
            for(let y = 0; y < expansions[x].decks_needed.length; y++)
            {
                decks.push({
                    title: expansions[x].decks_needed[y].title,
                    type: expansions[x].decks_needed[y].type,
                    name: expansions[x].decks_needed[y].name,
                    cards: this.filterCardsBySubType(this.filterCardsByExpansion(this.state.card_types[expansions[x].decks_needed[y].type].cards, this.state.expansions), expansions[x].decks_needed[y].name)
                });
            }
        }

        //TODO: varying amounts for resource decks

        console.log(expansions, decks);
        return decks;
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
                <div key={deck.name} className="card-list">
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

        let expansionToggles = [];
        const expansions = this.state.expansions;
        for(let x = 0; x < expansions.length; x++)
        {
            expansionToggles.push((
                <div className="expansion-toggle" key={x}>
                    <label>{expansions[x].title}</label>
                    <input type="checkbox"
                           onChange={this.handleExpansionChange}
                           name={expansions[x].name}
                           checked={this.state.active_expansions.find(expansion => expansion.name === expansions[x].name) ? 'checked' : ''}
                    />
                </div>
            ));
        }

        return (
            <div className="app">
                <header className="app-header">
                    <h1 className="page-title">
                        Kingdom Death Cards
                    </h1>
                    <input className="card-filter-input" type="search" onChange={this.handleChange} value={this.state.card_filter}/>
                    {expansionToggles}
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
