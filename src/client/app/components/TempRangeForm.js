'use strict'
import React from 'react'
import {FormControl, InputGroup, Button, Glyphicon} from 'react-bootstrap'

export default class TempRangeForm extends React.Component {
  render () {
    return (
      <div id='inputForm'>
        <form>
          <InputGroup>
            <FormControl componentClass='select' id='lstDataRange' data-icon='false' placeholder={this.props.rangeValue} onChange={this.props.onRangeChange}>
              <option value='24'>Last 24 Hours</option>
              <option value='48'>Last 48 Hours</option>
              <option value='168'>Last Week</option>
              <option value='720'>Last Month</option>
              <option value='2160'>Last 3 Months</option>
              <option value='4320'>Last 6 Months</option>
              <option value='8760'>Last Year</option>
            </FormControl>
            <InputGroup.Button>
              <Button id='btnRefresh' onClick={this.props.refreshClicked}><Glyphicon glyph='refresh' /></Button>
            </InputGroup.Button>
          </InputGroup>
        </form>
      </div>
    )
  }
}
