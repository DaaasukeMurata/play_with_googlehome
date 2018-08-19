'use strict';

const exec = require('child_process').exec;
// const config = require('./config/default.json');
const config = require('./config/myconfig.json');
const FuncBase = require('./func_base');
const youtube_node = require('youtube-node');

module.exports = class YoutubeWithGoogleHome extends FuncBase {
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

    this.youtubeNode = new youtube_node();
    this.youtubeNode.setKey(config.YOUTUBE_API_KEY);

    console.log('This is for Youtube with GoogleHome!');
    this.isValid = true;
  }

  run() {
    let self = this;
    let keyword = this.webhook.contents;
    const YOUTUBE_CATEGOLY_MUSIC = 10;

    this.youtubeNode.search(keyword, 1, { 'type': 'video', 'videoCategoryId': YOUTUBE_CATEGOLY_MUSIC }, function (err, result) {
      if (err) {
        console.log(err);
      }

      console.log('Youtube search result:');
      console.log(JSON.stringify(result, null, 2));
      for (const item of result.items) {
        if (item.id.videoId) {
          self.googlehome.speak(item.snippet.title);

          let youtubeUrl = 'https://www.youtube.com/watch?v=' + item.id.videoId;
          exec('youtube-dl --get-url --extract-audio ' + youtubeUrl, function (err, stdout, stderr) {
            if (err !== null) {
              console.log('exec error: ' + err);
            }

            const soundUrl = stdout;
            console.log('Youtube Audio URL:');
            console.log(soundUrl);

            self.googlehome.play(soundUrl, function (res) {
              console.log('GoogleHome res: ' + res);
            });
          });
          break;
        }
      }
    });
  }

};
