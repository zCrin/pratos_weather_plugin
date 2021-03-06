var loadedSlick  =0;
$.get("/weatherNeedsLocation",function(data){
if(data == 0){
show_data("<p style='font-size:130%;padding:8% 3%; line-height: 200%; text-align:center;'>No API Key registered<br />To add one, please go to <a href='/admin/settings/'>Settings/Weather</a></p>");
}
else if(data=='yes'){

if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position){

$.get("/weatherApiGetData?long="+ position.coords.longitude+"&lat="+ position.coords.latitude,function(data){
dealData(data);
});
},function(error){show_data("<p style='font-size:130%;padding:8% 3%; line-height: 200%; text-align:center;'> There was an error while fecthing location.<br />Please make sure the URL is https.<br />You may want to set a fixed location here <a href='/admin/settings/'>Settings/Weather</a></p>");});
    } else {
show_data("<p style='font-size:130%;padding:8% 3%; line-height: 200%; text-align:center;'> Geolocation is not supported by this browser .<br />You may want to set a default location here <a href='/admin/settings/'>Settings/Weather</a></p>");
       
    }
}else{
$.get("/weatherApiGetData",function(data){
dealData(data);
});
}

});
function show_data(data){

if(corres){
if(corres.length == 1){
				$('#Weather_plugin > .content').html(data);
}
else{
if(! loadedSlick){
setTimeout(function(){$('#slick-slide0'+corres['Weather'] + ' > .content'). html(data); loadedSlick=1;},3000);
}else{
$('#slick-slide0'+corres['Weather'] + ' > .content'). html(data);
}
}
}else{
				$('#Weather_plugin > .content'). html(data);
}
}


function dealData(data){
var infos = JSON.parse(data);
//infos.name
//infos.weather[0].description. capitalize()
//infos.main.temp,pressure
var tIcon = 'day-';
if(Date.now() < infos.sys.sunrise || Date.now() > infos.sys.sunset){
tIcon = 'night-';
}
var tempP = '4';
if(corres){
if(corres.length == 1){
var tempP = '8';
}
}else{
var tempP = '8';
}


var windIcon= "<i class='wi weatherIcon wi-strong-wind'></i> &nbsp; ";
if(infos.wind.deg){
windIcon = "<i style='font-size:120%' class='wi weatherIcon wi-wind from-"+ infos.wind.deg +"-deg'></i>&nbsp; ";
}
var gColor = $("h1").css("color");
var bColor = $("body").css("background-color");
$("head").append('<link rel="stylesheet" type="text/css" href="/weather-icons.min.css"/> <link rel="stylesheet" type="text/css" href="/weather-icons-wind.min.css"/>');
show_data("<style>.weatherIcon{color:"+ bColor +";}</style><div style='display:flex; padding:"+tempP+"% 4%;justify-content: space-around;flex-wrap: wrap;align-items: center;'><i style='font-size:300%;color:"+gColor+";'class='wi wi-owm-"+tIcon+infos.weather[0].id+"'></i><div><h4 style='font-size:200%;margin:0;'>"+infos.name+"</h4><h5 style='font-size:120%;font-weight:200;margin:0;'>"+infos. weather[0].description. capitalize() +". </h5></div></div><div style='text-align:center; font-size:300%; color:"+gColor+";'>"+ infos.main.temp +"</div><div style='display:flex; font-size:120%;padding: "+tempP/2+"% 4%;justify-content: space-around;flex-wrap: wrap;align-items: center;'><div><i class='wi weatherIcon  wi-barometer'></i> &nbsp; "+ infos.main.pressure +" hPa </div> <div><i class='wi weatherIcon  wi-humidity'></i>&nbsp; "+ infos.main.humidity +" % </div> <div> "+ windIcon+ infos.wind.speed +"</div></div> <div style='display:flex; font-size:120%;padding: "+tempP/2+"% 4%;justify-content: space-around;flex-wrap: wrap;align-items: center;'><div><i class='wi weatherIcon  wi-sunrise'></i> &nbsp; "+ sunrise_set( infos.sys.sunrise)+"</div><div><i class='wi weatherIcon  wi-sunset'></i> &nbsp; "+ sunrise_set( infos.sys.sunset)+"</div></div>");
 }
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function sunrise_set(data){
var date = new Date(data*1000);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
return hours + ':' + minutes.substr(-2);
}