/**
 * Created by saidatrahouchecharrouti on 10/11/15.
 */
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var routes = require('../routes/index');

app.use('/', routes);

server.listen(9000, function(){
    console.log("Servidor iniciado");        
});
