'use strict'
let fs = require('fs')
let path = require('path')
let express = require('express')
let bodyParser = require('body-parser')
let mongoClient = require('mongodb').MongoClient
let request = require('request')

let mongoUrl
let currentTempUrl

let readMongoServer = (err, data) => {
  if (err) {
    return console.error(err)
  }

  let mongoServer = JSON.parse(data)
  mongoUrl = 'mongodb://' + mongoServer.host + ':' + mongoServer.port + '/' + mongoServer.db
  console.log('Mongo URL: \'' + mongoUrl + '\'')
}

let readCurrentTempServer = (err, data) => {
  if (err) {
    return console.error(err)
  }

  let currentTempServer = JSON.parse(data)
  currentTempUrl = currentTempServer.prefix + '://' + currentTempServer.host + ':' + currentTempServer.port + currentTempServer.path
  console.log('Current Temp URL: ' + currentTempUrl)
}

if (fs.existsSync('mongoServer.json')) {
  fs.readFile('mongoServer.json', 'utf8', readMongoServer)
} else if (fs.existsSync('/config/mongoServer.json')) {
  fs.readFile('/config/mongoServer.json', 'utf8', readMongoServer)
} else {
  console.log('Error! mongoServer.json file not found.')
  process.exit(1)
}

if (fs.existsSync('currentTempsServer.json')) {
  fs.readFile('currentTempsServer.json', 'utf8', readCurrentTempServer)
} else if (fs.existsSync('/config/currentTempsServer.json')) {
  fs.readFile('/config/currentTempsServer.json', 'utf8', readCurrentTempServer)
} else {
  console.log('Error! currentTempsServer.json file not found.')
  process.exit(1)
}

let port = '8080'

let app = express()
app.use('/', express.static(path.join(__dirname, 'client/public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

let TEMPS_PATH = '/Temps'

app.get(TEMPS_PATH + '/DateRange', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache')

  let startDate = Number(req.query.startDate)
  console.log(new Date(startDate))
  let endDate = Number(req.query.endDate)
  console.log(new Date(endDate))

  let db

  mongoClient.connect(mongoUrl)
    .then((_db) => {
      db = _db
      return db.collection('temps')
    })
    .then((collection) => {
      return collection.aggregate([
        { $match: { x: { $gte: startDate, $lte: endDate } } },
        { $sort: { x: 1 } },
        { $group: {
          _id: null,
          temps: { $push: { _id: '$_id', x: '$x', y: '$y' } },
          avg_temp: { $avg: '$y' },
          min_temp: { $min: '$y' },
          max_temp: { $max: '$y' }
        } },
        { $project: {
          temps: 1,
          avg_temp: 1,
          min_temp: {
            $setDifference: [
              { $map: {
                input: '$temps',
                as: 'temp',
                in: {
                  $cond: [
                    { $eq: [ '$min_temp', '$$temp.y' ] },
                    '$$temp',
                    false
                  ]
                }
              } },
              [false]
            ]
          },
          max_temp: {
            $setDifference: [
              { $map: {
                input: '$temps',
                as: 'temp',
                in: {
                  $cond: [
                    { $eq: [ '$max_temp', '$$temp.y' ] },
                    '$$temp',
                    false
                  ]
                }
              } },
              [false]
            ]
          }
        } }
      ])
    })
    .then((cursor) => {
      return cursor.toArray()
    })
    .then((documents) => {
      res.status(200).send(documents[0])
      if (db) db.close()
      return next()
    })
    .catch((err) => {
      if (db) db.close()
      return next(err)
    })
})

app.get(TEMPS_PATH + '/Current', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache')

  request.get(currentTempUrl, (err, resp, body) => {
    if (!err && res.statusCode === 200) {
      res.status(200).send(JSON.parse(body))
      return next()
    } else {
      return next(err)
    }
  })
})

app.listen(port, () => {
  console.log('Server started: http://localhost:' + port + '/')
})
