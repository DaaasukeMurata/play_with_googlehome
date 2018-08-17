// const config = require('./config/default.json');
const config = require('./config/myconfig.json');

// for http server
const http = require('http');

// for Google Home
const googlehome = require('google-home-notifier');
const googlehome_lang = 'ja';

// for Google spreadsheet
const googlesheet = require('google-spreadsheet');
const googlesheet_ngrok = new googlesheet(config.googlesheet_key);
const googlesheet_cert = require(config.googlesheet_cert_file);

// for ngrok
const ngrok = require('ngrok');

function googlehome_init() {
  googlehome.device(config.googlehome_name, googlehome_lang);
  googlehome.ip(config.googlehome_ip, googlehome_lang);
}

function googlehome_speak(text) {
  googlehome.notify(text, function (res) {
    console.log('googlehome_res : ' + res + '   speech_text : ' + text);
  });
}

// main()
googlehome_init();

// get "google-home-notifiler_ngrok_url" spread sheet
let sheet;
googlesheet_ngrok.useServiceAccountAuth(googlesheet_cert, function (err) {
  googlesheet_ngrok.getInfo(function (err, data) {
    sheet = data.worksheets[0];
  });
});

// run ngrok, and update URL in spread sheet
ngrok.connect(config.server_port, function (err, url) {
  console.log('Endpoints:');
  console.log('  ' + url);

  sheet.getCells({
    'min-row': 1,
    'max-row': 1,
    'min-col': 1,
    'max-col': 1,
    'return-empty': true
  }, function (err, cells) {
    let cell = cells[0];
    cell.value = url;
    cell.save();
    console.log('update google spread sheet successfully');
  });
});

// listen localhost's port
http.createServer(function (request, response) {
  let post_data = '';

  request.on('data', function (chunk) {
    post_data += chunk;
  });

  request.on('end', function () {
    console.log('post_data : ' + post_data);

    let webhook;
    try {
      webhook = JSON.parse(post_data).events[0];
    } catch (e) {
      console.log("post_data is not JSON format", e.message);
      return;
    }

    if (webhook.type != 'message' || webhook.message.type != 'text') {
      return;
    }

    const data_text = webhook.message.text;

    // If 'config.speakable_users' is undefined, google home speaks anyone's message.
    if (config.speakable_users == '') {
      googlehome_speak(data_text);
    }
    else {
      // speak only message from specific person
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
