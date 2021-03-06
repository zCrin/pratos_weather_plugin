const path = __dirname.replace('/node_modules/pratos_weather_plugin', '');
var fs = require('fs');
var Cookies = require("cookies"),
express = require('express');
var User = require("pratos_user_class"); 
var lastUpdateTime = 0;
var apiKey = null;
const request = require('request');
var MongoClient =require('mongodb').MongoClient;
var mongoDB;
var GlobalVariable;
		MongoClient.connect("mongodb://localhost/pratos", function(error, db) {
    if (error) throw error;
if(!error){
mongoDB = db;
console.log("Weather Plugin : Connected to Pratos' databases.");
}

});
module.exports = {
	config:function(){

		var conf = Object();
		conf.GET = true;
		conf.on_homepage = true;
conf.on_content = true;
conf.has_settings = true;
		return conf;
	},
content:function(link){

link["weather_plugin"]={"page":"admin/settings","script":" <script src='/weather.js'></script>"}; 
link["weather_plugin1"]={"page":"admin/index","script":" <script src='/homepage_weather.js'></script>"}; 

		
		return link;
	},
homepage:function(homepage){
		homepage.createBox("Weather", "<p style='padding: 3%; text-align: center;'>Fetching weather... <br /> Please wait ...</p>", true);
},
get:function(app, globalVariable){
app.use(express.static(__dirname + '/public'));
GlobalVariable= globalVariable;

		
app.get('/weatherNeedsLocation', function(req, res) {
	User.verify_connection(req.user_id,globalVariable , function(user_res){
		if(user_res == true){
			mongoDB.collection("weatherPlugin").findOne({job:"settings"},function(error, data) {
				if(data){
					apiKey = data;
					if(!data.apiKey){
						res.end("0");
					}
					else{
						if(data.location && data.location != 1){
							res.end('no');
						}else{
							res.end('yes');
						}
					}
				}else{
					res.end("0");
				}		
			});
}else{res.redirect("/");
}
delete globalVariable[req.user_id];
});
	
});
app.get('/weatherApiGetData', function(req, res) {
			User.verify_connection(req.user_id,globalVariable , function(user_res){
				if(user_res == true){
mongoDB.collection("weatherPlugin").findOne({job:"settings"},function(error, data) {
if(data){


if(!data.apiKey){

			res.end("0");
delete globalVariable[req.user_id];
}
else{
apiKey = data;
if(data.location && data.location != 1){
var location = 'q='+data.location;
}else{

var location = 'lon='+globalVariable[req.user_id].request.query.long+"&lat="+globalVariable[req.user_id].request.query.lat;
}

var lang = (data.language)? data.language : 'fr';
var unity = (data.unity)? data.unity : 'metric';

request({uri: "http://api.openweathermap.org/data/2.5/weather?"+location+"&lang="+lang+"&units="+unity+"&APPID="+ data.apiKey,timeout:10000},(err,ans,state)=>{
if(isJson(state)){
if(unity == 'metric'){
state = JSON.parse(state);
state.main.temp = state.main.temp +" \260C";
state.wind.speed = (state.wind.speed*(3.6)).toFixed(1) +" km/h";
state = JSON.stringify(state);
}
else if(unity == 'imperial'){
state = JSON.parse(state);
state.main.temp = state.main.temp +" F";
state.wind.speed = state.wind.speed +" mph";
state = JSON.stringify(state);
}else{
state = JSON.parse(state);
state.main.temp = state.main.temp +" K";
state.wind.speed = state.wind.speed +" m/s";
state = JSON.stringify(state);
}
			res.end(state);
delete globalVariable[req.user_id];
}else{
res.end('error : '+state);
delete globalVariable[req.user_id];
}
});

}
}else{
res.end("0");
delete globalVariable[req.user_id];
}
});


				}
else{
res.redirect('/');
delete globalVariable[req.user_id];
}

});
});
		app.get('/weatherApiKey', function(req, res) {
User.verify_connection(req.user_id,globalVariable , function(user_res){
				if(user_res == true){
			res.setHeader('Content-Type', 'text/html');
mongoDB.collection("weatherPlugin").findOne({job:"settings"},function(error, data) {
if(data){
apiKey = data;

if(!data.apiKey){

			res.end("0");
delete globalVariable[req.user_id];
}
else{
apiKey = data;
delete data.apiKey;
data.keyCode=	1;
			res.end(JSON.stringify(data));
delete globalVariable[req.user_id];

}
}else{
res.end("0");
}
});
			
}else{
res.redirect('/');
delete globalVariable[req.user_id];

}

});
		});
app.get('/weatherApiSetInfos', function(req, res) {
			User.verify_connection(req.user_id,globalVariable , function(user_res){
				if(user_res == true){
var location = (globalVariable[req.user_id].request.query.location)? globalVariable[req.user_id].request.query.location : 1;
var lang = (globalVariable[req.user_id].request.query.lang)? globalVariable[req.user_id].request.query.lang : 'fr';
var unity = (globalVariable[req.user_id].request.query.unity)? globalVariable[req.user_id].request.query.unity : 'metric';
mongoDB.collection("weatherPlugin").update({ job: "settings"}, 
{$set: { location: location,unity:unity,language:lang}}, false, true);

res.end('done');
				}
else{
res.redirect('/');
}
delete globalVariable[req.user_id];
});
});
app.get('/weatherApiDisconnect', function(req, res) {
			User.verify_connection(req.user_id,globalVariable , function(user_res){
				if(user_res == true){

mongoDB.collection("weatherPlugin").remove({ job: "settings"});

res.end('done');
				}
else{
res.redirect('/');
}
delete globalVariable[req.user_id];
});
});

app.get('/weatherApiSendKey', function(req, res) {
			User.verify_connection(req.user_id,globalVariable , function(user_res){
				if(user_res == true){
					if(globalVariable[req.user_id].request.query.apikey){
var momentKey = globalVariable[req.user_id].request.query.apikey;
request({uri: "http://api.openweathermap.org/data/2.5/weather?q=London&APPID="+ momentKey,timeout:10000},(err,ans,state)=>{
if(isJson(state)){
state = JSON.parse(state);
switch(state.cod){
case 200:
mongoDB.collection("weatherPlugin").update({ job: "settings"}, 
{apiKey: momentKey, job: "settings"},{upsert:true},function(){
apiKey=  momentKey;
mongoDB.collection("weatherPlugin").findOne({job:"settings"},function(error, data) {
if(data){
delete data.apiKey;
data.keyCode=	1;
			res.end(JSON.stringify(data));
}else{
res.end('Nothing');
}
});
});
break;
case 401:
res.end('401:Invalid API KEY');
break;
default:
res.end('Invalid API KEY');
break;
}

}else{
res.end('Invalid API KEY');
}

});
}
else{
res.end('Missing apiKey');
}
}
else{
res.redirect('/');
}
delete globalVariable[req.user_id];
});
});
},
has_settings:function(globalvariable){
var y = {title: "Weather", buttonName:"weatherButton", buttonIcon:"<i class='fa fa-cloud'></i>",boxContent:"<h2>Weather</h2>"};
return y;
}
};
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


			