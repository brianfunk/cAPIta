/*
             _       _______  _____  
            / \     |_   __ \|_   _| 
 .---.     / _ \      | |__) | | |   
/ /'`\]   / ___ \     |  ___/  | |   
| \__.  _/ /   \ \_  _| |_    _| |_  
'.___.'|____| |____||_____|  |_____| 
                                     
*/

//*******************************************************************

'use strict';

//*******************************************************************

require('dotenv').config();

var numberstring = require('numberstring');
var capstring = require('capstring');
var async = require('async');
var express = require('express');
var request = require('request');

//*******************************************************************

var KEY_MS = process.env.KEY_MS;

var PORT = process.env.PORT || 4321;

//*******************************************************************

var cases = [
    'same',
    'none',
    'proper',
    'title',
    'sentence',
    'upper',
    'lower',
    'leet',
    'camel',
    'pascal',
    'snake',
    'python',
    'crazy',
    'random'
];

var exts = [
    'json',
    'jsonp',
    'html',
    'txt'
];

//*******************************************************************
var app = express();

//app.use(express.static('public'));
 
app.get('/', function (req, res) {
	res.send('cAPI');
});

//*******************************************************************
app.get('/badge/:cap/:string', function(req,res) {
	
    var cs = '';
    var cap = req.params.cap;
    var string = req.params.string;
    console.log('cap : ' + cap );
    console.log('string : ' + string );
    
    if (cases.indexOf(cap) > -1) {
        cs = capstring(string, cap);
    }
    else {
        res.send('error');
        return;
    }
    
    var badge_url = 'https://img.shields.io/badge/cAPI-'+ encodeURIComponent(cs) +'-b5d4ff.svg';
	//console.log('badge_url : ' + badge_url );
	request(badge_url).pipe(res);
});

//*******************************************************************
app.get('/spell/:string.:ext', function(req,res) {
	
    var cs = '';
    var cap = req.params.cap;
    var string = req.params.string;
    var ext = req.params.ext;
    console.log('cap : ' + cap );
    console.log('string : ' + string );
    console.log('ext : ' + ext );
    
    var roptions = {
        url: 'https://api.cognitive.microsoft.com/bing/v5.0/spellcheck/?text='+ string +'&mode=proof&mkt=en-us',
        headers: {
            'Ocp-Apim-Subscription-Key': KEY_MS
        }
    };
 
    request(roptions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            console.log('body : ' + body );
            
            cs = string;
            console.log('cs : ' + cs );
            
            var bodyjson = JSON.parse(body);
            
            console.log('bodyjson.flaggedTokens.length : ' + bodyjson.flaggedTokens.length );
            
            if (bodyjson.flaggedTokens) {
                for (var k = 0 ; k < bodyjson.flaggedTokens.length; k++){
                    
                    console.log('k : ' + k );
                    console.log('bodyjson.flaggedTokens[k].token : ' + bodyjson.flaggedTokens[k].token );
                    console.log('bodyjson.flaggedTokens[k].suggestions[0].suggestion : ' + bodyjson.flaggedTokens[k].suggestions[0].suggestion );
                    
                    if ((bodyjson.flaggedTokens[k].token) && (bodyjson.flaggedTokens[k].suggestions[0].suggestion)){
                        cs = cs.replace(bodyjson.flaggedTokens[k].token, bodyjson.flaggedTokens[k].suggestions[0].suggestion);
                    }
                }
            }
            else {
                res.status(400).send('error - invalid spell');
                return;
            }
                               
            console.log('cs : ' + cs );
            
            outResponse(req, res, string, cs, 'spell', ext);
            
        }
        else {
            res.status(400).send('error - invalid spell');
            return;
        }
    })
});

//*******************************************************************
app.get('/spell/:string', function(req,res) {
	
    var cs = '';
    var string = req.params.string;
    console.log('string : ' + string );
    
    var roptions = {
        url: 'https://api.cognitive.microsoft.com/bing/v5.0/spellcheck/?text='+ string +'&mode=proof&mkt=en-us',
        headers: {
            'Ocp-Apim-Subscription-Key': KEY_MS
        }
    };
 
    request(roptions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            console.log('body : ' + body );
            
            cs = string;
            console.log('cs : ' + cs );
            
            var bodyjson = JSON.parse(body);
            
            console.log('bodyjson.flaggedTokens.length : ' + bodyjson.flaggedTokens.length );
            
            if (bodyjson.flaggedTokens) {
                for (var k = 0 ; k < bodyjson.flaggedTokens.length; k++){
                    
                    console.log('k : ' + k );
                    console.log('bodyjson.flaggedTokens[k].token : ' + bodyjson.flaggedTokens[k].token );
                    console.log('bodyjson.flaggedTokens[k].suggestions[0].suggestion : ' + bodyjson.flaggedTokens[k].suggestions[0].suggestion );
                    
                    if ((bodyjson.flaggedTokens[k].token) && (bodyjson.flaggedTokens[k].suggestions[0].suggestion)){
                        cs = cs.replace(bodyjson.flaggedTokens[k].token, bodyjson.flaggedTokens[k].suggestions[0].suggestion);
                    }
                }
            }
            else {
                res.status(400).send('error - invalid spell');
                return;
            }
                               
            console.log('cs : ' + cs );
            
            outResponse(req, res, string, cs, 'spell', false);
            
        }
        else {
            res.status(400).send('error - invalid spell');
            return;
        }
    })
});

//*******************************************************************
app.get('/:cap/:string.:ext', function (req, res) {
    
    var cs = '';
    var cap = req.params.cap;
    var string = req.params.string;
    var ext = req.params.ext;
    console.log('cap : ' + cap );
    console.log('string : ' + string );
    console.log('ext : ' + ext );
    
    if (cases.indexOf(cap) > -1) {
        cs = capstring(string, cap);
    }
    else {
        res.status(400).send('error - invalid case');
        return;
    }
    
    if (!cs) {
        res.status(400).send('error - invalid string');
        return; 
    }
    
    outResponse(req, res, string, cs, cap, ext);
    
});

//*******************************************************************
app.get('/:cap/:string', function (req, res) {
    
    var cs = '';
    var cap = req.params.cap;
    var string = req.params.string;
    console.log('cap : ' + cap );
    console.log('string : ' + string );
    
    if (cases.indexOf(cap) > -1) {
        cs = capstring(string, cap);
    }
    else {
        res.status(400).send('error - invalid case');
        return;
    }
    
    if (!cs) {
        res.status(400).send('error - invalid string');
        return; 
    }
    
    outResponse(req, res, string, cs, cap, false);
    
});

//*******************************************************************
function outResponse(req, res, input, output, cap, ext) {
    
    var out_html = '<head><title></title></head><body><p><strong><em>'+ output +'</em><strong></p></body>';
    var out_json = { 
        input: input,
        output: output,
        cap: cap
    };
    
    if (ext) {
        if (exts.indexOf(ext) > -1) {
            if (ext === 'txt') {
                res.type('text'); 
                res.send(output);
            }
            else if (ext === 'html') {
                res.type('html'); 
                res.send(out_html);
            }
            else if (ext === 'json') {
                res.json(out_json);
            }
            else if (ext === 'jsonp') {
                res.jsonp(out_json);
            }
            else {
                res.status(400).send('error - invalid ext');
                return;
            }
        }
        else {
            res.status(400).send('error - invalid ext');
            return;
        }
    }
    else {
        res.format({
            text: function(){
                res.send(output);
            },
            html: function(){
                res.send(out_html);
            },
            json: function(){
                res.json(out_json);
            },
            jsonp: function(){
                res.jsonp(out_json);
            }
        });
    }
}

//*******************************************************************
app.listen(PORT);

//*******************************************************************
