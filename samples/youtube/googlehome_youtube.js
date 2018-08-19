'use strict';

const config = require('./local_config.json');

const exec = require('child_process').exec;

const Youtube = require('youtube-node');
const youtube = new Youtube();
youtube.setKey(config.YOUTUBE_API_KEY);

const notifier = require('google-home-notifier');
notifier.ip(config.GOOGLEHOME_IP);
notifier.device(config.GOOGLEHOME_NAME, config.GOOGLEHOME_LANG);

let keyword = 'bonnie pink';
const YOUTUBE_CATEGOLY_MUSIC = 10;

youtube.search(keyword, 1, { 'type': 'video', 'videoCategoryId': YOUTUBE_CATEGOLY_MUSIC }, function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Youtube search result:');
  console.log(JSON.stringify(result, null, 2));
  for (const item of result.items) {
    if (item.id.videoId) {
      let youtubeUrl = 'https://www.youtube.com/watch?v=' + item.id.videoId;
      exec('youtube-dl --get-url --extract-audio ' + youtubeUrl, function (err, stdout, stderr) {
        if (err !== null) {
          console.log('exec error: ' + err);
        }
        const soundUrl = stdout;
        console.log('Youtube Audio URL:');
        console.log(soundUrl);

        notifier.play(soundUrl, function (res) {
          console.log('GoogleHome res: ' + res);
        });
      });
      break;
    }
  }
});



