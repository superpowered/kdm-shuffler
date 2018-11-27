import {Component} from "react";
import Card from "./Card";
import React from "react";

export default class CardList extends Component
{
    render()
    {
        if(!this.props.cards.length)
            return;

        return (
            <div className="card-list">
                <div  className="card-list-wrapper">
                    {
                        this.props.list_title &&
                            <h3 className="card-list-title">
                                {this.props.list_title}
                            </h3>
                    }
                    {
                        this.props.list_title &&
                            <hr className="card-list-break"/>
                    }
                    <div  className="card-list-card-wrapper">
                        { this.props.cards.map((card, index) => <Card key={index} card={card} />) }
                    </div>
                </div>
            </div>
        );
    }
}