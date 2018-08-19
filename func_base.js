'use strict';

// abstract class
module.exports = class FuncBase {
  constructor(googlehome, postData) {
    this.isValid;
    this.webhook;
    this.googlehome = googlehome;

    // common check
    // parse JSON
    try {
      // this.webhook = JSON.parse(postData).events[0];
      this.webhook = JSON.parse(postData);
    } catch (e) {
      // console.log('post_data is not JSON format.', e.message);
      this.isValid = false;
      return;
    }
  }

  // abstract method
  run() {
    // run GoogleHome operation
    throw new Error('You have to implement the method run()!');
  }
};
