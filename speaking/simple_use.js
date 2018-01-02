var googlehome = require('google-home-notifier');
var language = 'ja'; // if not set 'us' language will be used

// googlehome.deviceだけではしゃべらず、googlehome.ipだけでは言語設定が反映されない
googlehome.device('googlehome_daisuke', language); // Change to your Google Home name
// or if you know your Google Home IP
googlehome.ip('192.168.11.2', language);

var speech_text = 'こんにちは';

googlehome.notify(speech_text, function (res) {
  console.log('notify_res : ' + res + '   speech_text : ' + speech_text);
});

