'use strict'
import React from 'react'
import DateFormat from '../helpers/DateFormat.js'

export default class UpdatedDateTime extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.updatedDateTime !== this.props.updatedDateTime
  }

  render () {
    return (
      <footer>
        <table id='tblUpdated'>
          <tbody>
            <tr>
              <td>Updated:</td>
              <td>{DateFormat.toFullDateTimeString(this.props.updatedDateTime)}</td>
            </tr>
          </tbody>
        </table>
      </footer>
    )
  }
}
