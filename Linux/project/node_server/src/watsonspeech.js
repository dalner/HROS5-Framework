var ttscreds = require('./ttscreds.json');
var say = require('say');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var child_process = require('child_process');

exports.speak = function(string) { 
	/**************************************
      ***              IBM Watson         **
      ***  creds is a require file json 
      ***  format with
      ***  { username: <name>,
      ***  password: <password>,
      ***  version: 'v1' 
      ***  url:<url>}
      ***  remember, this is not the blumix 
      ***  name and password
      ***  api creds unique to api
      ****************************************/
      console.log("attempting to play audio");
      if(ttscreds.username !== null)
        var text_to_speech = watson.text_to_speech(ttscreds);
      else {
      // if there is no creds, then just use the linux backup speech
      // module (currenly not working)
      speechBackup(string);
      return;
    }

    var params = {
      text: string,
      voice:'VoiceEnUsMichael',
      accept:'audio/wav'
    };
    try {
	    // write to speech text to file
	    // once signalled completion, then play file
	    text_to_speech.synthesize(params).on('end', function() {
	      child_process.exec('aplay output.wav', function(err,out,code) {
	        console.log(err);
	        //speechBackup(string);
	      });
	    }).pipe(fs.createWriteStream('output.wav'));
    } catch(ex) {
    	console.log(ex);
    }
}

// backup if watson creds on not
// available, this fallback is for 
// linux only
function speechBackup(string) {
  say.speak(null, string);
}