'use strict'
import React from 'react'
import dateFormat from 'dateformat'

export default class TempLastHour extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.tempLastHour !== this.props.tempLastHour
  }

  render () {
    let tempNodes = this.props.tempLastHour.map((temp) => {
      return (
        <tr key={temp._id}>
          <td>{dateFormat(temp['x'], 'm/d/yyyy h:MM TT')}</td>
          <td>{temp['y'].toFixed(2)} °F</td>
        </tr>
        )
    })

    return (
      <div id='lastHour' className='col-lg-6 col-md-6 col-sm-6 col-xs-12'>
        <table id='tblLastTemps' className='stats col-lg-12 col-md-12 col-sm-12 col-xs-12'>
          <caption>
            <span className='hidden-xs'>Readings For Last Hour</span>
            <span className='hidden-lg hidden-md hidden-sm'>Last Hour</span>
          </caption>
          <thead>
            <tr><th>Date/Time</th><th>Temperature</th></tr>
          </thead>
          <tbody>
            {tempNodes}
          </tbody>
        </table>
      </div>
    )
  }
}
