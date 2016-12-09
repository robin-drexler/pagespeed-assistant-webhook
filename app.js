'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const NAME_ACTION = 'get_pagespeed';
const URL_ARGUMENT = 'url';

app.get('/', function(req, res) {
  console.log('GET Request headers: ' + JSON.stringify(req.headers));
  res.send('hello world');
});

// [START SillyNameMaker]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  function makeName (assistant) {
    let url = assistant.getArgument(URL_ARGUMENT);
    assistant.tell(`Page speed for ${url} score is 34`);
  }

  let actionMap = new Map();
  actionMap.set(NAME_ACTION, makeName);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
