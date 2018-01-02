// var config = require('./config/default.json');
var config = require('./config/myconfig.json');

// for http server
var http = require("http");
var querystring = require("querystring");

// for googlehome
var googlehome = require('google-home-notifier');
var language = 'ja'; // if not set 'us' language will be used

function googlehome_init() {
  googlehome.device(config.googlehome_name, language);
  googlehome.ip(config.googlehome_ip, language);
}

function googlehome_speak(text) {
  googlehome.notify(text, function (res) {
    console.log('googlehome_res : ' + res + '   speech_text : ' + text);
  });
}

// main()
googlehome_init();

http.createServer(function (request, response) {
  var post_data = "";

  request.on("data", function (chunk) {
    post_data += chunk;
  });
  request.on("end", function () {
    var data_text = querystring.parse(post_data).text;

    console.log("data_text : " + data_text);
    googlehome_speak("だいくんからメッセージ。" + data_text);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    // response.write('{ "text": "aa", "username": "vv" }');

    // response.writeHead(200, { "Content-Type": "text/plain" });
    // response.write("POST DATA is " + data_text);
    response.end();
  });
}).listen(config.server_port);

