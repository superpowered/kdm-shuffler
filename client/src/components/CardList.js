import {Component} from "react";
import Card from "./Card";
import React from "react";

export default class CardList extends Component
{
    render()
    {
        const cards = this.props.cards;
        if(!cards || !cards.length)
            return '';

        return (
            <div className="card-list">
                <h3 className="list-title">
                    {this.props.list_title}
                </h3>
                <hr className="list-break"/>
                { cards.map((card, index) => <Card key={index} card={card} />) }
            </div>
        );
    }
}