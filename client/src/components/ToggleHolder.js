import React, {Component} from "react";
import Toggle from './Toggle';

export default class ToggleHolder extends Component
{
    render()
    {
        let Toggles = this.props.type.map((type) =>
        {
            if(!type.sub_types || !type.sub_types.length)
            {
                return (
                    <Toggle
                        key={type.handle}
                        title={type.title}
                        name={type.handle}
                        onChange={this.props.type_change_handler}
                        checked={this.props.type_filters.includes(type.handle) ? 'checked' : ''}
                    />
                );
            }
            else //If we have sub types, loop through and push those
            {
                return type.sub_types.map((subType) =>
                {
                    return (
                        <Toggle
                            key={subType.handle}
                            title={subType.title}
                            name={subType.sub_type_name}
                            onChange={this.props.type_change_handler}
                            checked={this.props.type_filters.includes(subType.sub_type_name) ? 'checked' : ''}
                        />
                    );
                });
            }
        });

        return (
            <section className="toggle-holder">
                <h3 className="toggle-holder-title">{this.props.title}:</h3>
                {Toggles}
            </section>
        );

    }
}