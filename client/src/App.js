import React, {Component} from 'react';

//Services
import APIService from './services/APIService';

//Components
import CardListHolder from './components/CardListHolder';
import ToggleHolder from './components/ToggleHolder';

//Styles
import './App.css';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            name_filter: '',
            expansion_filters: ['core'], //TODO: save filters to cookie
            card_type_filters: ['disorders','fighting_art','secret_fighting_art','basic_resources','strange_resources','monster_resources','vermin'],
            sort: 'card-type',
            cards: [],
            decks: [],
            expansions: [],
            card_types:
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
        };
    }

    componentDidMount()
    {
        const ignoreCache = false;
        const cardTypes = this.state.card_types;
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

    //functions for filtering down cards

    getCardsByExpansion(cards, expansions)
    {
        const hasCore = expansions.filter((expansion) => expansion.name === 'core').length;
        if(hasCore)
            return cards.filter((card) => !card.expansion || expansions.filter((expansion) => expansion.name === card.expansion).length);
        else
            return cards.filter((card) => expansions.filter((expansion) => expansion.name === card.expansion).length);
    }

    getCardsByType(cards, type)
    {
        return cards.filter((card) => card.type && type === card.type);
    }

    getCardsBySubType(cards, subType)
    {
        return cards.filter((card) => card.sub_type && subType === card.sub_type);
    }

    //Builds all the needed decks

    buildDecks = (cards, expansions) =>
    {
        let decks = [];

        cards = this.getCardsByExpansion(cards, expansions);

        //1. Deck Types
        const cardTypes = this.state.card_types;
        for(let x = 0; x < cardTypes.length; x++)
        {
            const cardType = cardTypes[x];
            const cardTypeCards = this.getCardsByType(cards, cardType.name);

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
                        cards: this.getCardsBySubType(cardTypeCards, cardSubType.sub_type_name)
                    });
                }
            }
        }

        //2. Expansion extra Decks
        for(let x = 0; x < expansions.length; x++)
        {
            if(!expansions[x].decks_needed)
                continue;

            //*most* expansions should have a resource deck associated with them
            for(let y = 0; y < expansions[x].decks_needed.length; y++)
            {
                decks.push({
                    title: expansions[x].decks_needed[y].title,
                    type: expansions[x].decks_needed[y].type,
                    name: expansions[x].decks_needed[y].name,
                    cards: this.getCardsBySubType(this.getCardsByType(cards, expansions[x].decks_needed[y].type), expansions[x].decks_needed[y].name)
                });
            }
        }

        //TODO: organization/feature: disorder, basic resource, etc.. decks should be listed in "decks_needed" for core,
        //TODO: also include disorders & fighting arts for expansions in "decks_needed"
        //TODO: then combine various decks with the same keys

        //TODO: feature: varying card amounts for resource decks
        return decks;
    };

    //Event Handlers

    handleNameFilterChange = (e) =>
    {
        this.setState({name_filter: e.target.value});
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

        this.setState({ expansion_filters: expansionFilters });
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

        this.setState({ card_type_filters: cardTypeFilters });
    };

    handleSortChange = (event) =>
    {
        const value = event.target.value;
        this.setState({ sort: value });
    };

    render()
    {

        return (
            <div className="app">

                <header className="app-header">

                    <h1 className="page-title">
                        Kingdom Death Cards
                    </h1>

                    <input
                        className="card-filter-input"
                        type="search"
                        onChange={this.handleNameFilterChange}
                        value={this.state.name_filter}
                        placeholder="Search..."
                    />

                    <ToggleHolder
                        title="Expansions"
                        type={this.state.expansions}
                        type_filters={this.state.expansion_filters}
                        type_change_handler={this.handleExpansionFilterChange}
                    />

                    <hr />

                    <ToggleHolder
                        title="Card Types"
                        type={this.state.card_types}
                        type_filters={this.state.card_type_filters}
                        type_change_handler={this.handleCardTypeFilterChange}
                    />

                    <hr />

                    <div className="sort-holder">
                        <h3>Sort By:</h3>
                        <br />
                        <select className="sorter" value={this.state.sort} onChange={this.handleSortChange}>
                            <option value='a-z'>A-Z</option>
                            <option value='z-a'>Z-A</option>
                            <option value='card-type'>By Type</option>
                        </select>
                    </div>

                </header>

                <main className="app-body">
                    <CardListHolder
                        decks={this.state.decks}
                        name_filter={this.state.name_filter}
                        expansion_filters={this.state.expansion_filters}
                        card_type_filters={this.state.card_type_filters}
                        sort={this.state.sort}
                    />
                </main>

            </div>
        );
    }
}

export default App;
