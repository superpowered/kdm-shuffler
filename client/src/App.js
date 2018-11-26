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

        //Get all cards on app init
        const cardTypes = this.card_types;
        let expansions = [
        {
            //TODO: organization: move core into server response
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

        let cards = [];
        for(let x = 0; x < cardTypes.length; x++)
        {
            const cardType = cardTypes[x];
            let promise = new Promise((resolve, reject) =>
            {
                APIService.getCards(cardType.name_singular, ignoreCache)
                    .then( response =>
                    {
                        //TODO: feature: Have server insert card copies
                        cards.push.apply(cards, response);
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
            promises.push(promise);
        }

        let promise = new Promise((resolve, reject) =>
        {
            APIService.getExpansions(ignoreCache)
                .then( responseExpansions =>
                {
                    //TODO: organization: move all this formatting to server
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
                const decks = this.buildDecks(cards, expansions);
                this.setState(
                {
                    cards: cards,
                    //card_types: cardTypes,
                    expansions: expansions,
                    decks: decks
                });
            });
    }

    handleChange = (e) =>
    {
        this.setState({
            card_filter: e.target.value
        });
    };

    nameFilter = (card, filter) =>
    {
        const propertiesToCheck = ['name', 'selector_text', 'sub_type_pretty', 'type_pretty', 'desc', 'flavor_text'];

        //name filter
        for(let x = 0; x < propertiesToCheck.length; x++)
        {
            const property = propertiesToCheck[x];
            if(card[property] && card[property].toLowerCase().indexOf(filter) !== -1)
                return true;
        }

        return false;
    };

    expansionFilter = (card, expansions) =>
    {
        const hasCore = expansions.includes('core');

        //toggle filters
        for(let x = 0; x < expansions.length; x++)
        {
            const expansion = expansions[x];
            if((hasCore && !card.expansion) || card.expansion === expansion)
                return true;
        }

        return false;
    };

    cardTypeFilter = (card, cardTypes) =>
    {
        //toggle filters
        for(let x = 0; x < cardTypes.length; x++)
        {
            const cardType = cardTypes[x];

            //monster resources aren't really defined in API
            if(
                cardType === 'monster_resources'
                && card.type === 'resources'
                && !['vermin','basic_resources','strange_resources'].includes(card.sub_type)
            )
            {
                return true;
            }

            if(card.sub_type === cardType || card.type === cardType)
                return true;
        }

        return false;
    };

    cardFilter = (cards) =>
    {
        const nameFilter = this.state.card_filter.toLowerCase().trim();
        const expansionFilters = this.state.expansion_filters;
        const cardTypeFilters = this.state.card_type_filters;

        return cards.filter((card) =>
        {
            return this.nameFilter(card, nameFilter)
                && this.expansionFilter(card, expansionFilters)
                && this.cardTypeFilter(card, cardTypeFilters);
        });
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

    buildDecksByType(cards, type)
    {

    }

    buildDecks = (cards, expansions) =>
    {
        let decks = [];

        cards = this.filterCardsByExpansion(cards, expansions);

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

        //6. Monster Resource Decks
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

    render()
    {

        //TODO: organization: make deck component
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
            cardList = (<div className="no-cards-found">-No cards found-</div>);

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
                    <input className="card-filter-input" type="search" onChange={this.handleChange} value={this.state.card_filter} placeholder="Search..."/>
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
                        {cardList}
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
