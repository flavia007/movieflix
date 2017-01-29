// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework for node.js
    bodyParser = require('body-parser'), //Parser for reading request body and parameters
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require('mongoose');

var Q = require('q');
mongoose.Promise = Q.Promise;
var database_config = require('./config');
var routes = require('./routes/routes.js');
var validateToken = require('./middlewares/validateToken');


//Create server
var app = express();
//connect to database
mongoose.connect(database_config.database);
app.set('secretKey',database_config.secret);


//use body parser to get information from POST or url parameters
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Start server on port
app.set('port', process.env.PORT || 4711);


//use prefix for api routes
app.use('/api',routes);


//start the server to listen to the port
app.listen( app.get('port'), function() {
    console.log( 'Express server listening on port'+ app.settings.port);
});