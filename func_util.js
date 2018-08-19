'use strict';

// operate GoogleHome
class GoogleHomeOp {
  constructor(name, ip) {
    this.googlehome = require('google-home-notifier');
    this.LANG = 'ja';

    this.googlehome.device(name, this.LANG);
    this.googlehome.ip(ip, this.LANG);
  }

  // speak text
  speak(text) {
    this.googlehome.notify(text, function (res) {
      console.log('GoogleHome speak:');
      console.log('  res = ' + res);
      console.log('  text = ' + text);
    });
  }

  // play music
  play(url, delay = 0) {
    let self = this;
    setTimeout(function () {
      self.googlehome.play(url, function (res) {
        console.log('GoogleHome play:');
        console.log('  res = ' + res);
      });
    }, delay);
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

module.exports = {
  GoogleHomeOp,
  NgrokURLSheet
};