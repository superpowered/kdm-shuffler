import React, {Component} from "react";

export default class Toggle extends Component
{
    render()
    {
        return (
            <div className="toggle">
                <label className="toggle-label">
                    {this.props.title}
                </label>
                <input
                    className="toggle-input"
                    type="checkbox"
                    onChange={this.props.onChange}
                    name={this.props.name}
                    checked={this.props.checked}
                />
            </div>
        );
    }
}