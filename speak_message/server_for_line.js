// const config = require('./config/default.json');
const config = require('./config/myconfig.json');

// for http server
const http = require('http');

// for googlehome
const googlehome = require('google-home-notifier');
const language = 'ja';

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
  let post_data = '';

  request.on('data', function (chunk) {
    post_data += chunk;
  });

  request.on('end', function () {
    console.log('post_data : ' + post_data);

    const webhook = JSON.parse(post_data).events[0];
    if (webhook.type != 'message' || webhook.message.type != 'text') {
      return;
    }

    const data_text = webhook.message.text;

    // speakable_usersがいない場合は、誰でも発話
    if (config.speakable_users == '') {
      googlehome_speak(data_text);
    }
    else {
      // 特定の人からのメッセージのみ発話
      let speakable_user = config.speakable_users.filter(function (item, index) {
        if (item.id == webhook.source.userId) return true;
      });

      if (typeof speakable_user[0] !== "undefined") {
        googlehome_speak(speakable_user[0].beginning_sentence + data_text);
      }
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  });
}).listen(config.server_port);
