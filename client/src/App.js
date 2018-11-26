import React, {Component} from 'react';

//Services
import APIService from './services/APIService';

//Components
import FilterableCardLists from './components/FilterableCardLists';

import './App.css';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            name_filter: '',
            expansion_filters: ['core'],
            card_type_filters: ['disorders','fighting_art','secret_fighting_art','basic_resources','strange_resources','monster_resources','vermin'],
            cards: [],
            decks: [],
            expansions: []
        };

        this.card_types =
        [
            {
                title: 'Disorders',
                name_singular: 'disorder',
                name: 'disorders'
            },
            {
                title: 'Fighting Arts',
                name_singular: 'fighting_art',
                name: 'fighting_arts',
                sub_types:
                [
                    {
                        title: 'Fighting Arts',
                        name: 'fighting_arts',
                        sub_type_name: 'fighting_art',
                    },
                    {
                        title: 'Secret Fighting Arts',
                        name: 'secret_fighting_arts',
                        sub_type_name: 'secret_fighting_art',
                    }
                ]

            },
            {
                title: 'Resources',
                name_singular: 'resource',
                name: 'resources',
                sub_types:
                [
                    {
                        title: 'Basic Resources',
                        name: 'basic_resources',
                        sub_type_name: 'basic_resources',
                    },
                    {
                        title: 'Strange Resources',
                        name: 'strange_resources',
                        sub_type_name: 'strange_resources',
                    },
                    {
                        title: 'Vermin',
                        name: 'vermin',
                        sub_type_name: 'vermin',
                    },
                    {
                        title: 'Monster Resources',
                        name: 'monster_resources',
                        sub_type_name: 'monster_resources',
                    }
                ]
            }
        ]
    }

    componentDidMount()
    {
        const ignoreCache = false;
        const cardTypes = this.card_types;
        let expansions = [];
        let cards = [];
        let promises = [];

        //Get Cards
        for(let x = 0; x < cardTypes.length; x++)
        {
            const cardType = cardTypes[x];
            let promise = new Promise((resolve, reject) =>
            {
                APIService.getCards(cardType.name_singular, ignoreCache)
                    .then( response =>
                    {
                        cards.push.apply(cards, response);
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
            promises.push(promise);
        }

        //Get Expansions
        let promise = new Promise((resolve, reject) =>
        {
            APIService.getExpansions(ignoreCache)
                .then( responseExpansions =>
                {
                    expansions = responseExpansions;
                    resolve();
                })
                .catch((err) => reject(err));
        });
        promises.push(promise);

        //Build Decks and set state
        Promise.all(promises)
            .then(() =>
            {
                const decks = this.buildDecks(cards, expansions);
                this.setState(
                {
                    cards: cards,
                    expansions: expansions,
                    decks: decks
                });
            });
    }

    handleNameFilterChange = (e) =>
    {
        this.setState({
            name_filter: e.target.value
        });
    };

    filterCardsByExpansion(cards, expansions)
    {
        const hasCore = expansions.filter((expansion) => expansion.name === 'core').length;
        if(hasCore)
            return cards.filter((card) => !card.expansion || expansions.filter((expansion) => expansion.name === card.expansion).length);
        else
            return cards.filter((card) => expansions.filter((expansion) => expansion.name === card.expansion).length);
    }

    filterCardsByType(cards, type)
    {
        return cards.filter((card) => card.type && type === card.type);
    }

    filterCardsBySubType(cards, subType)
    {
        return cards.filter((card) => card.sub_type && subType === card.sub_type);
    }

    buildDecks = (cards, expansions) =>
    {
        let decks = [];

        cards = this.filterCardsByExpansion(cards, expansions);

        //1. Deck Types
        const cardTypes = this.card_types;
        for(let x = 0; x < cardTypes.length; x++)
        {
            const cardType = cardTypes[x];
            const cardTypeCards = this.filterCardsByType(cards, cardType.name);

            //If No sub types, just push this deck
            if(!cardType.sub_types || !cardType.sub_types.length)
            {
                decks.push({
                    title: cardType.title,
                    name: cardType.name,
                    cards: cardTypeCards
                });
            }
            else //If we have sub types, loop through and push those
            {
                for(let y = 0; y < cardType.sub_types.length; y++)
                {
                    const cardSubType = cardType.sub_types[y];
                    decks.push({
                        title: cardSubType.title,
                        name: cardSubType.name,
                        cards: this.filterCardsBySubType(cardTypeCards, cardSubType.sub_type_name)
                    });
                }
            }
        }

        //2. Monster Resource Decks
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
                    cards: this.filterCardsBySubType(this.filterCardsByType(cards, 'resources'), expansions[x].decks_needed[y].name)
                });
            }
        }

        //TODO: feature: varying card amounts for resource decks
        return decks;
    };

    handleExpansionFilterChange = (event) =>
    {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const expansionFilters = this.state.expansion_filters;

        //add / remove filter
        if(value && !expansionFilters.includes(name))
            expansionFilters.push(name);
        else if(!value && expansionFilters.includes(name))
            expansionFilters.splice(expansionFilters.indexOf(name), 1);

        this.setState(
            {
                expansion_filters: expansionFilters
            });
    };

    handleCardTypeFilterChange = (event) =>
    {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const cardTypeFilters = this.state.card_type_filters;

        //add / remove filter
        if(value && !cardTypeFilters.includes(name))
            cardTypeFilters.push(name);
        else if(!value && cardTypeFilters.includes(name))
            cardTypeFilters.splice(cardTypeFilters.indexOf(name), 1);

        this.setState(
            {
                card_type_filters: cardTypeFilters
            });
    };

    render()
    {

        //TODO: organization: component
        let expansionToggles = [];
        const expansions = this.state.expansions;
        for(let x = 0; x < expansions.length; x++)
        {
            expansionToggles.push((
                <div className="expansion-toggle" key={x}>
                    <label>{expansions[x].title}</label>
                    <input type="checkbox"
                           onChange={this.handleExpansionFilterChange}
                           name={expansions[x].name}
                           checked={this.state.expansion_filters.includes(expansions[x].name) ? 'checked' : ''}
                    />
                </div>
            ));
        }

        //TODO: make component
        let cardTypeToggles =[];
        const cardTypes = this.card_types;
        for(let x = 0; x < cardTypes.length; x++)
        {
            const cardType = cardTypes[x];
            //If No sub types, just push this toggle
            if(!cardType.sub_types || !cardType.sub_types.length)
            {
                cardTypeToggles.push((
                    <div className="card-type-toggle" key={cardType.name}>
                        <label>{cardType.title}</label>
                        <input type="checkbox"
                               onChange={this.handleCardTypeFilterChange}
                               name={cardType.name}
                               checked={this.state.card_type_filters.includes(cardType.name) ? 'checked' : ''}
                        />
                    </div>
                ));
            }
            else //If we have sub types, loop through and push those
            {
                for(let y = 0; y < cardType.sub_types.length; y++)
                {
                    const cardSubType = cardType.sub_types[y];
                    cardTypeToggles.push((
                        <div className="card-type-toggle" key={cardSubType.sub_type_name}>
                            <label>{cardSubType.title}</label>
                            <input type="checkbox"
                                   onChange={this.handleCardTypeFilterChange}
                                   name={cardSubType.sub_type_name}
                                   checked={this.state.card_type_filters.includes(cardSubType.sub_type_name) ? 'checked' : ''}
                            />
                        </div>
                    ));
                }
            }

        }

        return (
            <div className="app">
                <header className="app-header">
                    <h1 className="page-title">
                        Kingdom Death Cards
                    </h1>
                    <input className="card-filter-input" type="search" onChange={this.handleNameFilterChange} value={this.state.name_filter} placeholder="Search..."/>
                    <div><strong>Expansions:</strong></div>
                    {expansionToggles}
                    {
                        //TODO: feature: save expansions chosen in a cookie
                    }
                    <hr />
                    <div><strong>Card Types:</strong></div>
                    {
                        //TODO: feature: Toggle for sorting
                        cardTypeToggles
                    }
                </header>
                <main className="app-body">
                    <div className="card-holder">
                        <FilterableCardLists
                            decks={this.state.decks}
                            name_filter={this.state.name_filter}
                            expansion_filters={this.state.expansion_filters}
                            card_type_filters={this.state.card_type_filters}
                        />
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
