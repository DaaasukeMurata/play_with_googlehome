# google-home-notifier

https://qiita.com/azipinsyan/items/db4606aaa51426ac8dac

https://github.com/noelportugal/google-home-notifier

google homeで喋らせることができる。

### Install google-home-notifier

```sh
$ npm install google-home-notifier
```



### Simple use

speech/simple_use.js内の、googlehome.ip('192.168.11.2', language);のIPを変更し、

```sh
mac-air:speaking$ node simple_use.js
notify res : Device notified   speech_text : こんにちは
```


### use with server

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
を実行することで、しゃべる。


# IFTTT連携

IFTTTとは、Webサービス同士を連携させるWebサービス。
Google Home(Google Assistant)での認識をトリガに、lineやiOSの通知などを行うことができる。

https://ifttt.com/discover


### LINEにメッセージを送る設定の例

![IFTTT img](https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_sample_1.jpg)

![IFTTT img](https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/ifttt_sample_2.jpg)


### Google Homeが認識している文字列の確認

スマホGoogle Homeアプリの、マイアクティビティで認識している文字を確認できる。
"iPhoneに"が"iPhone 2"などと認識されるため、動作しない場合確認するといい。

![activity img](https://github.com/DaaasukeMurata/play_w_googlehome/raw/images/activity.png)


