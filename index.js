'use strict';

// const config = require('./config/default.json');
const config = require('./config/myconfig.json');

const http = require('http');
const ngrok = require('ngrok');

// for my modules
const myUtil = require('./func_util');
const LineWithGoogleHome = require('./func_line');
const YoutubeWithGoogleHome = require('./func_youtube');

// --- main()
let googlehome = new myUtil.GoogleHomeOp(config.GOOGLEHOME_NAME, config.GOOGLEHOME_IP);
let ngrokURLSheet = new myUtil.NgrokURLSheet(config.GOOGLESHEET_ID, config.GOOGLESHEET_CERT_FILE);

// run ngrok, and update URL in spread sheet
ngrok.connect({ authtoken: config.NGROK_AUTH_TOKEN, addr: config.SERVER_PORT }, function (err, url) {
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

    let lineWithGoogleHome = new LineWithGoogleHome(googlehome, postdata);
    if (lineWithGoogleHome.isValid) {
      lineWithGoogleHome.run();
    }

    let youtubeWithGoogleHome = new YoutubeWithGoogleHome(googlehome, postdata);
    if (youtubeWithGoogleHome.isValid) {
      youtubeWithGoogleHome.run();
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
  });
}).listen(config.SERVER_PORT);
