import {Component} from "react";
import React from "react";
import CardList from "./CardList";

export default class CardListHolder extends Component
{
    cardFilter = (cards) =>
    {
        const nameFilter = this.props.name_filter.toLowerCase().trim();
        const expansionFilters = this.props.expansion_filters;
        const cardTypeFilters = this.props.card_type_filters;

        return cards.filter((card) =>
        {
            return this.nameFilter(card, nameFilter)
                && this.expansionFilter(card, expansionFilters)
                && this.cardTypeFilter(card, cardTypeFilters);
        });
    };

    nameFilter = (card, filter) =>
    {
        const propertiesToCheck = ['name', 'selector_text', 'sub_type_pretty', 'type_pretty', 'desc', 'flavor_text', 'expansion', 'keywords'];

        //name filter
        for(let x = 0; x < propertiesToCheck.length; x++)
        {
            const property = propertiesToCheck[x];
            if(card[property] && Array.isArray(card[property]))
            {
                for(let y = 0; y < card[property].length; y++)
                {
                    if(card[property][y].toLowerCase().indexOf(filter) !== -1)
                        return true;
                }
            }
            else if(card[property] && card[property].toLowerCase().indexOf(filter) !== -1)
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

    render()
    {
        let cardList = this.props.decks
            .filter(deck => this.cardFilter(deck.cards).length)
            .map((deck, index) =>
            {
                return (
                    <CardList
                        key={index}
                        list_title={deck.title}
                        //todo: shouldn't have to call cardFilter twice
                        cards={this.cardFilter(deck.cards)}
                    />
                );
            });

        if(!cardList.length)
            cardList = (<div className="no-cards-found">-No cards found-</div>);

        return (
            <div>
                {cardList}
            </div>
        );
    }
}