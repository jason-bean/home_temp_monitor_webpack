'use strict'
import React from 'react'
import DateFormat from '../helpers/DateFormat.js'

let chart = null

export default class TempChart extends React.Component {
  renderChart () {
    if (chart == null) {
      chart = new CanvasJS.Chart('chart_div', {
        data: [
          {
            type: 'line',
            xValueType: 'dateTime',
            markerType: 'none',
            color: 'blue',
            lineThickness: this.props.lineThickness,
            dataPoints: this.props.tempData
          }
        ],
        axisY: {
          title: 'Temperature (°F)',
          titleFontSize: 18,
          titleFontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          labelFontSize: 12,
          includeZero: false
        },
        axisX: {
          labelAngle: -45,
          labelFontSize: 12,
          labelFontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          valueFormatString: 'M/D/YYYY h:mm TT'
        },
        toolTip: {
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontStyle: 'normal',
          contentFormatter: e => {
            let recorded = new Date(e.entries[0].dataPoint.x)

            let dateString
            let currentDate = new Date()

            if (recorded.getMonth() === currentDate.getMonth() && recorded.getDate() === currentDate.getDate() && recorded.getFullYear() === currentDate.getFullYear()) {
              dateString = DateFormat.toTimeString(recorded)
            } else {
              dateString = DateFormat.toDateTimeString(recorded)
            }

            return 'Recorded: <strong>' + dateString + '</strong><br/>Temperature: <strong>' + parseFloat(e.entries[0].dataPoint.y.toFixed(2)) + ' °F</strong>'
          }
        }
      })
    } else {
      chart.options.data[0].dataPoints = this.props.tempData
    }

    chart.render()
  }

  componentDidMount () {
    this.renderChart()
  }

  componentDidUpdate () {
    this.renderChart()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (nextProps.lineThickness !== this.props.lineThickness || nextProps.tempData !== this.props.tempData)
  }

  render () {
    return (
      <div id='chartArea' className='center-block col-lg-12 col-md-12 col-sm-12 col-xs-12'>
        <span id='chartTitle'>Temperature Chart</span>
        <div id='chart_div'></div>
      </div>
    )
  }
}
