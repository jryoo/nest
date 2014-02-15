#!/usr/bin/env node
'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');

// COUCHDB + Cradle

// remove https:// because cradle doesn't like it

var cURL = undefined;
if (process.env.CLOUDANT_URL) {
    cURL = process.env.CLOUDANT_URL.substr(process.env.CLOUDANT_URL.indexOf('://')+3);
}

var chost = cURL || 'http://127.0.0.1';

var cradle = require('cradle');

var c = new(cradle.Connection)(chost, 5984, {
    cache: true,
    raw: false,
    forceSave: true
});

var db = c.database('package-data');

db.exists(function (err, exists) {
    if (err) {
      console.log('error', err);
    } else if (exists) {
      console.log('Database exists.');
    } else {
      console.log('database does not exist. Creating Database');
      db.create();
    }
});

db.save('_design/packages', {
    all: {
        map: function (doc) {
            if (doc.name) {
                emit(doc.name, doc);
            }
        }
    },
    byname: {
        map: function (doc) {
            if (doc.name) {
                emit(doc.name, doc);
            }
        }
    }
});

var app = express();
app.set('port', process.env.PORT || 3020);
//var storage = process.argv[2] || './package-data.json';

// Check if pacakge-data.json exists
// If it does read the files
//if (fs.existsSync(storage)) {
//    packages = JSON.parse(fs.readFileSync(storage));
//}

// Configure Express
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', path.join(__dirname, '/public/views'));
    app.engine('html', require('ejs').renderFile);
    app.use(app.router);
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.listen(app.get('port'), function () {
    console.log('Nest Registry');
    console.log('---------------------');
    console.log('           port: %d', app.get('port'));
    console.log('      data file: %s', chost);
    //console.log('packages loaded: %d', Object.keys(packages).length);
});

app.get('/', function(req, res) {
    res.render('index.html');
})

// If a get request, send all in response
app.get('/packages', function (request, response) {

    db.view('packages/all', function (err, packages) {
        console.log('get all');
        console.dir(packages);
        if (err) {
            console.log('Failed to get the package data from database!');
            console.log(err);
            response.send(500);
        } else {
            var result = [];
            for (var i =0; i < packages.length; i++) {
                var doc = packages[i];
                result.push({
                    name: doc.value.name,
                    url: doc.value.url
                });
            }
            response.send(result);
        }
    });

});

// Adding to the registry
app.post('/packages', function (request, response) {
    console.log('Recieved request to add package: ' + request.body.name + ' with url: ' + request.body.url);
    
    var temp_package = {};
    temp_package.name = request.body.name;
    temp_package.url = request.body.url;
    console.log('Adding new package: ');
    console.dir(temp_package);
    db.save(request.body.name, temp_package, function (err, res) {
        if (err) {
            console.log('Failed to write the package data to database!');
            console.log(err);
            response.send(500);
        } else {
            response.send(201);
        }
    });
});

// Deleting from the registry
app.delete('/packages/:name', function (request, response) {
    var name = request.body.name;
    console.log('Recieved request to delete package: ' + name);
    
    db.remove(name, function (err, res) {
        if (err) {
            console.log('Failed to delete the package data from database!');
            console.log(err);
            response.send(500);
        } else {
            console.log('Deleting: ' + res.id);
            response.send(200);
        }
    });
});

// get specific
app.get('/packages/:name', function (request, response) {
    var name = request.params.name;
    console.log('Recieved request for specific package: ' + name);
    db.view('packages/byname', { key: name }, function (err, doc) {
        console.dir(doc);
        if (err) {
            console.log('Failed to get the package data from database!');
            console.log(err);
            response.send(500);
        } else {
            if (doc.length <= 0) {
                console.log('Package not found');
                response.send(404);
            } else {
                console.log('Package found');
                var result = {
                    name: doc[0].value.name,
                    url: doc[0].value.url
                }
                response.send(result);
            }
        }
    });
});

// Searching
app.get('/packages/search/:name', function (request, response) {


    db.view('packages/all', function (err, packages) {
        console.log('get all');
        console.dir(packages);
        if (err) {
            console.log('Failed to get the package data from database!');
            console.log(err);
            response.send(500);
        } else {
            console.log('Found packages: ');
            console.dir(packages);
            var results = [];

            for (var i = 0; i < packages.length; i++) {
                if(packages[i].value.name.indexOf(request.params.name) !== -1) {
                    results.push( {
                        name: packages[i].value.name,
                        url: packages[i].value.url
                    });
                }
            }

            response.send(results);
        }
    });
});