'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'

import CurrentTemps from './CurrentTemps.js'
import TempRangeForm from './TempRangeForm.js'
import TempChart from './TempChart.js'
import TempMinMaxAvg from './TempMinMaxAvg.js'
import TempLastHour from './TempLastHour.js'
import UpdatedDateTime from './UpdatedDateTime.js'

let changeUpdatedDate = true
let currentTempsTimer
let tempDataTimer

class App extends React.Component {

  constructor (props) {
    super(props)
    this.loadCurrentTempsFromServer = this.loadCurrentTempsFromServer.bind(this)
    this.loadTempDataFromServer = this.loadTempDataFromServer.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    this.handleRefreshClicked = this.handleRefreshClicked.bind(this)
    this.autoUpdateTemps = this.autoUpdateTemps.bind(this)

    this.state = {
      currentTemps: {inside: 0.0, outside: 0.0},
      rangeValue: this.props.initialRange,
      tempData: [],
      lineThickness: 1.0,
      minTemp: {x: new Date(), y: 0.0},
      maxTemp: {x: new Date(), y: 0.0},
      avgTemp: 0.0,
      tempLastHour: [],
      updatedDateTime: new Date()
    }
  }

  loadCurrentTempsFromServer () {
    fetch('/Temps/Current').then(response => {
      return response.json()
    }).then(data => this.setState({currentTemps: data}))
  }

  autoUpdateTemps () {
    changeUpdatedDate = true
    this.loadTempDataFromServer()
  }

  setTimers () {
    currentTempsTimer = setInterval(this.loadCurrentTempsFromServer, this.props.currentPollInterval)
    tempDataTimer = setInterval(this.autoUpdateTemps, this.props.tempDataPollInterval)
  }

  loadTempDataFromServer () {
    let endDate = new Date()
    let startDate = new Date(endDate)
    let hours = this.state.rangeValue
    startDate.setTime(startDate.getTime() - hours * 3600000)

    let lineThickness = 1.0
    let selectedValue = parseInt(this.state.rangeValue)

    if (navigator.userAgent.match(/iPhone/i)) {
      if (selectedValue > 48) lineThickness = 0.5
    } else if (navigator.userAgent.match(/iPad/i)) {
      if (selectedValue > 168) lineThickness = 0.5
    }
    fetch('/Temps/DateRange?startDate=' + startDate.getTime() + '&endDate=' + endDate.getTime()).then(response => {
      return response.json()
    }).then(data => {
      let minTemp = data['min_temp'][data['min_temp'].length - 1]
      let maxTemp = data['max_temp'][data['max_temp'].length - 1]
      let avgTemp = data['avg_temp']
      let now = new Date()
      let hourEarlier = now.setHours(now.getHours() - 1)
      let tempLastHour = data['temps'].filter(temp => temp.x >= hourEarlier)

      this.setState({tempData: data['temps'], avgTemp: avgTemp, minTemp: minTemp, maxTemp: maxTemp, tempLastHour: tempLastHour, lineThickness: lineThickness}, () => {
        if (changeUpdatedDate) {
          this.setState({updatedDateTime: new Date()})
        }
      })
    })
  }

  componentDidMount () {
    this.loadCurrentTempsFromServer()
    this.loadTempDataFromServer()
    this.setTimers()
  }

  handleRangeChange (event) {
    event.target.blur()
    this.setState({rangeValue: event.target.value}, () => {
      changeUpdatedDate = false
      this.loadTempDataFromServer()
    })
  }

  handleRefreshClicked (event) {
    event.target.blur()
    changeUpdatedDate = true
    this.loadTempDataFromServer()
    clearInterval(currentTempsTimer)
    clearInterval(tempDataTimer)
    this.setTimers()
  }

  render () {
    return (
      <div className='container-fluid'>
        <div id='header' className='row'>
          <p id='pageTitle' className='col-sm-12 col-md-12'>Bean&nbsp;House&nbsp;Temperature&nbsp;Log</p>
          <CurrentTemps currentTemps={this.state.currentTemps} />
          <TempRangeForm onRangeChange={this.handleRangeChange} refreshClicked={this.handleRefreshClicked} rangeValue={this.state.rangeValue} />
        </div>
        <div className='row'>
          <TempChart lineThickness={this.state.lineThickness} tempData={this.state.tempData} />
          <div className='center-block col-lg-7 col-md-9'>
            <TempMinMaxAvg minTemp={this.state.minTemp} maxTemp={this.state.maxTemp} avgTemp={this.state.avgTemp} />
            <TempLastHour tempLastHour={this.state.tempLastHour} />
          </div>
        </div>
        <UpdatedDateTime updatedDateTime={this.state.updatedDateTime} />
      </div>
    )
  }
}

ReactDOM.render(<App currentPollInterval={60000} tempDataPollInterval={900000} initialRange={24} />, document.getElementById('app'))
