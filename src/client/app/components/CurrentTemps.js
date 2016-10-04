import React from 'react';

export default class CurrentTemps extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.currentTemps !== this.props.currentTemps;
    }

    render() {
        var currentTemps = this.props.currentTemps;
        return (
            <p className="currentTemps col-sm-12 col-md-12">
                <span className="hidden-xs"><strong>Current Temperature:</strong></span>
                <span className="hidden-sm hidden-md hidden-lg"><strong>Current Temp:</strong></span>
                &nbsp;{currentTemps.inside.toFixed(2)} °F
            </p>
        );
    }
}