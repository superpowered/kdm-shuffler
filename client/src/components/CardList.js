import {Component} from "react";
import Card from "./Card";
import React from "react";

export default class CardList extends Component
{
    render()
    {
        return (
            <div className="card-list">
                <h3 className="list-title">
                    {this.props.list_title}
                </h3>
                <hr className="list-break"/>
                { this.props.cards.map((card, index) => <Card key={index} card={card} />) }
            </div>
        );
    }
}