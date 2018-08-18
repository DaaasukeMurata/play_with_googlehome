// const config = require('./config/default.json');
const config = require('./config/myconfig.json');

// for http server
const http = require("http");
const querystring = require("querystring");

// for googlehome
const googlehome = require('google-home-notifier');
const language = 'ja'; // if not set 'us' language will be used

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
  let post_data = "";

  request.on("data", function (chunk) {
    post_data += chunk;
  });
  request.on("end", function () {
    const data_text = querystring.parse(post_data).text;

    console.log("data_text : " + data_text);
    googlehome_speak(config.beginning_sentence + data_text);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    // response.write('{ "text": "aaa", "username": "bbb" }');
    response.end();
  });
}).listen(config.server_port);

