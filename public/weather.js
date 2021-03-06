var urlSplitted = window.location.href.split('/');
var file = urlSplitted[(urlSplitted.length - 1)] || urlSplitted[(urlSplitted.length - 2)];
if(file == "index"){
}
else if(file == "settings"){
var global_color=$("h1").css("color");
$('#weatherButton').click(function(){
$.get('/weatherApiKey',function(data){

if(!isJson(data)|| !(JSON.parse(data)).keyCode){

$('#weatherBox').html("<h3 style='text-align:center' >Cl\351 d'API manquante</h3><p>Pour en obtenir une, inscrivez-vous sur le site <a href='https://home.openweathermap.org/users/sign_up' >OpenWeatherMap</a>.<br />Apr\350s l\u2019inscription allez dans <i>--API Keys--</i> puis copiez et collez la cl\351 par d\351faut ici :</p><input id='weatherApiKeyField' style='display:block;width:70%;margin:2% auto;' type='text' > <input id='weatherApiKeySubmit' style='color:"+ global_color +"; border-color:"+global_color+"; display:block;margin:2% auto;' type='submit' >");
$("#weatherApiKeySubmit").click(function(){
var apiKey = $("#weatherApiKeyField").val();
$.get('/weatherApiSendKey?apikey='+ apiKey,function(data){
if(isJson(data) && (JSON.parse(data)).keyCode){
data = JSON.parse(data);
show_data(data);
}
else{
alert(data);
}
});
});
}
else{
data = JSON.parse(data);

show_data(data);




}
});
});

$('#weatherBox').html("<h2>Weather</h2>");

}
var myLocationP, otherLocationChecked;
function show_data(data){
otherLocationChecked = (data.location && data.location != 1)? "checked":"nothing";

var lang = (data.language)? data.language:"fr";
var units = (data.unity)? data.unity:"metric";

myLocationP = (!data.location || data.location == 1)? "checked":"nothing";

var myLocationInputStyle = (!data.location || data.location == 1)? "none":"block";
var myLocationInputValue = (data.location && data.location != 1)? data.location:"";
$('#weatherBox').html("<style> .ui-button{background-color:white;font-family: San Francisco;font-weight:200;padding:1%; font-size: 100%;border:0;}.ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active,a.ui-button:active,.ui-button:active,.ui-button.ui-state-active:hover {border: 1px solid "+ global_color+";background :"+ global_color+";font-weight: normal;color: #ffffff;} </style><h2 style='text-align:center' >Open Weather API</h2><h3>Localisation :</h3><div style='padding-bottom:2%;'><label for='localisationHomePageMine' >Ma position : *&nbsp; &nbsp; &nbsp;</label><input id='localisationHomePageMine' name='localisationHomePage' style='	-moz-appearance:none;-webkit-appearance:none;-appearance:none;border-radius:0;outline: 1px solid white;border: 0px solid black;height: 20px;width: 20px; position:relative;top:7px;'type='radio'/><br /><br /><label for='localisationHomePageOther' >Autre position : &nbsp; &nbsp; </label><input style='	-moz-appearance:none;-webkit-appearance:none;-appearance:none;border-radius:0;outline: 1px solid white;border: 0px solid black;height: 20px;width: 20px; position:relative;top:7px;' id='localisationHomePageOther' name='localisationHomePage' type='radio'/><br /><br /><div style='display:"+ myLocationInputStyle +"' id='hidenBlockPersonalLocation' ><label for='personalLocationInput' >Autre :</label> &nbsp; &nbsp; <input type='text'value='"+ myLocationInputValue +"' id='personalLocationInput'placeholder='Ville'/> </div><h3>Langue :</h3><select id='selectLang' ><option>ar - Arabic</option> <option>bg - Bulgarian</option> <option>ca - Catalan</option> <option>cz - Czech</option> <option>de - German</option> <option>el - Greek</option> <option>en - English</option> <option>fa - Persian (Farsi)</option> <option>fi - Finnish</option> <option>fr - French</option> <option>gl - Galician</option> <option>hr - Croatian</option> <option>hu - Hungarian</option> <option>it - Italian</option> <option>ja - Japanese</option> <option>kr - Korean</option> <option>la - Latvian</option> <option>lt - Lithuanian</option> <option>mk - Macedonian</option> <option>nl - Dutch</option> <option>pl - Polish</option> <option>pt - Portuguese</option> <option>ro - Romanian</option> <option>ru - Russian</option> <option>se - Swedish</option> <option>sk - Slovak</option> <option>sl - Slovenian</option> <option>es - Spanish</option> <option>tr - Turkish</option> <option>ua - Ukrainian</option> <option>vi - Vietnamese</option> <option>zh_cn - Chinese Simplified</option> <option>zh_tw - Chinese Traditional</option></select><h3>Unit\351 : </h3><select id='selectUnity'><option>Celsius (metric)</option> <option> Fahrenheit (imperial)</option> <option>Kelvin</option> </select><input id='weatherApiKeySubmit' style='color:"+ global_color +"; border-color:"+global_color+"; display:block;margin:2% auto;' value='Changer'  type='submit' ><button id='disconnectWeather'style='color:red; border-color:red; font-size:100%; font-weight:300;display:block;margin:2% auto;' >Se d\351connecter</button><i style='font-size:90%;'>*n\351cessite une connexion s\351curis\351e https (voir manuel)</i></div>").promise().done(function(){


$('.ui-button:focus').css('border','1px solid #cccccc');
$('#selectLang').on( "selectmenuclose", function( event, ui ) {$('.ui-button').blur();} );
$('.ui-selectmenu-button.ui-button').css('width', ($('#personalLocationInput').css('width').replace('px','')-30)+"px");
$('.ui-button').css('background-color','white');
$('.ui-selectmenu-button.ui-button').css('text-align','center');
$("option:selected").prop("selected", false).promise().done(function(){
$("option:contains('"+lang+"')"). prop('selected', true);
$("option:contains('"+units+"')"). prop('selected', true);
$('#selectUnity').selectmenu();
$('#selectLang').selectmenu();
$("#localisationHomePageOther").attr(otherLocationChecked, otherLocationChecked);
$("#localisationHomePageMine").attr(myLocationP, myLocationP);

});


});
$('#personalLocationInput').focus(function(){
$("#localisationHomePageOther").click();
$('#personalLocationInput').focusIn();
});
$("#disconnectWeather").click(function(){

$.get('/weatherApiDisconnect',function(data){
$('#weatherButton').trigger('click');
});
});
$("#weatherApiKeySubmit").click(function(){
if($("#localisationHomePageOther").is(':checked')){
var cityName = $("#personalLocationInput").val();
}
else{
var cityName = 1;
}
var langPart= $('#selectLang').val().split(' -')[0];
var unityPart  = $('#selectUnity').val().split('(')[1].slice(0, -1);

$.get('/weatherApiSetInfos?location='+cityName+"&lang="+ langPart +"&unity="+ unityPart,function(data){
alert("Update done");
});
});
$("#localisationHomePageOther").change(function(){
if($("#localisationHomePageOther").is(':checked') == 1){
$("#hidenBlockPersonalLocation").show(500);
}

}); 
$("#localisationHomePageMine").change(function(){
if($("#localisationHomePageMine").is(':checked') == 1){
$("#hidenBlockPersonalLocation").hide(500);
}

});


}
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


			
