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
      console.log('googlehome_res : ' + res + '   speech_text : ' + text);
    });
  }
}

// write ngrok URL to Google Spread Sheet
class NgrokURLSheet {
  constructor(sheet_key, cert_file_path) {
    let self = this;

    this.initialized = false;
    this.url_info = '';
    this.googlesheet = require('google-spreadsheet');
    this.spreadsheet = new this.googlesheet(sheet_key);

    // get sheet object of 'google-home-notifiler_ngrok_url' spread sheet
    const cert_file = require(cert_file_path);
    this.spreadsheet.useServiceAccountAuth(cert_file, function (err) {
      if (err !== undefined) {
        console.log('useServiceAccountAuth() : ' + err);
      }

      self.spreadsheet.getInfo(function (err, data) {
        if (err !== null) {
          console.log('getInfo() : ' + err);
        }

        self.sheet = data.worksheets[0];
        // in case of runnning callback after setting url
        self.initialized = true;
        self.url = self.url_info;
      });
    });
  }

  set url(url) {
    this.url_info = url;
    if (this.initialized && this.url_info != '') {
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
        console.log('getCells() : ' + err);
      }

      let cell = cells[index];
      cell.value = val;
      cell.save();
      console.log('update google spread sheet successfully. index = ' + index);
    });
  }
}

class LineWebhook {
  constructor(post_data) {
    this.isValid;
    this.webhook;

    // parse JSON
    try {
      this.webhook = JSON.parse(post_data).events[0];
    } catch (e) {
      console.log('post_data is not JSON format.', e.message);
      this.isValid = false;
      return;
    }

    // check that webhook is message
    if (this.webhook.type != 'message' || this.webhook.message.type != 'text') {
      this.isValid = false;
      return;
    }

    this.isValid = true;
  }

  get msg() {
    return this.webhook.message.text;
  }

  get user_id() {
    return this.webhook.source.userId;
  }
}

// const config = require('./config/default.json');
const config = require('./config/myconfig.json');

// for http server
const http = require('http');

// for ngrok
const ngrok = require('ngrok');

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
  let post_data = '';

  request.on('data', function (chunk) {
    post_data += chunk;
  });

  request.on('end', function () {
    console.log('');
    console.log('post_data : ');
    console.log(post_data);

    let lineWebhook = new LineWebhook(post_data);
    if (!lineWebhook.isValid) {
      return;
    }

    // If 'config.speakable_users' is undefined, GoogleHome speaks anyone's message.
    if (config.speakable_users == '') {
      googlehome.speak(lineWebhook.msg);
    }
    else {
      // speak only message from specific person
      for (let user of config.speakable_users) {
        if (user.id == lineWebhook.user_id) {
          googlehome.speak(user.beginning_sentence + lineWebhook.msg);
          break;
        }
      }
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  });
}).listen(config.server_port);
