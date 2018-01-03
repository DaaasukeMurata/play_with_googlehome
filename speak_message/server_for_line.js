// var config = require('./config/default.json');
var config = require('./config/myconfig.json');

// for http server
var http = require('http');

// for googlehome
var googlehome = require('google-home-notifier');
var language = 'ja';

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
  var post_data = '';

  request.on('data', function (chunk) {
    post_data += chunk;
  });

  request.on('end', function () {
    console.log('post_data : ' + post_data);

    var webhook = JSON.parse(post_data).events[0];
    if (webhook.type != 'message' || webhook.message.type != 'text') {
      return;
    }

    // 特定の人からのメッセージのみ発話
    if (config.speakable_userid == '' || webhook.source.userId == config.speakable_userid) {
      var data_text = webhook.message.text;
      // console.log('data_text : ' + data_text);
      googlehome_speak(config.beginning_sentence + data_text);
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  });
}).listen(config.server_port);
