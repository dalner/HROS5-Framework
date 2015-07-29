/*
 *   app.js
 *
 *   Author: Daniel Alner
 *   Copyright (C) 2015
 *   GNU GENERAL PUBLIC LICENSE
 */

//requirements
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watson = require('watson-developer-cloud');
var fs = require('fs');
var child_process = require('child_process');
// credentials for watson api
var watsonspeech = require('./watsonspeech');
var watsonnlc = require('./watsonnlproc');
var robotcomm = require('./robotcommunication');

/**************************************
***              Web Service         **
****************************************/
app.use(express.static(__dirname + '/www'));

// serve up the html page on connection to ip address and port #
app.get('/', function(req, res){
  res.sendfile('index.html');
});

/**************************************
***             REST API            ***
***         Still uncompleted       ***
******************************************
//http://<ipaddress>/Options/GetName
//Still working this part out, UNCOMPLETED
app.get('/options/getname', function (req, res) {

});
//http://<ipaddress>/Diagnostics/Initialize
//Still working this part out, UNCOMPLETED
app.get('/diagnostics/initialize', function (req, res) {

});

//http://<ipaddress>/Action/Call/name
//Call action by name.
app.get('/action/call/:name', function (req, res) {
  console.log(req);
});
//http://<ipaddress>/Action/Add/name
//Add action by name. Must be unique action names. System action names already exist, such as Stand, Sit, Wave, Exite...etc
app.get('action/add/:name', function (req, res) {
  console.log(req);
});
//http://<ipaddress>/Action/Position/name?position?server
//Still being determined how to do, UNCOMPLETED
app.get('action/position/:name:position:server', function (req, res) {
  console.log(req);
});

//http://<ipaddress>/Walk/bool
//Turn walk on or off (use true/false, on/off)
app.get('walk/:onOff', function (req, res){

});
//http://<ipaddress>/Walk/Position/x?y
//Walk position values must exists within -255 to 255, the larger the values the faster the walk stride (double check)
app.get('walk/position/:x:y', function (req, res){

});

//http://<ipaddress>/Head/Position/angle?degree
//Still working this part out, UNCOMPLETED
app.get('head/position/:angle:degree', function(req, res){

});

//http://<ipaddress>/Diagnostics/check
//Still working this part out, UNCOMPLETED
app.get('/diagnostics/check', function (req, res){

});
//http://<ipaddress>/Diagnostics/Battery
//Still working this part out, UNCOMPLETED
app.get('/diagnostics/battery', function (req, res){

});
****************************************/

/**************************************
***        Connection/Disconnection  **
****************************************/
io.on('connection',function(socket) {
  console.log("device connected");
  // start battery emit to client
  setInterval(function(){
    io.emit('batterylevel', robotcomm.GetBatteryLevel())
  },2000);
  /***                Initialize       **/
  socket.on('initialize', function () {
    robotcomm.Initialize();
  });

  /***                Servo Shutdown       **/
  socket.on('servoshutdown', function () {
    robotcomm.ServoShutdown();
  });

  /***                Servo Startup       **/
  socket.on('servostartup', function () {
    robotcomm.ServoStartup();
  });

  /***                disconnect       **/
  socket.on('disconnect',function(){
    console.log('disconnecting');
      //notify app and sit robot
      var actionList = robotcomm.GetActionList()
      robotcomm.PlayAction(actionList.sit);  // sit robot
      console.log('disconnected');
    });

  /***                action       **/
  socket.on('action',function(action){
    var pageNumb = action.trim();
    console.log('loading page', pageNumb);
    try {
      var actionList = robotcomm.GetActionList();
      robotcomm.PlayAction(actionList[pageNumb]);  // this currently holds the thread on play
    } catch (err) {
      console.log('failed to load page');
    }
  });

  /***                Walk           **/
  socket.on('walktoggle',function (onOff) {
    console.log('walk toggle');
    if(typeof onOff === 'boolean')
      robotcomm.WalkToggle(onOff);
    else
      console.log('must be boolean parameter');
  });

  /***                walking       **/
  socket.on('walking', function (walkCoords) {
    robotcomm.Walking(walkCoords);
  });
  
  /***                Head Motion       **/
  socket.on('headposition', function (pan, tilt) {
    robotcomm.MoveHeadByAngle(pan, tilt);
  });
  /***                speech       **/
  // speech module only works on linux
  socket.on('speech', function(string){
    watsonspeech.speak(string);
  });

  /***             natural language processor       **/
  socket.on('naturallangproc', function(string) {
    watsonnlc.classify(string);
  });
});

// open the port and listen..
http.listen(2114,function(){
    console.log("listening on port 2114");
    robotcomm.Initialize();
  });
