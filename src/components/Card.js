import React, {Component} from 'react';
import sanitizeHtml from 'sanitize-html';

export default class Card extends Component
{
    render()
    {

        const clean = sanitizeHtml(this.props.card.desc,
        {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'td', 'tr', 'table','span', 'div'],
            allowedAttributes: {
                a: ['href', 'target', 'class']
            }
        });
        return (
            <div className='card'>
                <h4>
                    {this.props.card.name}
                </h4>
                <div className="card-description" dangerouslySetInnerHTML={{__html:clean }}>

                </div>
            </div>
        );
    }
}