<!-- TOC -->

- [Lineへの投稿をGoogleHomeでしゃべらせる](#lineへの投稿をgooglehomeでしゃべらせる)
    - [ngrok](#ngrok)
        - [Installing ngrok on OSX](#installing-ngrok-on-osx)
        - [use ngrok](#use-ngrok)
    - [Line](#line)
    - [Slacker Channnelへのoutgoint web hook登録](#slacker-channnelへのoutgoint-web-hook登録)
    - [httpサーバ](#httpサーバ)
- [Slackへの投稿をGoogleHomeでしゃべらせる](#slackへの投稿をgooglehomeでしゃべらせる)
    - [Slacker Channnelへのoutgoint web hook登録](#slacker-channnelへのoutgoint-web-hook登録-1)
    - [httpサーバ](#httpサーバ-1)
- [google-home-notifier](#google-home-notifier)
    - [Install google-home-notifier](#install-google-home-notifier)
    - [simple use](#simple-use)
    - [use with server](#use-with-server)
- [IFTTT連携](#ifttt連携)
    - [LINEにメッセージを送る設定の例](#lineにメッセージを送る設定の例)
    - [Google Homeが認識している文字列の確認](#google-homeが認識している文字列の確認)

<!-- /TOC -->

# Lineへの投稿をGoogleHomeでしゃべらせる

- Lineには、Webhookという、特定アカウントにメッセージ受信（など）した時に、指定URLにPOSTする機能がある

- 自宅サーバにhttpサーバを起動しておき、POSTされたらgoogle-home-notifierを使用して発話

- ルータを再起動すると、Global IPが変わってしまうので、ngrokを使用
https://qiita.com/kitaro729/items/44214f9f81d3ebda58bd

## ngrok

### Installing ngrok on OSX

https://ngrok.com

https://gist.github.com/wosephjeber/aa174fb851dfe87e644e

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

## Line 

https://techblog.recochoku.jp/1835

発信先のURLは、ngrokで生成したアドレスにする。



## Slacker Channnelへのoutgoint web hook登録

http://blog.nakajix.jp/entry/2016/02/12/090000

発信先のURLは、ngrokで生成したアドレスにする。

## httpサーバ

speak_message/server_for_line.js参照



# Slackへの投稿をGoogleHomeでしゃべらせる

- Slackerには、Outgoing Webhooksという、投稿時に指定URLにPOSTする機能がある

- あとはLineと一緒


## Slacker Channnelへのoutgoint web hook登録

http://blog.nakajix.jp/entry/2016/02/12/090000

発信先のURLは、ngrokで生成したアドレスにする。


## httpサーバ

speak_message/server_for_slacker.js参照



# google-home-notifier

https://qiita.com/azipinsyan/items/db4606aaa51426ac8dac

https://github.com/noelportugal/google-home-notifier

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

https://ifttt.com/discover


## LINEにメッセージを送る設定の例

![IFTTT img](https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_sample_1.jpg)

![IFTTT img](https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_sample_2.jpg)


## Google Homeが認識している文字列の確認

スマホGoogle Homeアプリの、マイアクティビティで認識している文字を確認できる。
"iPhoneに"が"iPhone 2"などと認識されるため、動作しない場合確認するといい。

![activity img](https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/activity.png)


