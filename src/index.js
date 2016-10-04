var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var request = require('request');

var mongoUrl;
var currentTempUrl;

fs.readFile('mongoServer.json', 'utf8', function (err, data) {
    if (err) {
        return console.error(err);
    }
    
    var mongoServer = JSON.parse(data);
    mongoUrl = 'mongodb://' + mongoServer.host + ':' + mongoServer.port + '/' + mongoServer.db;
    console.log('Mongo URL: \'' + mongoUrl + '\'');
});

fs.readFile('currentTempsServer.json', 'utf8', function(err, data) {
    if (err) {
        return console.error(err);
    }
    
    var currentTempServer = JSON.parse(data);
    currentTempUrl = currentTempServer.prefix + '://' + currentTempServer.host + ':' + currentTempServer.port + currentTempServer.path;
    console.log('Current Temp URL: ' + currentTempUrl);
});

var port =  '8080';
 
var app = express();
app.use('/', express.static(path.join(__dirname, 'client/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
 
var TEMPS_PATH = '/Temps'
 
app.get(TEMPS_PATH + '/DateRange', function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    
    var startDate = Number(req.query.startDate);
    console.log(new Date(startDate));
    var endDate = Number(req.query.endDate);
    console.log(new Date(endDate));
    
    var db;
    
    mongoClient.connect(mongoUrl)
        .then(function(_db) {
            db = _db;
            return db.collection('temps');
        })
        .then(function(collection) {
            return collection.aggregate([
                        { $match: { x: { $gte: startDate, $lte: endDate } } },
                        { $sort: { x: 1 } },
                        { $group: {
                            _id: null,
                            temps: { $push: { _id: '$_id', x: '$x', y: '$y' }},
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
                                                { $eq: [ '$min_temp', '$$temp.y'] },
                                                '$$temp',
                                                false
                                            ]
                                        }
                                    }},
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
                                                { $eq: [ '$max_temp', '$$temp.y'] },
                                                '$$temp',
                                                false
                                            ]
                                        }
                                    }},
                                    [false]
                                ]
                            }
                        }}
                    ]);
        })
        .then(function(cursor) {
            return cursor.toArray();
        })
        .then(function(documents) {
            res.status(200).send(documents[0]);
            if (db) db.close();
            return next();
        })
        .catch(function(err) {
            if (db) db.close();
            return next(err);
        });
});

app.get(TEMPS_PATH + '/Current', function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    
    request.get(currentTempUrl, function (err, resp, body) {
        if (!err && res.statusCode === 200) {
            res.status(200).send(JSON.parse(body));
            return next();
        } else {
            return next(err);
        }
    });
});

app.listen(port, function() {
    console.log('Server started: http://localhost:' + port + '/');
});