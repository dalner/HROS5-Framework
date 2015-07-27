var watson = require('watson-developer-cloud');
// used for the watson classifer id for natural language
// in the form export.classifier = function() {return <classid>;} 
var nlcclassid = require('./nclclassid');
var watsonspeech = require('./watsonspeech');

exports.classify = function(string) { 
/**************************************
      ***              IBM Watson         **
      ***  creds is a require file json 
      ***  format with
      ***  { username: <name>,
      ***  password: <password>,
      ***  version: 'v1' 
      ***  url:<url>}
      ***  remember, this is not the blumix 
      ***  name and password api creds unique to api
      ***  Currently only implemented in watson api
      ****************************************/
      var nlClassifier = watson.natural_language_classifier(nlccreds);
      var params = {
      classifier: nlcclassid.classifier(), // pre-trained classifier
      text: string
    };
    nlClassifier.classify(params, function(err, results) {
      if (err)
        console.log(next(err));
      else {
        console.log(results.top_class);
        switch(results.top_class) {
          case "standup":
          console.log("standing up");
          watsonspeech.speak("sure, i can stand up");
          break;
          case "sitdown":
          console.log("sitting down up");
          watsonspeech.speak("yep, i can sit down");
          break;
          case "introduction":
          watsonspeech.speak("I'm doing great");
          break;
        }
      }
    });
  });
}