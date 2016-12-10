'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
const psi = require('psi');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));


const NAME_ACTION = 'get_pagespeed';
const URL_ARGUMENT = 'url';

app.get('/', function (req, res) {
    psi('http://jimdo.com')
        .then((result) => {
            res.send('' + result.ruleGroups.SPEED.score)
        })
        .catch((err) => {
            res.send(':(')
        });
});


app.post('/', function (req, res) {
    const assistant = new Assistant({request: req, response: res});
    console.log('Request headers: ' + JSON.stringify(req.headers));
    console.log('Request body: ' + JSON.stringify(req.body));

    function makeName(assistant) {
        const url = assistant.getArgument(URL_ARGUMENT);

        psi(url)
            .then((result) => {
                assistant.tell(`Mobile page speed for ${url} score is ${result.ruleGroups.SPEED.score}`);
            })
            .catch((err) => {
                assistant.tell(`Mobile page speed for ${url} could not be determined.`);
            });
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
