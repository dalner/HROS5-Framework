/************************************************
 *   Author: Daniel Alner
 *   Copyright (C) 2015
 *
 *   This program is released under the "GPL GNU v3".
 *   Please see the file LICENSE in this distribution for
 *   license terms.
 *************************************************/


var ffi = require('ffi');


//library location of the shared objects
var LIBLOC = '../api_wrapper/apiwrapper';

// core actions
var actionList = {};

// battery level to emit on heartbeat
var BatteryLevel = -1;


/**************************************
***             Initialize           **
****************************************/
exports.Initialize = function() { 
  // set the core actions
  setCoreActions();

  // then initialize servos
  if(general.InitializeJS()) {
      actions.PlayActionJS(actionList.sit);  // sit robot
      console.log("successful robot init");
    }
    else
      console.log("error initializing robot");
  // start the battery and servo monitoring on server start
  setInterval(getBatteryVoltLevel, 1000);  // check the heartbeat every 1 second (up for change)
  // setInterval(checkServos(), 5000);  // check the heartbeat every 5 second (up for change)
}

exports.PlayAction = function(action) {
  if(typeof action === 'number')
    actions.PlayActionJS(action);
  else
    throw new Exception("Must be a number action");
}

exports.WalkToggle = function(onOff) { 
  walk.WalkJS(onOff);
}

exports.MoveHeadByAngle = function(ptcoords) { 
  throw new Exception("Method not implemented");
}

exports.Walking = function(walkCoords) { 
  if(typeof parseInt(walkCoords.x) === 'number' && typeof parseInt(walkCoords.y) === 'number') {
    console.log(walkCoords.x, walkCoords.y);
    walk.WalkingJS(parseInt(walkCoords.x), parseInt(walkCoords.y));
  }
  else
      console.log('must give int x and y coords');
}

exports.ServoShutdown = function() { 
  general.ServoShutdownJS();
}
exports.ServoStartup = function() { 
  general.ServoStartupJS();
}

exports.GetActionList = function(action) {
    return actionList;
  }

exports.GetBatteryLevel = function() { 
  return BatteryLevel;
}
/************************************
* Function calls to native code:    *
*                                   *
*                                   *
************************************/
// these core actions must be updated
// to reflect the page builds
// on the rme editor (these are suggested 
// page number selections)
function setCoreActions() {
  actionList.stand        = 2;
//page 3 is walk ready
actionList.sit          = 15;
actionList.sitshtdown   = 6;
actionList.wave         = 20;
//actionList.handshake    = 11;
//actionList.excite       = 12;
//actionList.thanks       = 13;
//actionList.superhero    = 14;
actionList.dance        = 4;
//actionList.nod          = 16;
}


/**************************************
***              General/Options     **
****************************************/
var general = ffi.Library(LIBLOC, {
    // initialize servos
    'InitializeJS': ['bool', []],
    // off all servos
    'ServoShutdownJS' : ['void', [] ],
    // on all servos
    'ServoStartupJS' : ['void', [] ]
  });


/**************************************
***                  Actions         **
****************************************/
var actions = ffi.Library(LIBLOC, {
    // call page numbers
    'PlayActionJS' : ['int', ['int'] ]
  });

/**************************************
***                   Walking        **
****************************************/
var walk = ffi.Library(LIBLOC, {
    // turn walking on/off
    'WalkJS' : ['void', ['bool']],

    // walking location xy
    'WalkingJS' : ['void',['int', 'int']]

    // set walking gait
    //TBD

    // tune walking
    //TBD

    // walking speed set
    //TBD
  });

/**************************************
***                   Head Motion    **
****************************************/
var head = ffi.Library(LIBLOC, {
    // head pan (double) tilt (double) motion
    // 'MoveHeadByAngleJS' : ['void', ['double', 'double']]
  });

/**************************************
***                   Diagnostic     **
****************************************/
var diagnostics = ffi.Library(LIBLOC, {
    // check all servos and return failing servo or return 0
    'CheckServosJS' : [ 'int', []],
    // check battery and return volt value or if below value, sit robot
    'BatteryVoltLevelJS' : [ 'int', [] ]
    // check servo heat value and return or sit if above value
    // maybe merge this into check servos?

    // check wifi connectivity and values

    // give alert of any other issues and return
  });
/***                Battery       **/
function getBatteryVoltLevel(){
    // from here, this returns a voltage, possible change to percent
    BatteryLevel = diagnostics.BatteryVoltLevelJS();
  }
  /***                Servos check -- not yet implemented      
  function checkServos(){
    var servosValues = 0;
    servosValues = diagnostics.CheckServosJS();
    socket.emit('servovalues', servosValues);
  }**/
  
/**************************************
***                   Sensors        **
****************************************/
var sensors = ffi.Library(LIBLOC,{
    // add sensor
    // flesh this out a bit more

  });
