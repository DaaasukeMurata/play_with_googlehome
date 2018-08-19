'use strict';

// const config = require('./config/default.json');
const config = require('./config/myconfig.json');
const FuncBase = require('./func_base');

module.exports = class LineWithGoogleHome extends FuncBase {
  constructor(googlehome, postData) {
    super(googlehome, postData);
    // If failed common check in baseclass, this.isValid is false. 
    if (this.isValid == false) {
      return;
    }

    // check that webhook is line message
    if (!('events' in this.webhook)) {
      // console.log('This is not line message, because webhook.events[0] === undefined.');
      this.isValid = false;
      return;
    }
    if (this.webhook.events[0].type != 'message' || this.webhook.events[0].message.type != 'text') {
      // console.log('This is not line message, because webhook.events[0].type is not message or text.');
      this.isValid = false;
      return;
    }

    console.log('This is for Line with GoogleHome!');
    this.isValid = true;
  }

  run() {
    // If 'config.LINE_SPEAKABLE_USERS' is undefined, GoogleHome speaks anyone's message.
    if (config.LINE_SPEAKABLE_USERS == '') {
      this.googlehome.speak(this.webhook.events[0].message.text);
    }
    else {
      // speak only message from specific person
      for (let user of config.LINE_SPEAKABLE_USERS) {
        if (user.id == this.webhook.events[0].source.userId) {
          this.googlehome.speak(user.beginning_sentence + this.webhook.events[0].message.text);
          break;
        }
      }
    }
  }
};
