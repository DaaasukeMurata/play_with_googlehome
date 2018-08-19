'use strict';

const exec = require('child_process').exec;
// const config = require('./config/default.json');
const config = require('./config/myconfig.json');
const BaseWithGoogleHome = require('./func_base');
const youtube_node = require('youtube-node');

module.exports = class YoutubeWithGoogleHome extends BaseWithGoogleHome {
  constructor(googlehome, postData) {
    super(googlehome, postData);
    // If failed common check in baseclass, this.isValid is false. 
    if (this.isValid == false) {
      return;
    }

    // check that webhook is line message
    if (!('type' in this.webhook) || this.webhook.type != 'googlehome_play_youtube') {
      // console.log('This is not Youtube request, because webhook.type is not googlehome_play_youtube');
      this.isValid = false;
      return;
    }

    console.log('This is for Youtube with GoogleHome!');
    this.isValid = true;

    this.youtubeNode = new youtube_node();
    this.youtubeNode.setKey(config.YOUTUBE_API_KEY);
  }

  run() {
    let self = this;
    let keyword = this.webhook.contents;
    const YOUTUBE_CATEGOLY_MUSIC = 10;

    // 1 is search number
    this.youtubeNode.search(keyword, 1, { 'type': 'video', 'videoCategoryId': YOUTUBE_CATEGOLY_MUSIC }, function (err, result) {
      if (err) {
        console.log(err);
      }

      console.log('Youtube search result:');
      console.log(JSON.stringify(result, null, 2));
      for (const item of result.items) {
        if (item.id.videoId) {
          // speak Youtube title
          self.googlehome.speak(item.snippet.title);

          let youtubeUrl = 'https://www.youtube.com/watch?v=' + item.id.videoId;
          exec('youtube-dl --get-url --extract-audio ' + youtubeUrl, function (err, stdout) {
            if (err !== null) {
              console.log('exec error: ' + err);
            }

            const soundUrl = stdout;
            console.log('Youtube Audio URL:');
            console.log(soundUrl);

            let delay = item.snippet.title.length * 150;
            console.log('delay = ' + delay);
            self.googlehome.play(soundUrl, delay);
          });
          break;
        }
      }
    });
  }

};
