import React, {Component} from 'react';
import sanitizeHtml from 'sanitize-html';

export default class Card extends Component
{
    render()
    {
        const card = this.props.card;
        const description = card.desc ? card.desc : card.survivor_effect;

        let clean_desc = sanitizeHtml(description,
        {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'td', 'tr', 'table','span', 'div','br','font'],
            allowedClasses: {'font': ['kdm_font','inline_shield','Dormenatus','zebra','roll','result','kd_pink_font','kd_blue_font']}
        });
        if(clean_desc === 'undefined')
            clean_desc = '';

        let subTypes = '';
        if( card.type === 'resources')
            subTypes = card.keywords.join(', ');
        else if(card.type === 'fighting_arts')
            subTypes = '-' + card.sub_type_pretty + '-';

        return (
            <div className={"card " + card.type + " " + card.sub_type}>
                <div className="wrapper">
                    <h4 className="title">
                        {card.name}
                    </h4>
                    <div className="sub-types">
                        {subTypes}
                    </div>
                    <div className="image">
                    </div>
                    <div className="flavor-text">
                        {card.flavor_text}
                    </div>
                    <div className="description" dangerouslySetInnerHTML={{__html:clean_desc }}>
                    </div>
                </div>
            </div>
        );
    }
}