#Node Server

Please see wiki article on node_server:

<https://github.com/Interbotix/HROS5-Framework/wiki/node_server>

####Additionally, new commands have been added from the ones on the wiki (that support the original node server). 


A quick start guide
==================
*Install node

To launch the node_server app.js program:

`$ node app.js`

### Socket requests
You can use the socket.io npm module to send requests to the node server. 

[See client side javascript API](https://github.com/dalner/HROS-node-client)

[See client side javascript API hello world](https://github.com/dalner/helloworld-HROS-node-client)

Basic syntax:

`socket.emit('command', parameter)`

#### Command options (Client->Server)
`socket.emit('initialize')`  
Sets core actions, initializes the servos and sits the robot

`socket.emit('servoshutdown')`  
Sits robot and turns off servos

`socket.emit('disconnect')`  
Safely disconnect from server (sits robot)

`socket.emit('action', integer/string)`  
Calls page number from rme, or string name from list of core actions

`socket.emit('walktoggle', bool)`  
Turns on or off walking engine (first plays the walking stance action)

`socket.emit('walking', {x:x, y:y})`  
Takes json element in x an y integer coords and sends them to the walking engine (-255,255)

`socket.emit('speech', string)`  
Attempts to use the Watson API to do text to speech conversion, falls back to 
linux's say command if unavailable

`socket.emit('naturallangproc', string)`  
Uses watson API to classify string input to understand requests, current learning is basic sit/stand commands. Eg Can you sit down, Can you stand up and various cases of those.


#### Command options (Server->Client)
`socket.on('batterylevel', batteryLevel)`
Gives client current battery level (currently implemented but unsure of results meaning)

# References
* <http://nodejs.org/documentation/>