import React from 'react';
import DateFormat from '../helpers/DateFormat.js';

export default class TempMinMaxAvg extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.minTemp !== this.props.minTemp || nextProps.maxTemp !== this.props.maxTemp || nextProps.avgTemp !== this.props.avgTemp);
    }

    render() {
        return (
            <div id="minMaxAvg" className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <table id="minTempTable" className="stats col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <caption>
                        <span className="hidden-xs">Minimum Temperature</span>
                        <span className="hidden-lg hidden-md hidden-sm">Min Temp</span>
                    </caption>
                    <tbody>
                        <tr>
                            <td>{DateFormat.toDateTimeString(new Date(+this.props.minTemp['x']))}</td>
                            <td>{this.props.minTemp['y'].toFixed(2)} °F</td>
                        </tr>
                    </tbody>
                </table>
                <table id="maxTempTable" className="stats col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <caption>
                        <span className="hidden-xs">Maximum Temperature</span>
                        <span className="hidden-lg hidden-md hidden-sm">Max Temp</span>
                    </caption>
                    <tbody>
                        <tr>
                            <td>{DateFormat.toDateTimeString(new Date(+this.props.maxTemp['x']))}</td>
                            <td>{this.props.maxTemp['y'].toFixed(2)} °F</td>
                        </tr>
                    </tbody>
                </table>
                <table id="avgTempTable" className="stats col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <caption>
                        <span className="hidden-xs">Average Temperature</span>
                        <span className="hidden-lg hidden-md hidden-sm">Avg Temp</span>
                    </caption>
                    <tbody>
                        <tr>
                            <td>{this.props.avgTemp.toFixed(2)} °F</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}