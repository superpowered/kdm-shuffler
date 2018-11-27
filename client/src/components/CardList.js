import {Component} from "react";
import Card from "./Card";
import React from "react";

export default class CardList extends Component
{
    render()
    {
        return (
            <div className="card-list">
                <div  className="card-list-wrapper">
                    <h3 className="card-list-title">
                        {this.props.list_title}
                    </h3>
                    <hr className="card-list-break"/>
                    <div  className="card-list-card-wrapper">
                        { this.props.cards.map((card, index) => <Card key={index} card={card} />) }
                    </div>
                </div>
            </div>
        );
    }
}