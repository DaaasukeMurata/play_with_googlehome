'use strict';

// operate GoogleHome
class GoogleHomeOp {
  constructor(name, ip) {
    this.googlehome = require('google-home-notifier');
    this.LANG = 'ja';

    this.googlehome.device(name, this.LANG);
    this.googlehome.ip(ip, this.LANG);
  }

  speak(text) {
    this.googlehome.notify(text, function (res) {
      console.log('GoogleHome speak:');
      console.log('  res = ' + res);
      console.log('  text = ' + text);
    });
  }

  play(url) {
    this.googlehome.play(url, function (res) {
      console.log('GoogleHome play:');
      console.log('  res = ' + res);
    });
  }
}

// write ngrok URL to Google Spread Sheet
class NgrokURLSheet {
  constructor(sheetKey, certFilePath) {
    let self = this;

    this.initialized = false;
    this.urlInfo = '';
    this.googlesheet = require('google-spreadsheet');
    this.spreadsheet = new this.googlesheet(sheetKey);

    // get sheet object of 'google-home-notifiler_ngrok_url' spread sheet
    const credentials = require(certFilePath);
    this.spreadsheet.useServiceAccountAuth(credentials, function (err) {
      if (err !== undefined) {
        console.log('[ERR] useServiceAccountAuth() : ' + err);
      }

      self.spreadsheet.getInfo(function (err, data) {
        if (err !== null) {
          console.log('[ERR] getInfo() : ' + err);
        }

        self.sheet = data.worksheets[0];
        // in case of runnning callback after setting url
        self.initialized = true;
        self.url = self.urlInfo;
      });
    });
  }

  set url(url) {
    this.urlInfo = url;
    if (this.initialized && this.urlInfo != '') {
      this._setValue(0, url);
    }
  }

  // write val to spreadsheet.
  // index is number of cols.
  _setValue(index, val) {
    this.sheet.getCells({
      'min-col': 1,
      'max-col': index + 1,
      'return-empty': true
    }, function (err, cells) {

      if (err !== null) {
        console.log('[ERR] getCells() : ' + err);
      }

      let cell = cells[index];
      cell.value = val;
      cell.save();
      console.log('update google spread sheet successfully. index = ' + index);
    });
  }
}

class LineWebhook {
  constructor(postData) {
    this.isValid;
    this.webhook;

    // parse JSON
    try {
      // this.webhook = JSON.parse(postData).events[0];
      this.webhook = JSON.parse(postData);
    } catch (e) {
      console.log('post_data is not JSON format.', e.message);
      this.isValid = false;
      return;
    }

    // check that webhook is line message
    if (!('events' in this.webhook)) {
      console.log('This is not line message, because webhook.events[0] === undefined.');
      this.isValid = false;
      return;
    }
    if (this.webhook.events[0].type != 'message' || this.webhook.events[0].message.type != 'text') {
      console.log('This is not line message, because webhook.events[0].type is not message or text.');
      this.isValid = false;
      return;
    }

    console.log('This is line message.');
    this.isValid = true;
  }

  get msg() {
    return this.webhook.events[0].message.text;
  }

  get userId() {
    return this.webhook.events[0].source.userId;
  }
}



class YoutubeWebhook {
  constructor(postData) {
    this.isValid;
    this.webhook;

    // parse JSON
    try {
      // this.webhook = JSON.parse(postData).events[0];
      this.webhook = JSON.parse(postData);
    } catch (e) {
      console.log('post_data is not JSON format.', e.message);
      this.isValid = false;
      return;
    }

    // check that webhook is line message
    if (!('type' in this.webhook) || this.webhook.type != 'googlehome_play_youtube') {
      console.log('This is not Youtube request, because webhook.type is not googlehome_play_youtube');
      this.isValid = false;
      return;
    }

    console.log('This is Youtube request.');
    this.isValid = true;
  }

  get contents() {
    return this.webhook.contents;
  }
}


const exec = require('child_process').exec;

// const config = require('./config/default.json');
const config = require('./config/myconfig.json');

// for http server
const http = require('http');

// for ngrok
const ngrok = require('ngrok');

// for youtube
const Youtube = require('youtube-node');
const youtube = new Youtube();
youtube.setKey(config.youtube_api_key);

// --- main()
let googlehome = new GoogleHomeOp(config.googlehome_name, config.googlehome_ip);
let ngrokURLSheet = new NgrokURLSheet(config.googlesheet_key, config.googlesheet_cert_file);

// run ngrok, and update URL in spread sheet
ngrok.connect({ authtoken: config.ngrok_authtoken, addr: config.server_port }, function (err, url) {
  console.log('Endpoints:');
  console.log('  ' + url);

  ngrokURLSheet.url = url;
});

// listen localhost's port
http.createServer(function (request, response) {
  let postdata = '';

  request.on('data', function (chunk) {
    postdata += chunk;
  });

  request.on('end', function () {
    console.log('');
    console.log('post_data : ');
    console.log(postdata);

    let lineWebhook = new LineWebhook(postdata);
    let youtubeWebhook = new YoutubeWebhook(postdata);

    if (lineWebhook.isValid) {
      // If 'config.speakable_users' is undefined, GoogleHome speaks anyone's message.
      if (config.speakable_users == '') {
        googlehome.speak(lineWebhook.msg);
      }
      else {
        // speak only message from specific person
        for (let user of config.speakable_users) {
          if (user.id == lineWebhook.userId) {
            googlehome.speak(user.beginning_sentence + lineWebhook.msg);
            break;
          }
        }
      }
    } else if (youtubeWebhook.isValid) {
      let keyword = youtubeWebhook.contents;
      const YOUTUBE_CATEGOLY_MUSIC = 10;

      youtube.search(keyword, 1, { 'type': 'video', 'videoCategoryId': YOUTUBE_CATEGOLY_MUSIC }, function (err, result) {
        if (err) {
          console.log(err);
        }

        console.log('Youtube search result:');
        console.log(JSON.stringify(result, null, 2));
        for (const item of result.items) {
          if (item.id.videoId) {
            googlehome.speak(item.snippet.title);

            let youtubeUrl = 'https://www.youtube.com/watch?v=' + item.id.videoId;
            exec('youtube-dl --get-url --extract-audio ' + youtubeUrl, function (err, stdout, stderr) {
              if (err !== null) {
                console.log('exec error: ' + err);
              }

              const soundUrl = stdout;
              console.log('Youtube Audio URL:');
              console.log(soundUrl);

              googlehome.play(soundUrl, function (res) {
                console.log('GoogleHome res: ' + res);
              });
            });
            break;
          }
        }
      });
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  });
}).listen(config.server_port);
