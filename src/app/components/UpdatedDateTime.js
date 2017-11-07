'use strict'
import React from 'react'
import dateFormat from 'dateformat'

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
              <td>{dateFormat(this.props.updatedDateTime, 'm/d/yyyy h:MM TT')}</td>
            </tr>
          </tbody>
        </table>
      </footer>
    )
  }
}
