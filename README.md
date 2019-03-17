- [LineへのメッセージをGoogleHomeでしゃべらせる](#line%E3%81%B8%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92googlehome%E3%81%A7%E3%81%97%E3%82%83%E3%81%B9%E3%82%89%E3%81%9B%E3%82%8B)
  - [ngrok](#ngrok)
    - [Installing ngrok on OSX](#installing-ngrok-on-osx)
    - [use ngrok](#use-ngrok)
  - [Line Webhook登録](#line-webhook%E7%99%BB%E9%8C%B2)
  - [httpサーバ](#http%E3%82%B5%E3%83%BC%E3%83%90)
- [ngrokでのhome server IP設定を自動化](#ngrok%E3%81%A7%E3%81%AEhome-server-ip%E8%A8%AD%E5%AE%9A%E3%82%92%E8%87%AA%E5%8B%95%E5%8C%96)
  - [outline](#outline)
  - [Google SpreadsheetへJavaScriptからアクセス](#google-spreadsheet%E3%81%B8javascript%E3%81%8B%E3%82%89%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9)
  - [Google Apps Script](#google-apps-script)
    - [Google Apps ScriptでPOSTを受け取る](#google-apps-script%E3%81%A7post%E3%82%92%E5%8F%97%E3%81%91%E5%8F%96%E3%82%8B)
- [GoogleHomeで、Youtube Music再生](#googlehome%E3%81%A7youtube-music%E5%86%8D%E7%94%9F)
  - [outline](#outline-1)
  - [IFTTT設定](#ifttt%E8%A8%AD%E5%AE%9A)
  - [youtube-node](#youtube-node)
  - [youtubeのdownload](#youtube%E3%81%AEdownload)
- [google-home-notifier](#google-home-notifier)
  - [Install google-home-notifier](#install-google-home-notifier)
  - [simple use](#simple-use)
  - [use with server](#use-with-server)
- [IFTTT連携](#ifttt%E9%80%A3%E6%90%BA)
  - [LINEにメッセージを送る設定の例](#line%E3%81%AB%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E9%80%81%E3%82%8B%E8%A8%AD%E5%AE%9A%E3%81%AE%E4%BE%8B)
  - [Google Homeが認識している文字列の確認](#google-home%E3%81%8C%E8%AA%8D%E8%AD%98%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E6%96%87%E5%AD%97%E5%88%97%E3%81%AE%E7%A2%BA%E8%AA%8D)
- [VoiceTextによる発話](#voicetext%E3%81%AB%E3%82%88%E3%82%8B%E7%99%BA%E8%A9%B1)

# LineへのメッセージをGoogleHomeでしゃべらせる

- Lineには、Webhookという、特定アカウントにメッセージ受信（など）した時に、指定URLにPOSTする機能がある

- 自宅サーバにhttpサーバを起動しておき、POSTされたらgoogle-home-notifierを使用して発話

- ルータを再起動すると、Global IPが変わってしまうので、ngrokを使用  
[ref] ngrokを使用してローカル環境を外部に公開する  
<https://qiita.com/kitaro729/items/44214f9f81d3ebda58bd>

## ngrok

### Installing ngrok on OSX

- <https://ngrok.com>

- [ref] Installing ngrok on Mac  
<https://gist.github.com/wosephjeber/aa174fb851dfe87e644e>

```sh
# cd into your local bin directory
cd /usr/local/bin

# create symlink
ln -s /Applications/ngrok ngrok
```

### use ngrok

```sh
# create symlink
ngrok http 8080

# 下記の様な画面が表示される。これでhttp://3a166b22.ngrok.ioにアクセスすれば、localhost:8080へのアクセスとなる
ngrok by @inconshreveable                                                                                            (Ctrl+C to quit)

Session Status                online
Version                       2.2.8
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://3a166b22.ngrok.io -> localhost:8080
Forwarding                    https://3a166b22.ngrok.io -> localhost:8080
```

## Line Webhook登録

- [ref] LINE Messaging APIを試してみた  
<https://techblog.recochoku.jp/1835>

- 発信先のURLは、ngrokで生成したアドレスにする。

## httpサーバ

index.js参照


# ngrokでのhome server IP設定を自動化 

[ref] google-home-notifier周りをほぼ自動化した  
<https://qiita.com/k_keisuke/items/3e67aa25a24f07656f47>

## outline

- サーバ起動時にngrokで生成したURLを、Google spreadsheetに記載

- Line Webhook -> Google Apps ScriptでGoogle spreadsheetからURL読み込み、転送

## Google SpreadsheetへJavaScriptからアクセス

- [ref] Google APIを使う際に、APIを有効化して認証キーを取得する方法  
<https://www.yoheim.net/blog.php?q=20160411>

1. [Google Developer Console](https://console.developers.google.com/)で、Google Spread SheetのAPIを有効にして認証用のjsonファイルを取得

2. 新規Google Spread Sheet作成。URLからアクセス先を確認

3. JavaScriptのgoogle-spreadsheetを使用して更新


```sh
$ npm install google-spreadsheet
```

[howto] Simple Google Spreadsheet Access (node.js)  
<https://www.npmjs.com/package/google-spreadsheet>

## Google Apps Script

- [ref] Google Apps Script 入門  
<https://qiita.com/t_imagawa/items/47fc130a419b9be0b447>


### Google Apps ScriptでPOSTを受け取る

- [ref] Slack上のメッセージをGoogleAppsScriptで受け取ってよしなに使う  
<https://qiita.com/kyo_nanba/items/83b646357d592eb9a87b>

- [ref] Google Apps ScriptのdoPostでJSONなパラメータのPOSTリクエストを受ける  
<https://qiita.com/shirakiya/items/db22de49f00710478cfc>

- [ref] doPost()をデバッグしたい  
<https://okawa.routecompass.net/gas-log/>




# GoogleHomeで、Youtube Music再生

[ref] Google Home自身でYoutubeの音楽を再生する  
<https://qiita.com/odetarou/items/0e134ff845826d16170c>

## outline

- GoogleHome(Google Assistant) -> IFTTT -> Google Apps Script -> home server -> GoogleHome

- Google Apps Scriptで、SpreadSheetに記載されたngrokのIPへPOST

- Youtubeの検索は、JavaScriptのパッケージ`youtube-node`を使用

- YoutubeからのDLは、`youtube-dl`を使用。optionで音楽データへの変換も可能。

- GoogleHomeでの再生は、`google-home-notifiler`を使用

## IFTTT設定

<img src="https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_youtube_01.jpg" width="400px">

<img src="https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_youtube_02.jpg" width="400px">

<img src="https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_youtube_03.jpg" width="400px">


## youtube-node

**install**

[ref] youtube-node  
<https://www.npmjs.com/package/youtube-node>

```sh
npm install youtube-node
```

**youtube api key**

- [ref] 承認の認証情報を取得する  
<https://developers.google.com/youtube/registering_an_application?hl=ja>

- [ref] YouTube API APIキーの取得方法  
<https://qiita.com/chieeeeno/items/ba0d2fb0a45db786746f>


## youtubeのdownload

`youtube-dl`を使用。

<http://rg3.github.io/youtube-dl/index.html>



- [ref] youtube-dlでYouTube動画をダウンロードする方法  
  <https://qiita.com/fantm21/items/8be5c1c5f1b9043269a2>

**install**

```sh
# [ref] http://rg3.github.io/youtube-dl/download.html
brew install youtube-dl
```

**JavaScriptからの実行**

```js
const  exec = require('child_process').exec;

exec('youtube-dl --get-url --extract-audio https://www.youtube.com/watch?v=XXXXXX', function (err, stdout, stderr) {
if (err !== null) {
   console.log(err);
}
const soundUrl = stdout;
```


# google-home-notifier

- [ref] GoogleHomeスピーカーに外部からプッシュして自発的に話してもらいます  
<https://qiita.com/azipinsyan/items/db4606aaa51426ac8dac>

- GitHub : google-home-notifier  
<https://github.com/noelportugal/google-home-notifier>

google homeで喋らせることができる。

## Install google-home-notifier

```sh
$ npm install google-home-notifier
```

## simple use

speech/simple_use.js内の、googlehome.ip('192.168.11.2', language);のIPを変更し、

```sh
mac-air:speaking$ node simple_use.js
notify res : Device notified   speech_text : こんにちは
```

## use with server

```sh
mac-air:speaking$ node example.js
Endpoints:
    http://192.168.11.2:8091/google-home-notifier
    https://1078ee5e.ngrok.io/google-home-notifier
GET example:
curl -X GET https://1078ee5e.ngrok.io/google-home-notifier?text=Hello+Google+Home
POST example:
curl -X POST -d "text=Hello Google Home" https://1078ee5e.ngrok.io/google-home-notifier
```

最後にある

```sh
$ curl -X POST -d "text=Hello Google Home" https://1078ee5e.ngrok.io/google-home-notifier
```

を実行することで、`text`の文字列をしゃべる。

# IFTTT連携

IFTTTとは、Webサービス同士を連携させるWebサービス。
Google Home(Google Assistant)での認識をトリガに、lineやiOSの通知などを行うことができる。

<https://ifttt.com/discover>

## LINEにメッセージを送る設定の例

<img src="https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_sample_1.jpg" width="400px">
<img src="https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_sample_2.jpg" width="400px">

## Google Homeが認識している文字列の確認

スマホGoogle Homeアプリの、マイアクティビティで認識している文字を確認できる。
"iPhoneに"が"iPhone 2"などと認識されるため、動作しない場合確認するといい。

<img src="https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/activity.png" width="300px">


# VoiceTextによる発話

ref : https://qiita.com/nori-dev-akg/items/bad7eb0c41617110cfa4

- google-home-notifier自体を変更して、textのURL取得箇所を変更

- VoiceText(https://cloud.voicetext.jp/webapi/)を使ってwavを取得

- google-homeはURLでしか音声ファイルを渡せないため、音声ファイルを公開するサーバを起動（api.js）

```
forever -w start api.js
node index.js
```

